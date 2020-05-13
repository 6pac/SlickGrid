/***
 * A plugin which adds few utilities related to Tree Data View
 */
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "TreeData": TreeData
      }
    }
  });

  /** Constructor of the Row Detail View Plugin */
  function TreeData() {

    /**
     * Initialize the plugin
     */
    function init() {
    }

    /**
     * Private variables
     */
    var flatData = [1];
    var nestedData = []; // [] || {};
    var flatObj = {}; //hashtable for fast lookups

    this.getFlatData = function(){
      return flatData;
    }
    this.getNestedData = function(){
      return nestedData;
    }

    /**
     * Private method to determine type
     * @property {*}
     * @returns {string}
     */
    function type_of(x) {
      return Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
    }

    /**
     * Options Object to be passed to several TreeData functions
     * @typedef {Object} Options 
     * @property {string} [childrenPropName='children']
     * @property {string} [parentPropName='__parentId']
     * @property {string} [identifierPropName='id']
     * @property {string} [treeLevelPropName='__treeLevel']
     * @property {string} [hasChildrenFlagPropName='__hasChildren']
     * @property {Array|Object} [treeOutputType=[]]
     * @property {Array<string>} [aggregatorProps=[]]
     */

    /**
     * Convert a flat array (with "parentId" references) into a hierarchical dataset structure (where children are array(s) inside their parent objects)
     * @param {Array} flatArray array input
     * @param {Options} options you can provide the following options:: "parentPropName" (defaults to "parent"), "childrenPropName" (defaults to "children") and "identifierPropName" (defaults to "id")
     * @returns {Array|Object} output as nested Array of Objects or Object of Objects.
     */
    function convertParentChildFlatArrayToHierarchicalView(flatArray, options) {
      const childrenPropName = options && options.childrenPropName || 'children';
      const parentPropName = options && options.parentPropName || '__parentId';
      const identifierPropName = options && options.identifierPropName || 'id';
      const treeLevelPropName = options && options.treeLevelPropName || '__treeLevel';
      const hasChildrenFlagPropName = options && options.hasChildrenFlagPropName || '__hasChildren';
      const aggregatorProps = options && options.aggregatorProps || [];
      const inputArray = $.extend(true, [], flatArray);
      //give the caller the chance to output nested array of objects or nested object of objects:
      //the caller can call with options.treeOutputType can be [] or {} (defaults to []);
      let outputAsArray = options && (type_of(options.treeOutputType) == 'array') || false;
      const outputAsObject = options && (type_of(options.treeOutputType) == 'object') || false;
      if (outputAsArray == false && outputAsObject == false){ outputAsArray = true }; //default to array

      // things without parent
      const roots = [];
      // make them accessible by guid on this map
      const all = {};
      //alternative output as real object of objects:
      const tree = {};

      inputArray.forEach(function (item) {
        all[item[identifierPropName]] = item
      });      

      //add aggregate props:
      for (let i = inputArray.length - 1; i >= 0; i--){
        const item = inputArray[i];
        //console.log('item', item)
        for (const prop of aggregatorProps){
          if (item[parentPropName] != null){
            const currPropVal = all[item[parentPropName]][`__agg__${prop}`] || 0;
            all[item[parentPropName]][`__agg__${prop}`] = currPropVal + (item[`__agg__${prop}`] || item[prop]);
          }
        }                
      }

      //If flatObj not yet initialized, then set it up:
      const needToInitFlatObj = Object.keys(flatObj).length == 0;
      if (needToInitFlatObj){
        Object.entries(all).forEach(function ([key, val]) {
          //make a shallow copy, otherwise you get reference pointer issues:
          flatObj[key] = {...val}
        });
      }

      console.log('flatObj', flatObj)

      // connect childrens to its parent, and split roots apart
      Object.keys(all).forEach(function (id) {
        const item = all[id];
        if (item[parentPropName] === null || !item.hasOwnProperty(parentPropName)) {
          outputAsArray ? roots.push(item) : tree[item[identifierPropName]] = item;
        } else if (item[parentPropName] in all) {
          const p = all[item[parentPropName]];
          if (!(childrenPropName in p)) {
            p[childrenPropName] = outputAsArray ? [] : {};            
          }
          outputAsArray ? p[childrenPropName].push(item) : p[childrenPropName][item[identifierPropName]] = item;
        }

        // delete any unnecessary properties that were possibly created in the flat array but shouldn't be part of the tree data
        delete item[treeLevelPropName];
        delete item[hasChildrenFlagPropName];
      });

      return outputAsArray ? roots : tree;
    }

    /**
     * Convert a hierarchical array/object (with children) into a flat array structure array (where the children are pushed as next indexed item in the array)
     * @param {Object|Array} hierarchicalArrayOrObj input nested Array of Objects or Object of Objects.
     * @param {Options} options you can provide "childrenPropName" (defaults to "children")
     * @returns {Array} outputArray (flat array)
     */
    function convertHierarchicalViewToFlatArray(hierarchicalArrayOrObj, options) {
      //if the caller calls with array of objects or object of objects [] or {} will be detected:
      let inputAsArray = (type_of(hierarchicalArrayOrObj) == 'array') || false;
      const inputAsObject = (type_of(hierarchicalArrayOrObj) == 'object') || false;
      if (inputAsArray == false && inputAsObject == false){ inputAsArray = true }; //default to array

      const outputArray = []; //the flat output will be a flat array of objects
      //$.extend(): true makes a deep copy, [] gives me any array at the end, last arg is input to copy.
      //returns deep copy of new array (default from above)
      //Or we can now also call this with a deep copy of an object of objects with {}:
      const deepCopy = inputAsArray ?
        $.extend(true, [], hierarchicalArrayOrObj):
        $.extend(true, {}, hierarchicalArrayOrObj);
      convertHierarchicalViewToFlatArrayByOutputArrayReference(deepCopy, outputArray, options, 0);

      // the output array is the one passed as reference
      return outputArray;
    }

    /**
     * Convert a hierarchical array/object (with children) into a flat array structure array but using the array as the output (the array is the pointer reference)
     * @param {Object|Array} hierarchicalArrayOrObj
     * @param {Array} outputArray the outputArray is passed by reference and is mutated directly
     * @param {Options} options you can provide "childrenPropName" (defaults to "children")
     * @param {number} treeLevel the depth of the nested objects is tracked
     * @param {number} [parentId] the parent ID is tracked if a parent exists
     * @returns {void} the outputArray is passed by reference and is mutated directly
     */
    function convertHierarchicalViewToFlatArrayByOutputArrayReference(hierarchicalArrayOrObj, outputArray, options, treeLevel, parentId) {
      const childrenPropName = options && options.childrenPropName || 'children';
      const identifierPropName = options && options.identifierPropName || 'id';
      const hasChildrenFlagPropName = options && options.hasChildrenFlagPropName || '__hasChildren';
      const treeLevelPropName = options && options.treeLevelPropName || '__treeLevel';
      const parentPropName = options && options.parentPropName || '__parentId';
      const aggregatorProps = options && options.aggregatorProps || [];
      let inputAsArray = (type_of(hierarchicalArrayOrObj) == 'array') || false;
      const inputAsObject = (type_of(hierarchicalArrayOrObj) == 'object') || false;
      if (inputAsArray == false && inputAsObject == false){ inputAsArray = true }; //default to array

      if (Array.isArray(hierarchicalArrayOrObj) || inputAsObject) {
        const iterable = (hierarchicalArrayOrObj instanceof Array) ?
          hierarchicalArrayOrObj:
          Object.values(hierarchicalArrayOrObj) || []; 
        for (const item of iterable) {
          if (item) {
            const itemExist = outputArray.find(itm => itm[identifierPropName] === item[identifierPropName]) || false;
            if (!itemExist) {
              item[treeLevelPropName] = treeLevel; // save tree level ref
              item[parentPropName] = parentId || null;
              outputArray.push(item); //top level is always an array
            }
            if (Array.isArray(item[childrenPropName]) || type_of(item[childrenPropName]) == 'object') {
              treeLevel++;
              convertHierarchicalViewToFlatArrayByOutputArrayReference(item[childrenPropName], outputArray, options, treeLevel, item[identifierPropName]);
              treeLevel--;
              item[hasChildrenFlagPropName] = true;
              delete item[childrenPropName]; // remove the children property
            }
          }
        }
      }
    }

    /**
     * A function to return flat data with tree levels and nested data
     * @param {Array | Object} initData 
     * @param {boolean} inputDataIsFlat 
     * @param {Options} options 
     */
    function fromInputReturnFlatAndNestedDataStructures(initData, inputDataIsFlat, options){
      const childrenPropName = options && options.childrenPropName || 'children';
      const identifierPropName = options && options.identifierPropName || 'id';
      const hasChildrenFlagPropName = options && options.hasChildrenFlagPropName || '__hasChildren';
      const treeLevelPropName = options && options.treeLevelPropName || '__treeLevel';
      const parentPropName = options && options.parentPropName || '__parentId';
      const aggregatorProps = options && options.aggregatorProps || [];
      let [flat, nested] = [null, null]; //to be determined.
      const isInputArray = (initData instanceof Array);
      
      //only check data structure if inputDataIsFlat is not passed in as arg
      if (inputDataIsFlat == undefined || inputDataIsFlat == null ){
        inputDataIsFlat = true;
        if (isInputArray){
          for (let i = initData.length - 1; i >= 0; i--){
            const item = initData[i];
            if (item[childrenPropName] && item[childrenPropName] instanceof Object){
              inputDataIsFlat = false;
              //break out of the loop we know what the data type is
              break;
            } 
          }    
        } else {
          inputDataIsFlat = false;
        } 
      }                  

      if (inputDataIsFlat){          
        nested = convertParentChildFlatArrayToHierarchicalView(initData, options)
        flat = initData;
      } else { //then its nested
        flat = convertHierarchicalViewToFlatArray(initData, options);
        //needed to add aggregator props:
        nested = convertParentChildFlatArrayToHierarchicalView(flat, options)
      }
      
      //add aggregate props:
      for (let i = flat.length - 1; i >= 0; i--){
        const item = flat[i];
        //console.log('item', item)
        for (const prop of aggregatorProps){
          if (flatObj[item[identifierPropName]].hasOwnProperty(`__agg__${prop}`) ){
            item[`__agg__${prop}`] = flatObj[item[identifierPropName]][`__agg__${prop}`]
          }
        }                
      }
      
      return [flat, nested];
    }

    /**
     * GridOptions Object to be passed to several TreeData functions
     * @typedef {Object} GridOptions
     * @property {boolean} [editable=true]
     * @property {boolean} [enableAddRow=true]
     * @property {boolean} [enableCellNavigation=true]
     * @property {boolean} [asyncEditorLoading=false]
     * @property {boolean} [showHeaderRow=true]
     * @property {boolean} [explicitInitialization=true]
     * @property {number} [headerRowHeight=30]
     * @property {boolean} [excludeChildrenWhenTreeDataFiltering=true]
     */

    /**
     * Filter Hierarchical Data and return flat array with parentIds and filtered results
     * @param {Array} inputArray 
     * @param {Array|Object} treeObj 
     * @param {Object} columnFilters 
     * @param {Options} options
     * @param {GridOptions} gridOptions
     * @returns {Array} Returns filtered flat array
     */
    function filterHierarchicalData(inputArray, treeObj, columnFilters, options, gridOptions) {
      //console.log(options);
      const childrenPropName = options && options.childrenPropName || 'children';
      const parentPropName = options && options.parentPropName || '__parentId';
      const identifierPropName = options && options.identifierPropName || 'id';
      const aggregatorProps = options && options.aggregatorProps || [];
      const treeLevelPropName = options && options.treeLevelPropName || '__treeLevel';
      const hasChildrenFlagPropName = options && options.hasChildrenFlagPropName || '__hasChildren';

      const filteredChildrenAndParents = [];
      const tempFlatObj = {};
      const filteredFlatObj = {};
      /**
       * A recursive function to work down the tree testing filter conditions
       * @param {Array|Object} treeObj 
       * @param {Array<string>} filterKeys 
       */
      function outerFilter(treeObj, filterKeys) {
        const iterable = (treeObj instanceof Array) ?
          treeObj :
          Object.values(treeObj) || [];
        for (let id of iterable) {
          const a = id;
          tempFlatObj[a[identifierPropName]] = a;
          let matchFilter = false; // invalid until it is proven to be valid

          //make a copy each time so each recursion sibling has a fresh array:
          const copyOfFilters = [...filterKeys]
          // loop through all column filters and execute filter condition(s):
          for (let i = 0; i < copyOfFilters.length; i++) {
            const key = copyOfFilters[i];
            if (a.hasOwnProperty(key) ||
              (gridOptions.excludeChildrenWhenTreeDataFiltering &&
                a.hasOwnProperty(`__agg__${key}`))) {

              const keyOrAggKey = a.hasOwnProperty(key) ? key : `__agg__${key}`;
              // check case insensitive:
              const strContains = String(a[keyOrAggKey]).toLowerCase().includes(columnFilters[key].toLowerCase());
              // RegEx explained: https://regex101.com/r/w74GSk/13:
              const re = /(?:(?:^|[-+<>=_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-<>=]?\d+)?\s*))+$/;
              // according to mozilla using Function("return something") is better then eval() - and doesn't use eval
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval!
              const comparison = re.test(columnFilters[key]) && Function('return ' + a[keyOrAggKey] + columnFilters[key])();
              if (strContains || comparison) {
                // one filter matched remove this from the copyOfFilters
                matchFilter = true;
                copyOfFilters.splice(i, 1);
                i--; //the next filter has now moved one place back                       
              } else {
                continue;
              }
            } else {
              continue;
            }
          }

          // build an array from the matched filters, anything valid from filter condition
          // will be pushed to the filteredChildrenAndParents array
          if (matchFilter && copyOfFilters.length == 0) { //all filters matched
            const itemCopy = { ...a };
            // if excludeChildrenWhenTreeDataFiltering == true then we collapse this item
            // and essentially hide all children:
            if (gridOptions.excludeChildrenWhenTreeDataFiltering) itemCopy.__collapsed = true;
            delete itemCopy[childrenPropName];            
            filteredChildrenAndParents.push(itemCopy);
            filteredFlatObj[a[identifierPropName]] = {...a};
            delete filteredFlatObj[a[identifierPropName]][childrenPropName];
            
            const childrenObj = a[childrenPropName];
            //as this parent matched, show all children:
            /**
             * function to add all children recursively
             * @param {Object} child
             * @param {boolean} collapsedFlag
             * @returns {void}
             */
            function innerAddAll(child, collapsedFlag) {
              //now works with nested array of objects or object of objects:
              const iterable = (child instanceof Array) ?
                child :
                Object.values(child) || [];
              for (let id of iterable) {
                const childCopy = { ...id };
                delete childCopy[childrenPropName];
                childCopy.__collapsed = collapsedFlag;
                filteredChildrenAndParents.push(childCopy);
                filteredFlatObj[id[identifierPropName]] = {...id};
                delete filteredFlatObj[id[identifierPropName]][childrenPropName];
                tempFlatObj[id[identifierPropName]] = {...id};
                id[childrenPropName] && innerAddAll(id[childrenPropName], collapsedFlag);
              }
            }           
            if (gridOptions.excludeChildrenWhenTreeDataFiltering){
              //we could do something different if the flag is true
              //but as is now, if we don't call innerAddAll we see no children
              //What we could do is pass a flag down to set the prop .__collapsed to true?
              //that way they are not seen but they are present?
              childrenObj && innerAddAll(childrenObj, true); 
            }
            else {            
              childrenObj && innerAddAll(childrenObj, false); 
            }  
            
            let parentID = itemCopy[parentPropName];
            let parent = tempFlatObj[parentID] || false;
            while (parent) {
              const parentCopy = { ...parent };
              // even if you hide children all parents need to be visible
              // for the item itself to display:
              parentCopy.__collapsed = false;
              delete parentCopy[childrenPropName];
              filteredChildrenAndParents.push(parentCopy);
              filteredFlatObj[parent[identifierPropName]] = {...parent};
              delete filteredFlatObj[parent[identifierPropName]][childrenPropName];
              parentID = parentCopy[parentPropName];
              parent = tempFlatObj[parentID] || false;
            }
          }
          else {
            // either didn't match at all
            //or one or more filters matched but not all
            //but children might match
            //call recursively this function
            const childrenObj = a[childrenPropName] || false;
            if (gridOptions.excludeChildrenWhenTreeDataFiltering) {
              //call it with the full filterKeys - i.e. only ever match when one file/folder matches all filters
              childrenObj && outerFilter(childrenObj, filterKeys);
            } else {
              //call it with the limited filters - i.e. if some already passed don't pass them down:
              childrenObj && outerFilter(childrenObj, copyOfFilters);
            }
          }
        }
      }
      const filterKeys = Object.keys(columnFilters);
      outerFilter(treeObj, filterKeys);
      //console.log('myObj', treeObj);
      //console.log('filtered', filteredChildrenAndParents);

      // const all = {};
      // for (let i = 0; i < filteredChildrenAndParents.length; i++){
      //   const item = filteredChildrenAndParents[i];
      //   all[item[identifierPropName]] = {...item};
      //   for (const prop of aggregatorProps){
      //     if (all[item[identifierPropName]].hasOwnProperty(`__agg__${prop}`) ){
      //       all[item[identifierPropName]][`__agg__${prop}`] = 0;
      //     }
      //   } 
      // }
      // console.log('all', all)
      // //update aggregate props:
      // Object.values(all).forEach( item => {
      //   //console.log('item', item)
      //   for (const prop of aggregatorProps){
      //     if (item[parentPropName] != null){
      //       console.log(item[parentPropName])
      //       const currPropVal = all[item[parentPropName]][`__agg__${prop}`] || 0;
      //       all[item[parentPropName]][`__agg__${prop}`] = currPropVal + (item[`__agg__${prop}`] || item[prop]);
      //     }
      //   }                
      // });
      // console.log('all', all)
      // for (let i = 0; i < filteredChildrenAndParents.length; i++){
      //   const item = filteredChildrenAndParents[i];
      //   for (const prop of aggregatorProps){
      //     if (all[item[identifierPropName]].hasOwnProperty(`__agg__${prop}`) ){
      //       item[`__agg__${prop}`] = all[item[identifierPropName]][`__agg__${prop}`]
      //     }
      //   } 
      // }
      console.log('filteredChildrenAndParents', filteredChildrenAndParents)
      console.log('tempFlatObj', tempFlatObj)
      console.log('filteredFlatObj', filteredFlatObj)

      return filteredChildrenAndParents;
    }

    $.extend(this, {
      "init": init,
      "pluginName": "TreeData",

      "convertParentChildFlatArrayToHierarchicalView": convertParentChildFlatArrayToHierarchicalView,
      "convertHierarchicalViewToFlatArray": convertHierarchicalViewToFlatArray,
      "convertHierarchicalViewToFlatArrayByOutputArrayReference": convertHierarchicalViewToFlatArrayByOutputArrayReference,
      "filterHierarchicalData": filterHierarchicalData,
      "fromInputReturnFlatAndNestedDataStructures": fromInputReturnFlatAndNestedDataStructures
    });
  }
})(jQuery);
