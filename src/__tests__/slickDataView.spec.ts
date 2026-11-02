import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { Aggregators, SlickDataView } from '../slick.dataview';
import { SlickGrid } from '../slick.grid';
import type { GridOption, Grouping } from '../models';
import { SortDirectionNumber } from '../models/sortDirectionNumber.enum';
import { SlickHybridSelectionModel } from '../plugins/slick.hybridselectionmodel';
import { SlickEventData } from '../slick.core';

const SortComparers = {
  numeric: (a: number, b: number, direction = 1) => (a - b) * direction,
  string: (a: string, b: string, direction = 1) => a.localeCompare(b) * direction,
};

class FakeAggregator {
  init() {}
  storeResult() {}
}

describe('SlickDatView core file', () => {
  let container: HTMLElement;
  let dv: SlickDataView;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'myGrid';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.textContent = '';
    dv?.destroy();
  });

  it('should be able to instantiate SlickDataView', () => {
    dv = new SlickDataView({});

    expect(dv.getItems()).toEqual([]);
  });

  it('should be able to add items to the DataView', () => {
    const mockData = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Doe' },
    ];
    dv = new SlickDataView({});
    dv.addItem(mockData[0]);
    dv.addItem(mockData[1]);

    expect(dv.getLength()).toBe(2);
    expect(dv.getItemCount()).toBe(2);
    expect(dv.getItems()).toEqual(mockData);
  });

  describe('Item Getters', () => {
    afterEach(() => {
      dv.destroy();
    });

    test('retrieve an item from the DataView at specific index by calling getItem()', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);

      expect(dv.getItemCount()).toBe(2);
      expect(dv.getLength()).toBe(2);
      expect(dv.getItem(1)).toEqual({ id: 3, name: 'Jane', age: 24 });
    });

    describe('getRowByItem()', () => {
      test('get row number in the grid by its item object by calling getRowByItem()', () => {
        const items = [
          { id: 4, name: 'John', age: 20 },
          { id: 3, name: 'Jane', age: 24 },
        ];
        dv.setItems(items);

        expect(dv.getRowByItem(items[1])).toBe(1);
      });

      it('should return undefined when calling getRowByItem() with an invalid item', () => {
        const items = [
          { id: 4, name: 'John', age: 20 },
          { id: 3, name: 'Jane', age: 24 },
        ];
        const newItem = { id: 2, name: 'Bob', age: 30 };
        dv.setItems(items);

        expect(dv.getRowByItem(newItem)).toBeUndefined();
      });
    });

    test('get row number in the grid by its Id by calling getRowById()', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);

      expect(dv.getRowById(3)).toBe(1);
    });

    test('get an item in the DataView by its Id by calling getItemById()', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);

      expect(dv.getItemById(3)).toEqual({ id: 3, name: 'Jane', age: 24 });
    });

    test('retrieve an item from the DataView at specific index by calling getItem()', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);
      expect(dv.getItem(1)).toEqual({ id: 3, name: 'Jane', age: 24 });
    });

    it('should return mapping of items with their row indexes', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);
      expect(dv.mapItemsToRows(items)).toEqual([0, 1]);
    });

    it('should return mapping of item Ids with their row indexes and exclude any Ids not found', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);
      expect(dv.mapIdsToRows([3, 4, 999])).toEqual([1, 0]);
    });

    it('should return mapping of row indexes with their item Ids and exclude any indexes not found', () => {
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);
      expect(dv.mapRowsToIds([0, 1, 999])).toEqual([4, 3]);
    });

    it('should work with a custom global item metadata provider provided to the DataView constructor options', () => {
      dv = new SlickDataView({
        globalItemMetadataProvider: {
          getRowMetadata(item, row) {
            return `row ${row} with name: ${item.name}`;
          },
        },
      });
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv.setItems(items);
      expect(dv.getItemMetadata(0)).toBe('row 0 with name: John');
      expect(dv.getItemMetadata(1)).toBe('row 1 with name: Jane');
    });
  });

  describe('CRUD methods', () => {
    afterEach(() => {
      dv.destroy();
    });

    describe('addItem()', () => {
      it('should call the method and expect item to be added', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const newItem = { id: 2, name: 'Bob', age: 30 };

        dv.setItems(items);
        dv.addItem(newItem);

        expect(dv.getItems().length).toBe(3);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
          { id: 2, name: 'Bob', age: 30 },
        ]);
      });
    });

    describe('deleteItem()', () => {
      it('should call the method and return undefined when item Map is undefined', () => {
        expect(dv.deleteItem(99)).toBeUndefined();
      });

      it('should throw when item Id is not found in the items array', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        dv.setItems(items);
        expect(() => dv.deleteItem(99)).toThrow('[SlickGrid DataView] Invalid id');
      });

      test('delete an item from the items array', () => {
        const refreshSpy = vi.spyOn(dv, 'refresh');
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];

        dv.setItems(items);
        dv.deleteItem(1);

        expect(dv.getItems()).toEqual([{ id: 0, name: 'John', age: 20 }]);
        expect(refreshSpy).toHaveBeenCalled();
      });

      test('delete multiple items with multi-digit indices in correct numeric order', () => {
        const refreshSpy = vi.spyOn(dv, 'refresh');
        const items = [
          { id: 0, name: 'Item0' },
          { id: 1, name: 'Item1' },
          { id: 2, name: 'Item2' },
          { id: 3, name: 'Item3' },
          { id: 10, name: 'Item10' },
          { id: 20, name: 'Item20' },
        ];

        dv.setItems(items);
        dv.deleteItems([20, 2, 10]); // Non-sequential, multi-digit indices

        // Should delete items at indices 2, 10, 20 (Item2, Item10, Item20)
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'Item0' },
          { id: 1, name: 'Item1' },
          { id: 3, name: 'Item3' },
        ]);
        expect(refreshSpy).toHaveBeenCalled();
      });
    });

    describe('deleteItems()', () => {
      it('should call the method and return undefined when item Map is undefined', () => {
        expect(dv.deleteItems([99])).toBeUndefined();
      });

      it('should throw when item Id is not found in the items array', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        dv.setItems(items);
        expect(() => dv.deleteItems([99])).toThrow('[SlickGrid DataView] Invalid id');
      });

      test('delete an item from the items array', () => {
        const refreshSpy = vi.spyOn(dv, 'refresh');
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];

        dv.setItems(items);
        dv.deleteItems([1]);

        expect(dv.getItems()).toEqual([{ id: 0, name: 'John', age: 20 }]);
        expect(refreshSpy).toHaveBeenCalled();
      });
    });

    describe('updateItem()', () => {
      it('should throw when calling the method with input Ids array does not match items array', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        expect(() => dv.updateItems([0, 1, 99], items)).toThrow('[SlickGrid DataView] Mismatch on the length of ids and items provided to update');
      });

      it('should update item when calling the method', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const updatedItem = { id: 1, name: 'Bob', age: 30 };

        dv.setItems(items);
        dv.updateItem(1, updatedItem);

        expect(dv.getItems().length).toBe(2);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Bob', age: 30 },
        ]);
      });
    });

    describe('updateSingleItem()', () => {
      it('should call the method and return undefined when item Map is undefined', () => {
        expect(dv.updateSingleItem(99, {})).toBeUndefined();
      });

      it('should throw when calling the method with an Id that is not found', () => {
        dv.setItems([]);
        expect(() => dv.updateSingleItem(99, {})).toThrow('[SlickGrid DataView] Invalid id');
      });

      it('should call the method and expect item to be updated', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        dv.setItems(items);
        dv.updateSingleItem(1, { id: 1, name: 'Bob', age: 30 });

        expect(dv.getItems().length).toBe(2);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Bob', age: 30 },
        ]);
        expect(dv.getItemByIdx(1)).toEqual({ id: 1, name: 'Bob', age: 30 });
      });

      it('should call the method and expect item to be updated when passing different Id', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];

        dv.setItems(items);
        dv.updateSingleItem(1, { id: 2, name: 'Bob', age: 30 });
        expect(dv.getIdxById(2)).toBe(1);
        dv.updateSingleItem(2, { id: 1, name: 'Bob', age: 30 });

        expect(dv.getItems().length).toBe(2);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Bob', age: 30 },
        ]);
        expect(dv.getIdxById(1)).toBe(1);
      });

      test('cannot update item to associate with a non-unique id', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const updatedItem = { id: 1, name: 'Bob', age: 30 };

        dv.setItems(items);
        expect(() => dv.updateSingleItem(0, updatedItem)).toThrow('[SlickGrid DataView] Cannot update item to associate with a non-unique id');
      });

      test('cannot update item to associate with a null id', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const updatedItem = { name: 'Bob', age: 30 };

        dv.setItems(items);
        expect(() => dv.updateSingleItem(0, updatedItem)).toThrow('[SlickGrid DataView] Cannot update item to associate with a null id');
      });
    });
  });

  describe('batch CRUD methods', () => {
    beforeEach(() => {
      dv = new SlickDataView({});
    });

    afterEach(() => {
      dv.endUpdate(); // close any batch that weren't closed because of potential error thrown
      dv.destroy();
    });

    describe('deleteItems()', () => {
      it('should throw when calling the method with an index not found in the items array', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];

        dv.setItems(items);
        dv.beginUpdate(true);
        expect(() => dv.deleteItems([99])).toThrow('[SlickGrid DataView] Invalid id');
      });

      test('delete an item from the items array in bulk', () => {
        const refreshSpy = vi.spyOn(dv, 'refresh');
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];

        dv.setItems(items);
        dv.beginUpdate(true);
        dv.deleteItems([1]);
        dv.endUpdate();

        expect(dv.getItems()).toEqual([{ id: 0, name: 'John', age: 20 }]);
        expect(refreshSpy).toHaveBeenCalled();
      });
    });

    it('should batch items with addItems and begin/end batch update', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];

      dv.beginUpdate(true);
      dv.addItems(items);
      dv.endUpdate();

      expect(dv.getIdPropertyName()).toBe('id');
      expect(dv.getItems()).toEqual(items);
    });

    it('should batch more items with addItems with begin/end batch update and expect them to be inserted at the end of the dataset', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const newItems = [
        { id: 3, name: 'Smith', age: 30 },
        { id: 4, name: 'Ronald', age: 34 },
      ];

      dv.setItems(items); // original items list

      dv.beginUpdate(true);
      dv.addItems(newItems); // batch extra items
      dv.endUpdate();

      expect(dv.getItems()).toEqual([
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
        { id: 3, name: 'Smith', age: 30 },
        { id: 4, name: 'Ronald', age: 34 },
      ]);
    });

    it('should batch more items with insertItems with begin/end batch update and expect them to be inserted at the beginning of the dataset', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const newItems = [
        { id: 3, name: 'Smith', age: 30 },
        { id: 4, name: 'Ronald', age: 34 },
      ];

      dv.setItems(items); // original items list

      dv.beginUpdate(true);
      dv.insertItems(0, newItems); // batch extra items
      dv.endUpdate();

      expect(dv.getItems()).toEqual([
        { id: 3, name: 'Smith', age: 30 },
        { id: 4, name: 'Ronald', age: 34 },
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ]);

      dv.deleteItem(3);

      expect(dv.getItems()).toEqual([
        { id: 4, name: 'Ronald', age: 34 },
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ]);
    });

    it('should be able to use different "id" when using setItems()', () => {
      const items = [
        { keyId: 0, name: 'John', age: 20 },
        { keyId: 1, name: 'Jane', age: 24 },
      ];

      dv.beginUpdate(true);
      dv.setItems(items, 'keyId');
      dv.endUpdate();

      expect(dv.getIdPropertyName()).toBe('keyId');
      expect(dv.getItems()).toEqual(items);
    });

    it('should batch more items with insertItems with begin/end batch update and expect them to be inserted at a certain index dataset', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const newItems = [
        { id: 3, name: 'Smith', age: 30 },
        { id: 4, name: 'Ronald', age: 34 },
      ];

      dv.setItems(items); // original items list

      dv.beginUpdate(true);
      dv.insertItems(1, newItems); // batch extra items
      dv.endUpdate();

      expect(dv.getItems()).toEqual([
        { id: 0, name: 'John', age: 20 },
        { id: 3, name: 'Smith', age: 30 },
        { id: 4, name: 'Ronald', age: 34 },
        { id: 1, name: 'Jane', age: 24 },
      ]);

      dv.deleteItems([3, 1]);

      expect(dv.getItems()).toEqual([
        { id: 0, name: 'John', age: 20 },
        { id: 4, name: 'Ronald', age: 34 },
      ]);
    });

    it('should throw when trying to delete items with have invalid Ids', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];

      dv.setItems(items); // original items list

      expect(() => dv.deleteItems([-1, 1])).toThrow('[SlickGrid DataView] Invalid id');
    });

    it('should throw when trying to delete items with a batch that have invalid Ids', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];

      dv.setItems(items); // original items list

      dv.beginUpdate(true);
      expect(() => dv.deleteItems([-1, 1])).toThrow('[SlickGrid DataView] Invalid id');
    });

    it('should call updateItems, without batch, and expect a refresh to be called', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const updatedItems = [
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ];
      const refreshSpy = vi.spyOn(dv, 'refresh');

      dv.setItems(items); // original items list

      dv.updateItems(
        updatedItems.map((item) => item.id),
        updatedItems
      );

      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getItems()).toEqual([
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ]);

      dv.deleteItem(1);

      expect(dv.getItems()).toEqual([{ id: 0, name: 'Smith', age: 30 }]);
    });

    it('should batch updateItems and expect a refresh to be called', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const updatedItems = [
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ];
      const refreshSpy = vi.spyOn(dv, 'refresh');

      dv.setItems(items); // original items list

      dv.beginUpdate(true);
      dv.updateItems(
        updatedItems.map((item) => item.id),
        updatedItems
      );

      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getItems()).toEqual([
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ]);

      dv.deleteItem(1);
      dv.endUpdate();

      expect(dv.getItems()).toEqual([{ id: 0, name: 'Smith', age: 30 }]);
    });

    it('should batch updateItems and expect a refresh to be called', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const updatedItems = [
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ];
      const refreshSpy = vi.spyOn(dv, 'refresh');

      dv.setItems(items); // original items list

      dv.beginUpdate(true);
      dv.updateItems(
        updatedItems.map((item) => item.id),
        updatedItems
      );

      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getItems()).toEqual([
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ]);

      dv.deleteItem(1);
      dv.endUpdate();

      expect(dv.getItems()).toEqual([{ id: 0, name: 'Smith', age: 30 }]);
    });

    it('should throw when batching updateItems with some invalid Ids', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const updatedItems = [
        { id: 0, name: 'Smith', age: 30 },
        { id: 1, name: 'Ronald', age: 34 },
      ];

      dv.setItems(items); // original items list
      dv.beginUpdate(true);

      expect(() => dv.updateItems([-1, 1], updatedItems)).toThrow('[SlickGrid DataView] Invalid id');
    });

    it('should throw when trying to call setItems() with duplicate Ids', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 0, name: 'Jane', age: 24 },
      ];

      expect(() => dv.setItems(items)).toThrow(`[SlickGrid DataView] Each data element must implement a unique 'id' property`);
    });

    it('should call insertItem() at a defined index location', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const newItem = { id: 2, name: 'Smith', age: 30 };
      const refreshSpy = vi.spyOn(dv, 'refresh');

      dv.setItems(items);
      dv.insertItem(1, newItem);

      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getItems()).toEqual([
        { id: 0, name: 'John', age: 20 },
        { id: 2, name: 'Smith', age: 30 },
        { id: 1, name: 'Jane', age: 24 },
      ]);
    });

    it('should throw when trying to call insertItem() with undefined Id', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
      ];
      const newItem = { id: undefined, name: 'Smith', age: 30 };

      dv.setItems(items);
      expect(() => dv.insertItem(1, newItem)).toThrow(`[SlickGrid DataView] Each data element must implement a unique 'id' property`);
    });

    it('should throw when trying to call insertItem() with undefined Id', () => {
      const items = [
        { id: 0, name: 'John', age: 20 },
        { id: 1, name: 'Jane', age: 24 },
        { id: undefined, name: 'Smith', age: 30 },
      ];

      dv.beginUpdate(true);
      dv.setItems(items);
      expect(() => dv.endUpdate()).toThrow(`[SlickGrid DataView] Each data element must implement a unique 'id' property`);
    });
  });

  describe('Grouping', () => {
    it('should call setGrouping() and expect grouping to be defined without any accumulator neither totals when Aggregators are omitted', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Doe' },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems(mockData);

      dv.setGrouping({
        getter: 'lastName',
        formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
      } as Grouping);

      expect(dv.getItem(0).rows).toHaveLength(2);
      expect(dv.getGroups().length).toBe(1);
      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getGrouping().length).toBe(1);
      expect(dv.getGrouping()[0]).toMatchObject({ aggregators: [], getter: 'lastName' });

      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: mockData,
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: null,
        value: 'Doe',
      });
      expect(dv.getItem(1)).toEqual(mockData[0]);
      expect(dv.getItem(2)).toEqual(mockData[1]);
      expect(dv.getItem(3)).toBeUndefined(); // without Totals

      // remove Grouping
      dv.setGrouping([]);
      expect(dv.getGroups().length).toBe(0);
    });

    it('should call setGrouping() and expect grouping to be defined with compiled accumulator and totals when providing Aggregators', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Doe' },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems(mockData);

      const agg = new Aggregators.Count('lastName');
      const agg2 = new FakeAggregator();
      dv.setGrouping({
        getter: 'lastName',
        formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
        aggregators: [agg, agg2],
        aggregateCollapsed: false,
        sortAsc: true,
      } as Grouping);

      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getGrouping().length).toBe(1);
      expect(dv.getGrouping()[0]).toMatchObject({ aggregators: [agg, agg2], getter: 'lastName' });

      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: mockData,
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: expect.anything(),
        value: 'Doe',
      });
      expect(dv.getItem(1)).toEqual(mockData[0]);
      expect(dv.getItem(2)).toEqual(mockData[1]);
      expect(dv.getItem(3)).toEqual({
        __groupTotals: true,
        __nonDataRow: true,
        group: expect.anything(),
        initialized: true,
        count: { lastName: 2 },
      });
    });

    it('should call setGrouping() and be able to sort it descending by the Grouping field', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Doe' },
        { id: 3, firstName: 'Bob', lastName: 'Smith' },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems([...mockData]);

      dv.setGrouping({
        getter: 'lastName',
        formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
        comparer: (a, b) => SortComparers.string(a.value, b.value, SortDirectionNumber.desc),
      } as Grouping);

      expect(refreshSpy).toHaveBeenCalled();
      expect(dv.getGrouping().length).toBe(1);
      expect(dv.getGrouping()[0]).toMatchObject({ aggregators: [], getter: 'lastName' });
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: null,
        level: 0,
        rows: [{ id: 3, firstName: 'Bob', lastName: 'Smith' }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: null,
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({ id: 3, firstName: 'Bob', lastName: 'Smith' });
      expect(dv.getItem(2)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Doe' },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: null,
        value: 'Doe',
      });
      expect(dv.getItem(3)).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' });
      expect(dv.getItem(4)).toEqual({ id: 2, firstName: 'Jane', lastName: 'Doe' });
      expect(dv.getItem(5)).toBeUndefined(); // without Totals

      dv.collapseAllGroups();

      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 1,
        count: 1,
        groupingKey: 'Smith',
        groups: null,
        level: 0,
        rows: [{ id: 3, firstName: 'Bob', lastName: 'Smith' }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: null,
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 1,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Doe' },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: null,
        value: 'Doe',
      });

      dv.expandAllGroups();

      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: null,
        level: 0,
        rows: [{ id: 3, firstName: 'Bob', lastName: 'Smith' }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: null,
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({ id: 3, firstName: 'Bob', lastName: 'Smith' });
    });

    it('should call setGrouping() then use collapseGroup() and expandGroup()', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        { id: 3, firstName: 'John', lastName: 'Smith', age: 26 },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems([...mockData]);

      const agg1 = new Aggregators.Count('lastName');
      const agg2 = new Aggregators.Sum('age');
      dv.setGrouping({
        getter: 'lastName',
        formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
        aggregators: [agg1, agg2],
        lazyTotalsCalculation: false,
        displayTotalsRow: false,
        aggregateChildGroups: false,
      } as Grouping);

      dv.expandGroup('Smith');

      // Groups should be expanded
      expect(refreshSpy).toHaveBeenCalledTimes(3);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: expect.anything(),
        value: 'Doe',
      });

      expect(dv.getItem(1)).toEqual({ id: 1, firstName: 'John', lastName: 'Doe', age: 30 });
      expect(dv.getItem(2)).toEqual({ id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 });
      expect(dv.getItem(3)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: null,
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });

      dv.collapseGroup('Smith');

      // Groups should now be collapsed
      expect(refreshSpy).toHaveBeenCalledTimes(4);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: expect.anything(),
        value: 'Doe',
      });
      expect(dv.getItem(1)).not.toEqual({ id: 3, firstName: 'John', lastName: 'Smith', age: 26 });
    });

    it('should expand and collapse a predefined grouping value', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        { id: 3, firstName: 'John', lastName: 'Smith', age: 26 },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems([...mockData]);

      const agg1 = new Aggregators.Count('lastName');
      const agg2 = new Aggregators.Sum('age');
      dv.setGrouping({
        getter: 'lastName',
        formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
        comparer: (a, b) => SortComparers.string(a.value, b.value, SortDirectionNumber.desc),
        aggregators: [agg1, agg2],
        predefinedValues: ['Smith'],
      } as Grouping);

      dv.expandGroup('Smith');

      // Groups should be expanded
      expect(refreshSpy).toHaveBeenCalledTimes(3);
      expect(dv.getItem(0)).toMatchObject({ collapsed: 0, groupingKey: 'Smith', value: 'Smith' });
      expect(dv.getItem(2)).toEqual({
        __groupTotals: true,
        __nonDataRow: true,
        group: expect.anything(),
        initialized: true,
        count: { lastName: 1 },
        sum: { age: 26 },
      });
      expect(dv.getItem(3)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 2,
        groupingKey: 'Doe',
        groups: null,
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: expect.anything(),
        value: 'Doe',
      });

      dv.collapseGroup('Smith');

      // Groups should now be collapsed
      expect(refreshSpy).toHaveBeenCalledTimes(4);
      expect(dv.getItem(0)).toMatchObject({ collapsed: 1, groupingKey: 'Smith', value: 'Smith' });
      expect(dv.getItem(1)).not.toEqual({ id: 3, firstName: 'John', lastName: 'Smith', age: 26 });
    });

    it('should call setGrouping() with multiple Groups from array and lazyTotalsCalculation with Group Totals calculation', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        { id: 3, firstName: 'John', lastName: 'Smith', age: 26 },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems([...mockData]);

      const agg1 = new Aggregators.Count('lastName');
      const agg2 = new Aggregators.Sum('age');
      dv.setGrouping([
        {
          getter: 'lastName',
          formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
          comparer: (a, b) => SortComparers.string(a.value, b.value, SortDirectionNumber.desc),
          aggregators: [agg1, agg2],
          aggregateChildGroups: false,
          lazyTotalsCalculation: true,
          aggregateEmpty: true,
          displayTotalsRow: false,
        },
        {
          getter: 'age',
          formatter: (g) => `Age: ${g.value} <span class="text-green">(${g.count} items)</span>`,
          comparer: (a, b) => SortComparers.numeric(a.value, b.value, SortDirectionNumber.desc),
          aggregators: [agg1, agg2],
          lazyTotalsCalculation: true,
          aggregateEmpty: true,
          displayTotalsRow: true,
          aggregateCollapsed: false,
        },
      ]);

      expect(dv.getItemMetadata(99)).toBeNull();
      expect(dv.getItemMetadata(2)).toBeNull();
      expect(dv.getItemMetadata(0)).toEqual({
        columns: {
          0: {
            colspan: '*',
            editor: null,
            formatter: expect.anything(),
          },
        },
        cssClasses: 'slick-group slick-group-level-0',
        isGroup: true,
        focusable: true,
        formatter: undefined,
        selectable: false,
      });

      dv.expandAllGroups(0);

      // Groups should be expanded
      expect(refreshSpy).toHaveBeenCalledTimes(3);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: expect.anything(),
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith:|:26',
        groups: null,
        level: 1,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Age: 26 <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 26,
      });
      expect(dv.getItem(2)).toEqual({ id: 3, firstName: 'John', lastName: 'Smith', age: 26 });
      expect(dv.getItem(3)).toEqual({
        __groupTotals: true,
        __nonDataRow: true,
        count: { lastName: 1 },
        group: expect.anything(),
        initialized: true,
        sum: { age: 26 },
      });
      expect(dv.getItemMetadata(3)).toEqual({
        cssClasses: 'slick-group-totals slick-group-level-1',
        editor: null,
        focusable: false,
        isGroup: true,
        formatter: expect.anything(),
        selectable: false,
      });
      expect(dv.getItem(10)).toEqual({
        __groupTotals: true,
        __nonDataRow: true,
        count: { lastName: 1 },
        group: expect.anything(),
        initialized: true,
        sum: { age: 28 },
      });

      dv.collapseAllGroups(0);

      // Groups should now be collapsed
      expect(refreshSpy).toHaveBeenCalledTimes(4);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 1,
        count: 1,
        groupingKey: 'Smith',
        groups: expect.anything(),
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 1,
        count: 2,
        groupingKey: 'Doe',
        groups: [expect.anything(), expect.anything()],
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: expect.anything(),
        value: 'Doe',
      });
      expect(dv.getItem(2)).toBeUndefined();
    });

    it('should call setGrouping() with multiple Groups from array and calculate totals afterward when getting item', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        { id: 3, firstName: 'John', lastName: 'Smith', age: 26 },
      ];
      dv = new SlickDataView({});
      dv.setItems([...mockData]);
      const refreshSpy = vi.spyOn(dv, 'refresh');

      const agg1 = new Aggregators.Count('lastName');
      const agg2 = new Aggregators.Sum('age');
      dv.setGrouping([
        {
          getter: 'lastName',
          formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
          comparer: (a, b) => SortComparers.string(a.value, b.value, SortDirectionNumber.desc),
          aggregators: [agg1, agg2],
          lazyTotalsCalculation: false,
          displayTotalsRow: false,
          aggregateChildGroups: false,
          aggregateCollapsed: true,
        },
        {
          getter: 'age',
          formatter: (g) => `Age: ${g.value} <span class="text-green">(${g.count} items)</span>`,
          // comparer: (a, b) => SortComparers.numeric(a.value, b.value, SortDirectionNumber.desc),
          aggregators: [agg1, agg2],
          lazyTotalsCalculation: false,
          displayTotalsRow: true,
          aggregateChildGroups: false,
          aggregateCollapsed: true,
        },
      ]);

      expect(dv.getItemMetadata(99)).toBeNull();
      expect(dv.getItemMetadata(2)).toBeNull();
      expect(dv.getItemMetadata(0)).toEqual({
        columns: {
          0: {
            colspan: '*',
        editor: null,
            formatter: expect.anything(),
          },
        },
        cssClasses: 'slick-group slick-group-level-0',
        isGroup: true,
        focusable: true,
        formatter: undefined,
        selectable: false,
      });
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: expect.anything(),
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith:|:26',
        groups: null,
        level: 1,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Age: 26 <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 26,
      });
      expect(dv.getItem(2)).toEqual({ id: 3, firstName: 'John', lastName: 'Smith', age: 26 });
      expect(dv.getItem(3)).toMatchObject({
        __groupTotals: true,
        __nonDataRow: true,
        count: { lastName: 1 },
        group: expect.anything(),
        initialized: true,
        sum: { age: 26 },
      });

      dv.expandAllGroups(0);

      // Groups should be expanded
      expect(refreshSpy).toHaveBeenCalledTimes(2);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: expect.anything(),
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });
    });

    it('should call setGrouping() with multiple Groups from array with Group Totals calculation', () => {
      const mockData = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
        { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        { id: 3, firstName: 'John', lastName: 'Smith', age: 26 },
      ];
      dv = new SlickDataView({});
      const refreshSpy = vi.spyOn(dv, 'refresh');
      dv.setItems([...mockData]);

      const agg1 = new Aggregators.Count('lastName');
      const agg2 = new Aggregators.Sum('age');
      dv.setGrouping([
        {
          getter: 'lastName',
          formatter: (g) => `Family: ${g.value} <span class="text-green">(${g.count} items)</span>`,
          comparer: (a, b) => SortComparers.string(a.value, b.value, SortDirectionNumber.desc),
          aggregators: [agg1, agg2],
          lazyTotalsCalculation: false,
          aggregateChildGroups: true,
          displayTotalsRow: true,
          aggregateEmpty: true,
        },
        {
          getter: 'age',
          formatter: (g) => `Age: ${g.value} <span class="text-green">(${g.count} items)</span>`,
          comparer: (a, b) => SortComparers.numeric(a.value, b.value, SortDirectionNumber.desc),
          aggregators: [agg1, agg2],
          lazyTotalsCalculation: false,
          displayTotalsRow: true,
        },
      ]);

      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith:|:26',
        groups: null,
        level: 1,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Age: 26 <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 26,
      });

      dv.expandAllGroups();

      // Groups should be expanded
      expect(refreshSpy).toHaveBeenCalledTimes(3);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith',
        groups: expect.anything(),
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 0,
        count: 1,
        groupingKey: 'Smith:|:26',
        groups: null,
        level: 1,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Age: 26 <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 26,
      });
      expect(dv.getItem(2)).toEqual({ id: 3, firstName: 'John', lastName: 'Smith', age: 26 });
      expect(dv.getItem(3)).toEqual({
        __groupTotals: true,
        __nonDataRow: true,
        count: { lastName: 1 },
        group: expect.anything(),
        initialized: true,
        sum: { age: 26 },
      });

      dv.collapseAllGroups();

      // Groups should now be collapsed
      expect(refreshSpy).toHaveBeenCalledTimes(4);
      expect(dv.getItem(0)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 1,
        count: 1,
        groupingKey: 'Smith',
        groups: expect.anything(),
        level: 0,
        rows: [{ id: 3, firstName: 'John', lastName: 'Smith', age: 26 }],
        selectChecked: false,
        title: 'Family: Smith <span class="text-green">(1 items)</span>',
        totals: expect.anything(),
        value: 'Smith',
      });
      expect(dv.getItem(1)).toEqual({
        __group: true,
        __nonDataRow: true,
        collapsed: 1,
        count: 2,
        groupingKey: 'Doe',
        groups: [expect.anything(), expect.anything()],
        level: 0,
        rows: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28 },
        ],
        selectChecked: false,
        title: 'Family: Doe <span class="text-green">(2 items)</span>',
        totals: expect.anything(),
        value: 'Doe',
      });
      expect(dv.getItem(2)).toBeUndefined();
    });

    it('should apply grouping correctly when using dataItemColumnValueExtractor for nested object properties', () => {
      const mockData = [
        { id: 1, security: { fullName: 'John Doe' }, role: { name: 'admin' } },
        { id: 2, security: { fullName: 'Jane Doe' }, role: { name: 'user' } },
        { id: 3, security: { fullName: 'John Smith' }, role: { name: 'admin' } },
      ];

      dv = new SlickDataView({});
      dv.setItems(mockData);

      // Mock grid with dataItemColumnValueExtractor
      const mockGrid = {
        _options: {
          dataItemColumnValueExtractor: (item: any, col: any) => {
            if (col.field === 'role' && item.role) {
              return item.role.name;
            }
            if (col.field === 'fullName' && item.security) {
              return item.security.fullName;
            }
            return item[col.field];
          },
        },
        getColumns: () => [
          { id: 'security', field: 'fullName', name: 'Full Name' },
          { id: 'role', field: 'role', name: 'Role' },
        ],
      } as any;

      // Set grid on dataview to enable extractor usage
      (dv as any)._grid = mockGrid;

      // Group by role using the extractor
      dv.setGrouping({
        getter: 'role',
        formatter: (g) => `Role: ${g.value} <span class="text-green">(${g.count} items)</span>`,
      } as Grouping);

      // Check that grouping works correctly with extractor
      expect(dv.getGroups().length).toBe(2); // 'admin' and 'user' groups
      expect(dv.getGroups()[0].value).toBe('admin');
      expect(dv.getGroups()[0].count).toBe(2);
      expect(dv.getGroups()[1].value).toBe('user');
      expect(dv.getGroups()[1].count).toBe(1);

      // Verify items are grouped correctly
      const adminGroup = dv.getGroups()[0];
      expect(adminGroup.rows.length).toBe(2);
      expect(adminGroup.rows[0].id).toBe(1);
      expect(adminGroup.rows[1].id).toBe(3);
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      dv = new SlickDataView({});
    });

    afterEach(() => {
      dv.destroy();
      vi.clearAllMocks();
    });

    describe('sortedAddItem()', () => {
      it('should throw when calling the method without a sort comparer', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const newItem = { id: 2, name: 'Bob', age: 30 };

        dv.setItems(items);
        expect(() => dv.sortedAddItem(newItem)).toThrow('[SlickGrid DataView] sortedAddItem() requires a sort comparer, use sort()');
      });

      it('should call the method and expect item to be added and sorted in ascending order when no sort direction is provided', () => {
        const refreshSpy = vi.spyOn(dv, 'refresh');
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const newItem = { id: 2, name: 'Bob', age: 30 };
        // const comparer = (a: any, b: any) => SortComparers.numeric(a.id, b.id, SortDirectionNumber.asc);
        const comparer = (a: any, b: any) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1);
        const sortSpy = vi.spyOn(dv, 'sort');

        dv.setItems(items);
        dv.sort(comparer, true);
        dv.sortedAddItem(newItem);

        expect(refreshSpy).toHaveBeenCalledTimes(3);
        expect(sortSpy).toHaveBeenCalledTimes(1);
        expect(dv.getItems().length).toBe(3);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
          { id: 2, name: 'Bob', age: 30 },
        ]);

        dv.reSort(); // calling resort will expect same result

        expect(refreshSpy).toHaveBeenCalledTimes(4);
        expect(sortSpy).toHaveBeenCalledTimes(2);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
          { id: 2, name: 'Bob', age: 30 },
        ]);
      });

      it('should call the method and expect item to be added when called with a descending sort comparer', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const newItem = { id: 2, name: 'Bob', age: 30 };
        const comparer = (a: any, b: any) => SortComparers.numeric(a.id, b.id, SortDirectionNumber.asc);

        dv.setItems(items);
        dv.sort(comparer, false);
        dv.sortedAddItem(newItem);
        dv.sort(comparer, false);

        expect(dv.getItems().length).toBe(3);
        expect(dv.getItems()).toEqual([
          { id: 2, name: 'Bob', age: 30 },
          { id: 1, name: 'Jane', age: 24 },
          { id: 0, name: 'John', age: 20 },
        ]);

        dv.reSort(); // calling resort will expect same result

        expect(dv.getItems()).toEqual([
          { id: 2, name: 'Bob', age: 30 },
          { id: 1, name: 'Jane', age: 24 },
          { id: 0, name: 'John', age: 20 },
        ]);
      });
    });

    describe('sortedUpdateItem()', () => {
      it('should call the method and return undefined when item Map is undefined', () => {
        expect(() => dv.sortedUpdateItem(99, {})).toThrow('[SlickGrid DataView] Invalid or non-matching id undefined');
      });

      it('should throw when calling the method with input Ids array does not match items array', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const comparer = (a: any, b: any) => SortComparers.numeric(a.id, b.id, SortDirectionNumber.asc);
        dv.setItems(items);
        dv.sort(comparer);

        expect(() => dv.sortedUpdateItem(99, items[0])).toThrow('[SlickGrid DataView] Invalid or non-matching id undefined');
      });

      it('should throw when calling the method with an input Id that does not match the updated item Id', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const comparer = (a: any, b: any) => SortComparers.numeric(a.id, b.id, SortDirectionNumber.asc);
        dv.setItems(items);
        dv.sort(comparer);

        expect(() => dv.sortedUpdateItem(0, items[1])).toThrow('[SlickGrid DataView] Invalid or non-matching id 0');
      });

      it('should throw when calling the method without a sort comparer', () => {
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];

        dv.setItems(items);
        expect(() => dv.sortedUpdateItem(0, items[0])).toThrow('[SlickGrid DataView] sortedUpdateItem() requires a sort comparer, use sort()');
      });

      it('should call the method and expect item to be added and sorted in ascending order when no sort direction is provided', () => {
        const refreshSpy = vi.spyOn(dv, 'refresh');
        const items = [
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Jane', age: 24 },
        ];
        const updatedItem = { id: 1, name: 'Bob', age: 30 };
        const comparer = (a: any, b: any) => SortComparers.numeric(a.id, b.id, SortDirectionNumber.asc);
        const sortSpy = vi.spyOn(dv, 'sort');

        dv.setItems(items);
        dv.sort(comparer, true);
        dv.sortedUpdateItem(1, updatedItem);

        expect(refreshSpy).toHaveBeenCalledTimes(3);
        expect(sortSpy).toHaveBeenCalledTimes(1);
        expect(dv.getItems().length).toBe(2);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Bob', age: 30 },
        ]);

        dv.reSort(); // calling resort will expect same result

        expect(refreshSpy).toHaveBeenCalledTimes(4);
        expect(sortSpy).toHaveBeenCalledTimes(2);
        expect(dv.getItems()).toEqual([
          { id: 0, name: 'John', age: 20 },
          { id: 1, name: 'Bob', age: 30 },
        ]);
      });

      it('should call the method and expect item to be added when called with a descending sort comparer', () => {
        const items = [
          { id: 2, name: 'John', age: 20 },
          { id: 0, name: 'Jane', age: 24 },
          { id: 1, name: 'Bob', age: 22 },
        ];
        const updatedItem = { id: 2, name: 'Bobby', age: 30 };
        const comparer = () => 1; // just return some static value

        dv.setItems(items);
        dv.sort(comparer, false);
        dv.sortedUpdateItem(2, updatedItem);
        dv.sort(comparer, false);

        // expect(dv.getItems().length).toBe(2);
        expect(dv.getItems()).toEqual([
          { id: 2, name: 'Bobby', age: 30 },
          { id: 0, name: 'Jane', age: 24 },
          { id: 1, name: 'Bob', age: 22 },
        ]);
      });
    });
  });

  describe('Filtering', () => {
    afterEach(() => {
      dv.destroy();
      vi.clearAllMocks();
    });

    it('should be able to set a filter and expect items to be filtered', () => {
      const refreshSpy = vi.spyOn(dv, 'refresh');

      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      const filter = (item: any) => item.id >= 2;
      dv.setItems(items);
      dv.setFilter(filter);

      expect(dv.getItemCount()).toBe(3);
      expect(dv.getFilter()).toBeTruthy();
      expect(dv.getFilteredItemCount()).toBe(2);
      expect(dv.getFilteredItems()).toEqual([
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ]);
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should be able to set a filter with Pagination and expect items to be filtered on first page', () => {
      const refreshSpy = vi.spyOn(dv, 'refresh');

      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      const filter = (item: any) => item.id >= 2;
      dv.setItems(items);
      dv.setFilter(filter);

      expect(dv.getItemCount()).toBe(3);
      expect(dv.getFilter()).toBeTruthy();
      expect(dv.getFilteredItemCount()).toBe(2);
      expect(dv.getFilteredItems()).toEqual([
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ]);
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should filter without runtime code generation and preserve access to closures', () => {
      const minimumId = 2;
      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      const filter = (item: any) => item.id >= minimumId;
      const functionSpy = vi.spyOn(globalThis, 'Function');

      dv = new SlickDataView();
      dv.setItems(items);
      dv.setFilter(filter);

      expect(functionSpy).not.toHaveBeenCalled();
      expect(dv.getFilter()).toBe(filter);
      expect(dv.getFilteredItems()).toEqual([
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ]);

      functionSpy.mockRestore();
    });

    it('should cache successful filters when the filter is expanding', () => {
      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      const filter = vi.fn((item: any) => item.id >= 2);

      dv.setItems(items);
      dv.setRefreshHints({ isFilterExpanding: true });
      dv.setFilter(filter);

      expect(filter).toHaveBeenCalledTimes(3);

      dv.setRefreshHints({ isFilterExpanding: true });
      dv.refresh();

      expect(filter).toHaveBeenCalledTimes(4);
      expect(filter).toHaveBeenLastCalledWith(items[0], undefined);
      expect(dv.getFilteredItems()).toEqual([items[1], items[2]]);
    });

    it('should be able to set a filter and extra filter arguments and expect items to be filtered', () => {
      const searchString = 'Ob'; // we'll provide "searchString" as filter args
      function myFilter(item: any, args: any) {
        return item.name.toLowerCase().includes(args.searchString?.toLowerCase());
      }
      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 0, name: 'Hobby', age: 44 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];

      dv = new SlickDataView();
      dv.setItems(items);
      dv.setFilterArgs({ searchString });
      dv.setFilter(myFilter);

      expect(dv.getItemCount()).toBe(4);
      expect(dv.getFilter()).toBeTruthy();
      expect(dv.getFilterArgs()).toEqual({ searchString });
      expect(dv.getFilteredItemCount()).toBe(2);
      expect(dv.getFilteredItems()).toEqual([
        { id: 1, name: 'Bob', age: 33 },
        { id: 0, name: 'Hobby', age: 44 },
      ]);
    });
  });

  describe('Pagination', () => {
    afterEach(() => {
      dv.destroy();
      vi.clearAllMocks();
    });

    it('should be able to set a filter with Pagination and expect items to be filtered on 2nd page', () => {
      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      const filter = (item: any) => item.id >= 2;

      dv = new SlickDataView();
      const onPagingInfoSpy = vi.spyOn(dv.onPagingInfoChanged, 'notify');
      dv.setItems(items);
      dv.setFilter(filter);
      dv.setPagingOptions({ dataView: dv, pageNum: 1, pageSize: 1 });
      dv.refresh();

      expect(dv.getPagingInfo()).toEqual({ dataView: dv, pageNum: 1, pageSize: 1, totalPages: 2, totalRows: 2 });
      expect(onPagingInfoSpy).toHaveBeenCalledWith({ dataView: dv, pageNum: 1, pageSize: 1, totalPages: 2, totalRows: 2 }, null, dv);
      expect(dv.getItemCount()).toBe(3);
      expect(dv.getFilter()).toBeTruthy();
      expect(dv.getFilteredItemCount()).toBe(2);
      expect(dv.getFilteredItems()).toEqual([
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ]);
    });

    it('should be able to set a filter with Pagination and expect items to be filtered on 1st page', () => {
      const items = [
        { id: 1, name: 'Bob', age: 33 },
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
        { id: 5, name: 'Alpha', age: 12 },
        { id: 6, name: 'Omega', age: 24 },
      ];
      function myFilter(item: any) {
        return item.id >= 2;
      }

      dv = new SlickDataView();
      const onPagingInfoSpy = vi.spyOn(dv.onPagingInfoChanged, 'notify');
      const onRowCountChangeSpy = vi.spyOn(dv.onRowCountChanged, 'notify');
      const onRowsChangeSpy = vi.spyOn(dv.onRowsChanged, 'notify');
      dv.setPagingOptions({ dataView: dv, pageNum: 1, pageSize: 10 });
      dv.setItems(items);
      dv.setRefreshHints({ isFilterNarrowing: true });
      dv.setFilter(myFilter);

      expect(dv.getPagingInfo()).toEqual({ dataView: dv, pageNum: 0, pageSize: 10, totalPages: 1, totalRows: 4 });
      expect(onPagingInfoSpy).toHaveBeenCalledWith({ dataView: dv, pageNum: 0, pageSize: 10, totalPages: 1, totalRows: 4 }, null, dv);
      expect(dv.getItemCount()).toBe(items.length);
      expect(dv.getFilter()).toBeTruthy();
      expect(dv.getFilteredItemCount()).toBe(4);
      expect(dv.getFilteredItems()).toEqual([
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
        { id: 5, name: 'Alpha', age: 12 },
        { id: 6, name: 'Omega', age: 24 },
      ]);

      dv.setRefreshHints({ isFilterExpanding: true });
      items[0].id = 11;
      dv.setPagingOptions({ dataView: dv, pageNum: 2, pageSize: 2 });

      // calling it again will reuse the cached filter result
      dv.setRefreshHints({ isFilterExpanding: true });
      dv.refresh();

      // change filter without changing pagination & expect pageNum to be recalculated
      dv.setFilter((item) => item.id >= 10);
      expect(onPagingInfoSpy).toHaveBeenCalledWith({ dataView: dv, pageNum: 0, pageSize: 2, totalPages: 1, totalRows: 1 }, null, dv);
      expect(onRowCountChangeSpy).toHaveBeenCalled();
      expect(onRowsChangeSpy).toHaveBeenCalled();

      // change filter without changing pagination will result in 2 changes but only 1 defined as changed because we ignore diffs from 0-1
      dv.setRefreshHints({ ignoreDiffsBefore: 1, ignoreDiffsAfter: 3 });
      items[0].id = 8;
      dv.setFilter(function (item) {
        return item.id >= 0;
      });
      expect(onPagingInfoSpy).toHaveBeenCalledWith({ dataView: dv, pageNum: 0, pageSize: 2, totalPages: 3, totalRows: 5 }, null, dv);
      expect(onRowCountChangeSpy).toHaveBeenCalled();
      expect(onRowsChangeSpy).toHaveBeenCalled();
    });
  });

  describe('Row Selection', () => {
    let items: any[] = [];
    beforeEach(() => {
      items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
        { id: 1, name: 'Bob', age: 20 },
        { id: 5, name: 'Arnold', age: 50 },
        { id: 0, name: 'Avery', age: 44 },
        { id: 2, name: 'Rachel', age: 46 },
        { id: 6, name: 'Carole', age: 40 },
        { id: 8, name: 'Julie', age: 42 },
        { id: 7, name: 'Jason', age: 48 },
        { id: 9, name: 'Aaron', age: 23 },
        { id: 10, name: 'Ariane', age: 43 },
      ];
    });

    afterEach(() => {
      dv.destroy();
      vi.clearAllMocks();
    });

    it('should throw when calling syncGridSelection() and selection model is undefined', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      const items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
      ];
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      dv.setItems(items);
      expect(() => dv.syncGridSelection(grid, true)).toThrow('SlickGrid Selection model is not set');
    });

    it('should enable "preserveHidden" but keep "preserveHiddenOnSelectionChange" disabled and expect to only return current page selection when calling getAll methods', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, true);
      grid.setSelectedRows([0, 1, 7]);

      expect(dv.getItemCount()).toBe(11); // full count
      expect(dv.getLength()).toBe(4); // page count
      expect(dv.getAllSelectedIds()).toEqual([3, 4]); // only 3, 4 because 7 is not on current page
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 3, name: 'Jane', age: 24 },
        { id: 4, name: 'John', age: 20 },
      ]);

      // go to next page & change selection, only current page selection is kept
      dv.setPagingOptions({ dataView: dv, pageNum: 1, pageSize: 4 });
      grid.setSelectedRows([2, 3]);

      expect(dv.getAllSelectedIds()).toEqual([6, 8]); // only 6, 8 because 7 is not on current page
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 6, name: 'Carole', age: 40 },
        { id: 8, name: 'Julie', age: 42 },
      ]);
    });

    it('should disable "preserveHidden" and enable "preserveHiddenOnSelectionChange" and expect to return previous page + current page selections when calling getAll methods', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, false, true);
      grid.setSelectedRows([0, 1, 7]);

      expect(dv.getItemCount()).toBe(11); // full count
      expect(dv.getLength()).toBe(4); // page count
      expect(dv.getAllSelectedIds()).toEqual([3, 4]);
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 3, name: 'Jane', age: 24 },
        { id: 4, name: 'John', age: 20 },
      ]);

      // go to next page & change selection, selection also includes previous page(s)
      dv.setPagingOptions({ dataView: dv, pageNum: 1, pageSize: 4 });
      grid.setSelectedRows([2, 3]);

      expect(dv.getAllSelectedIds()).toEqual([3, 4, 6, 8]); // includes previous page + current page selection
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 3, name: 'Jane', age: 24 },
        { id: 4, name: 'John', age: 20 },
        { id: 6, name: 'Carole', age: 40 },
        { id: 8, name: 'Julie', age: 42 },
      ]);
    });

    it('should use setSelectedIds() to add/remove row selection with "preserveHiddenOnSelectionChange" enabled and "preserveHidden" disabled', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const setSelectedRowSpy = vi.spyOn(grid, 'setSelectedRows');
      const onSelectedRowIdsSpy = vi.spyOn(dv.onSelectedRowIdsChanged, 'notify');
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, false, true);
      dv.setSelectedIds([3, 4, 8], { isRowBeingAdded: true, applyRowSelectionToGrid: true });

      expect(dv.getItemCount()).toBe(11); // full count
      expect(dv.getLength()).toBe(4); // page count
      expect(setSelectedRowSpy).toHaveBeenCalledWith([1, 0]); // 8 is outside of current page so not included
      expect(dv.getAllSelectedIds()).toEqual([3, 4, 8]); // 8 is also included even though it's not in current page
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 3, name: 'Jane', age: 24 },
        { id: 4, name: 'John', age: 20 },
        { id: 8, name: 'Julie', age: 42 },
      ]);

      // remove selection
      dv.setSelectedIds([3], { isRowBeingAdded: false, applyRowSelectionToGrid: false });

      expect(onSelectedRowIdsSpy).toHaveBeenCalledWith(
        {
          added: false,
          dataView: dv,
          filteredIds: [4, 8],
          grid,
          ids: [3],
          rows: [1],
          selectedRowIds: [4, 8],
        },
        new SlickEventData(),
        dv
      );
      expect(dv.getAllSelectedIds()).toEqual([4, 8]);
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 4, name: 'John', age: 20 },
        { id: 8, name: 'Julie', age: 42 },
      ]);
    });

    it('should report all filtered selected IDs when selection changes through the grid', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const onSelectedRowIdsSpy = vi.spyOn(dv.onSelectedRowIdsChanged, 'notify');
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, false, true);
      dv.setSelectedIds([3, 4, 8], { isRowBeingAdded: true, applyRowSelectionToGrid: true });
      onSelectedRowIdsSpy.mockClear();

      grid.setSelectedRows([0, 1, 2]);

      expect(onSelectedRowIdsSpy).toHaveBeenLastCalledWith(expect.objectContaining({ filteredIds: [4, 3, 1, 8] }), expect.anything(), dv);
    });

    it('should normalize an existing unsorted selection when the same IDs are selected again', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      grid.setSelectedRows([0, 1]);
      dv.syncGridSelection(grid, false, true);

      dv.setSelectedIds([3, 4], { isRowBeingAdded: true, applyRowSelectionToGrid: false });

      expect(dv.getAllSelectedIds()).toEqual([3, 4]);
    });

    it('should reuse pending filtered IDs for bulk grid selection', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const onSelectedRowIdsSpy = vi.spyOn(dv.onSelectedRowIdsChanged, 'notify');
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, false, true);
      dv.setSelectedIds([3, 4, 8], { isRowBeingAdded: true, shouldTriggerEvent: false, applyRowSelectionToGrid: false });

      grid.setSelectedRows([0, 1], 'click.selectAll');

      expect(onSelectedRowIdsSpy).toHaveBeenLastCalledWith(expect.objectContaining({ filteredIds: [3, 4, 8] }), expect.anything(), dv);
    });

    it('should ignore pending filtered IDs when bulk grid selection changes the selected IDs', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: true } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const onSelectedRowIdsSpy = vi.spyOn(dv.onSelectedRowIdsChanged, 'notify');
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, false, true);
      dv.setSelectedIds([8], { isRowBeingAdded: true, shouldTriggerEvent: false, applyRowSelectionToGrid: false });

      grid.setSelectedRows([0, 1], 'click.selectAll');

      expect(onSelectedRowIdsSpy).toHaveBeenLastCalledWith(expect.objectContaining({ filteredIds: [4, 3, 8] }), expect.anything(), dv);
    });

    it('should not expect row selections to be preserved when using "multiSelect:false" and setSelectedIds() even when either preseve is enabled ("preserveHidden" or "preserveHiddenOnSelectionChange")', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: false } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const setSelectedRowSpy = vi.spyOn(grid, 'setSelectedRows');
      const onSelectedRowIdsSpy = vi.spyOn(dv.onSelectedRowIdsChanged, 'notify');
      grid.setSelectionModel(new SlickHybridSelectionModel({ selectActiveRow: false, selectionType: 'row' }));
      dv.setItems(items);
      dv.setPagingOptions({ dataView: dv, pageNum: 0, pageSize: 4 });
      dv.syncGridSelection(grid, false, true);
      dv.setSelectedIds([3, 4, 8], { isRowBeingAdded: true, applyRowSelectionToGrid: true });

      expect(dv.getItemCount()).toBe(11); // full count
      expect(dv.getLength()).toBe(4); // page count
      expect(setSelectedRowSpy).toHaveBeenCalledWith([1, 0]); // 8 is outside of current page so not included
      expect(dv.getAllSelectedIds()).toEqual([3, 4]); // 8 is also included even though it's not in current page
      expect(dv.getAllSelectedItems()).toEqual([
        { id: 3, name: 'Jane', age: 24 },
        { id: 4, name: 'John', age: 20 },
      ]);

      // remove selection
      dv.setSelectedIds([3], { isRowBeingAdded: false, applyRowSelectionToGrid: false });

      expect(onSelectedRowIdsSpy).toHaveBeenCalledWith(
        {
          // filteredIds & selectedRowIds becomes empty because of disabled multiSelect not preserving row selections
          added: false,
          dataView: dv,
          filteredIds: [],
          grid,
          ids: [3],
          rows: [1],
          selectedRowIds: [],
        },
        new SlickEventData(),
        dv
      );
      expect(dv.getAllSelectedIds()).toEqual([]);
      expect(dv.getAllSelectedItems()).toEqual([]);
    });
  });

  describe('CSS Style Sync', () => {
    let items: any[] = [];
    let hash: any = {};

    beforeEach(() => {
      items = [
        { id: 4, name: 'John', age: 20 },
        { id: 3, name: 'Jane', age: 24 },
        { id: 1, name: 'Bob', age: 20 },
        { id: 5, name: 'Arnold', age: 50 },
        { id: 0, name: 'Avery', age: 44 },
        { id: 2, name: 'Rachel', age: 46 },
        { id: 6, name: 'Carole', age: 40 },
        { id: 8, name: 'Julie', age: 42 },
        { id: 7, name: 'Jason', age: 48 },
        { id: 9, name: 'Aaron', age: 23 },
        { id: 10, name: 'Ariane', age: 43 },
      ];
      hash = {};
      for (const item of items) {
        if (item.age >= 30) {
          hash[item.id] = 'highlight';
        }
      }
    });

    afterEach(() => {
      dv.destroy();
      vi.clearAllMocks();
    });

    it('should call syncGridCellCssStyles() with CSS style hashes and expect it sync it in the grid when onRowsOrCountChanged event is triggered', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: false } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const setCssStyleSpy = vi.spyOn(grid, 'setCellCssStyles');

      dv.setItems(items);
      grid.setCellCssStyles('age_greater30_highlight', hash);
      dv.syncGridCellCssStyles(grid, 'age_greater30_highlight');
      dv.onRowsOrCountChanged.notify({
        currentRowCount: 11,
        dataView: dv,
        itemCount: 11,
        previousRowCount: 11,
        rowCountChanged: true,
        rowsChanged: true,
        rowsDiff: [0],
      });

      expect(setCssStyleSpy).toHaveBeenCalledWith('age_greater30_highlight', hash);
    });

    it('should call syncGridCellCssStyles() with CSS style hashes and expect it sync it in the grid when onCellCssStylesChanged event is triggered', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: false } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const setCssStyleSpy = vi.spyOn(grid, 'setCellCssStyles');

      dv.setItems(items);
      grid.setCellCssStyles('age_greater30_highlight', hash);
      dv.syncGridCellCssStyles(grid, 'age_greater30_highlight');
      grid.onCellCssStylesChanged.notify({ grid, hash, key: 'age_greater30_highlight' });

      expect(setCssStyleSpy).toHaveBeenCalledWith('age_greater30_highlight', hash);
    });

    it('should unsubscribe onCellCssStylesChanged & onRowsOrCountChanged when onCellCssStylesChanged event is triggered without a hash', () => {
      const columns = [
        { id: 'name', field: 'name', name: 'Name' },
        { id: 'age', field: 'age', name: 'Age' },
      ];
      const gridOptions = { enableCellNavigation: true, multiSelect: false } as GridOption;
      dv = new SlickDataView({});
      const grid = new SlickGrid<any, any, any>('#myGrid', dv, columns, gridOptions);
      const unsubscribeCellCssStyleSpy = vi.spyOn(grid.onCellCssStylesChanged, 'unsubscribe');
      const unsubscribeRowOrCountSpy = vi.spyOn(dv.onRowsOrCountChanged, 'unsubscribe');

      dv.setItems(items);
      grid.setCellCssStyles('age_greater30_highlight', hash);
      dv.syncGridCellCssStyles(grid, 'age_greater30_highlight');
      grid.onCellCssStylesChanged.notify({ grid, hash: null as any, key: 'age_greater30_highlight' });

      expect(unsubscribeCellCssStyleSpy).toHaveBeenCalled();
      expect(unsubscribeRowOrCountSpy).toHaveBeenCalledWith(expect.any(Function));
    });
  });

});
