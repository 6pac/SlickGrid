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
     * Convert a flat array (with "parentId" references) into a hierarchical dataset structure (where children are array(s) inside their parent objects)
     * @param flatArray array input
     * @param outputArray array output (passed by reference)
     * @param options you can provide the following options:: "parentPropName" (defaults to "parent"), "childrenPropName" (defaults to "children") and "identifierPropName" (defaults to "id")
     */
    function convertParentChildFlatArrayToHierarchicalView(flatArray, options) {
      const childrenPropName = options && options.childrenPropName || 'children';
      const parentPropName = options && options.parentPropName || '__parentId';
      const identifierPropName = options && options.identifierPropName || 'id';
      const hasChildrenFlagPropName = '__hasChildren';
      const treeLevelPropName = '__treeLevel';
      const inputArray = $.extend(true, [], flatArray);

      const roots = []; // things without parent

      // make them accessible by guid on this map
      const all = {};

      inputArray.forEach(function (item) {
        all[item[identifierPropName]] = item
      });

      // connect childrens to its parent, and split roots apart
      Object.keys(all).forEach(function (id) {
        const item = all[id];
        if (item[parentPropName] === null || !item.hasOwnProperty(parentPropName)) {
          roots.push(item);
        } else if (item[parentPropName] in all) {
          const p = all[item[parentPropName]];
          if (!(childrenPropName in p)) {
            p[childrenPropName] = [];
          }
          p[childrenPropName].push(item);
        }

        // delete any unnecessary properties that were possibly created in the flat array but shouldn't be part of the tree data
        delete item[treeLevelPropName];
        delete item[hasChildrenFlagPropName];
      });

      return roots;
    }

    /**
     * Convert a hierarchical array (with children) into a flat array structure array (where the children are pushed as next indexed item in the array)
     * @param hierarchicalArray
     * @param outputArray
     * @param options you can provide "childrenPropName" (defaults to "children")
     */
    function convertHierarchicalViewToFlatArray(hierarchicalArray, options) {
      const outputArray = [];
      convertHierarchicalViewToFlatArrayByOutputArrayReference($.extend(true, [], hierarchicalArray), outputArray, options, 0);

      // the output array is the one passed as reference
      return outputArray;
    }

    /**
     * Convert a hierarchical array (with children) into a flat array structure array but using the array as the output (the array is the pointer reference)
     * @param hierarchicalArray
     * @param outputArray
     * @param options you can provide "childrenPropName" (defaults to "children")
     */
    function convertHierarchicalViewToFlatArrayByOutputArrayReference(hierarchicalArray, outputArray, options, treeLevel, parentId) {
      const childrenPropName = options && options.childrenPropName || 'children';
      const identifierPropName = options && options.identifierPropName || 'id';
      const hasChildrenFlagPropName = options && options.hasChildrenFlagPropName || '__hasChildren';
      const treeLevelPropName = options && options.treeLevelPropName || '__treeLevel';
      const parentPropName = options && options.parentPropName || '__parentId';

      if (Array.isArray(hierarchicalArray)) {
        for (const item of hierarchicalArray) {
          if (item) {
            const itemExist = outputArray.find(function (itm) {
              return itm[identifierPropName] === item[identifierPropName];
            });
            if (!itemExist) {
              item[treeLevelPropName] = treeLevel; // save tree level ref
              item[parentPropName] = parentId || null;
              outputArray.push(item);
            }
            if (Array.isArray(item[childrenPropName])) {
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
 * Take a flat array with Parent/Child references (child having parentId) and sort it by given parent/child properties
 * It will sort by a given "parentPropName" and "childrenPropName"
 * @param flatArray
 * @param options
 */
    function sortFlatArrayWithParentChildRef(flatArray, options) {
      const inputArray = $.extend(true, [], flatArray); // make a deep copy of the input array to avoid modifying that array

      // step 1: convert array to a hierarchical structure so that we can sort it
      const outputArrayRef = convertParentChildFlatArrayToHierarchicalView(inputArray, options);

      // step 2: sort the hierarchical array
      sortHierarchicalArray(outputArrayRef, options);
      // const inputHierarchicalArray = $.extend(true, [], outputArrayRef); // make a deep copy of the input array to avoid modifying that array

      // step 3: re-convert the array back to a flat structure and return it
      const resultSortedFlatDataset = convertHierarchicalViewToFlatArray(outputArrayRef, options);

      return resultSortedFlatDataset;
    }

    /**
     * Sort a hierarchical array (an array that has children property, that could also have children, ...)
     * It will sort by a given "parentPropName" and "childrenPropName"
     * @param hierarchicalArray
     * @param options
     */
    function sortHierarchicalArray(hierarchicalArray, options) {
      const childrenPropName = options && options.childrenPropName || 'children';
      const sortAscending = ((options && options.direction || 'ASC').toUpperCase() === SortDirection.ASC);
      const sortingDirectionNumber = sortAscending ? 1 : -1;

      hierarchicalArray.sort(function (value1, value2) {
        if (value1 === value2) {
          position = 0;
        } else if (value1 === null) {
          position = -1;
        } else if (value2 === null) {
          position = 1;
        } else if (sortingDirectionNumber) {
          position = value1 < value2 ? -1 : 1;
        } else {
          position = value1 < value2 ? 1 : -1;
        }
        return sortingDirectionNumber * position;
      });

      for (const item of hierarchicalArray) {
        if (item && Array.isArray(item[childrenPropName])) {
          sortHierarchicalArray(item[childrenPropName], options);
        }
      }

      return hierarchicalArray;
    }

    $.extend(this, {
      "init": init,
      "pluginName": "TreeData",

      "convertParentChildFlatArrayToHierarchicalView": convertParentChildFlatArrayToHierarchicalView,
      "convertHierarchicalViewToFlatArray": convertHierarchicalViewToFlatArray,
      "convertHierarchicalViewToFlatArrayByOutputArrayReference": convertHierarchicalViewToFlatArrayByOutputArrayReference,
      "sortFlatArrayWithParentChildRef": sortFlatArrayWithParentChildRef,
      "sortHierarchicalArray": sortHierarchicalArray,
    });
  }
})(jQuery);
