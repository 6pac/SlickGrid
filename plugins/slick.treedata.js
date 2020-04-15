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
     * Private method to determine type
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

    $.extend(this, {
      "init": init,
      "pluginName": "TreeData",

      "convertParentChildFlatArrayToHierarchicalView": convertParentChildFlatArrayToHierarchicalView,
      "convertHierarchicalViewToFlatArray": convertHierarchicalViewToFlatArray,
      "convertHierarchicalViewToFlatArrayByOutputArrayReference": convertHierarchicalViewToFlatArrayByOutputArrayReference
    });
  }
})(jQuery);
