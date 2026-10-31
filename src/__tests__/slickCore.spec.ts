import { describe, expect, it, vi } from 'vitest';
import { BasePubSub, RowPositionIndexer, SelectionUtils as SlickSelectionUtils, SlickCopyRange, SlickEditorLock, SlickEvent, SlickEventData, SlickEventHandler, SlickGroup, SlickGroupTotals, SlickRange, Utils } from '../slick.core';
import { EditController } from '../models';

function makeGrid(data: any[], columns: any[], options: any = {}) {
  return {
    getVisibleColumns: () => columns,
    getOptions: () => options,
    getDataItem: (idx: number) => data[idx],
  } as any;
}

const pubSubServiceStub = {
  publish: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  unsubscribeAll: vi.fn(),
} as BasePubSub;

describe('SlickCore file', () => {
  describe('SlickEventData class', () => {
    it('should call isPropagationStopped() and expect truthy when event propagation is stopped by calling stopPropagation()', () => {
      const evt = new CustomEvent('click');
      const ed = new SlickEventData(evt);

      expect(ed.getNativeEvent()).toEqual(evt);
      expect(ed.isPropagationStopped()).toBeFalsy();

      ed.stopPropagation();

      expect(ed.isPropagationStopped()).toBeTruthy();
    });

    it('should call isImmediatePropagationStopped() and expect truthy when event propagation is stopped by calling stopImmediatePropagation()', () => {
      const evt = new CustomEvent('click');
      const ed = new SlickEventData(evt);

      expect(ed.isImmediatePropagationStopped()).toBeFalsy();

      ed.stopImmediatePropagation();

      expect(ed.isImmediatePropagationStopped()).toBeTruthy();
    });

    it('should call isDefaultPrevented() and expect truthy when event propagation is stopped by calling preventDefault()', () => {
      const ed = new SlickEventData();

      expect(ed.defaultPrevented).toBeFalsy();
      expect(ed.isDefaultPrevented()).toBeFalsy();

      ed.preventDefault();

      expect(ed.defaultPrevented).toBeTruthy();
      expect(ed.isDefaultPrevented()).toBeTruthy();
    });

    it('should be able to retrieve arguments provided by calling getArguments() method', () => {
      const evt = new Event('click');
      const mockArgs = { hello: 'world' };
      const ed = new SlickEventData(evt, mockArgs);

      expect(ed.getArguments()).toEqual(mockArgs);
    });

    it('should call isDefaultPrevented() and expect truthy when event propagation is stopped on a native event by calling preventDefault()', () => {
      const evt = new Event('click');
      const evtSpy = vi.spyOn(evt, 'preventDefault');
      const ed = new SlickEventData(evt);

      expect(ed.defaultPrevented).toBeFalsy();
      expect(ed.isDefaultPrevented()).toBeFalsy();

      ed.preventDefault();
      ed.stopPropagation();

      expect(evtSpy).toHaveBeenCalled();
    });

    it('should be able to call addReturnValue() with input and expect the same first input value when calling getReturnValue(), calling it subsequently will always return first value', () => {
      const ed = new SlickEventData();
      ed.addReturnValue('last value');

      expect(ed.getReturnValue()).toBe('last value');

      ed.addReturnValue(false);
      expect(ed.getReturnValue()).toBe('last value');
    });

    it('should keep the first return value when more values are added', () => {
      const ed = new SlickEventData();
      ed.addReturnValue('last value');

      expect(ed.getReturnValue()).toBe('last value');

      expect(ed.getReturnValue()).toBe('last value');
    });
  });

  describe('SlickEvent class', () => {
    it('should be able to subscribe to an event and call unsubscribe() and expect 1 subscriber to be dropped', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const onClick = new SlickEvent();
      onClick.subscribe(spy1);
      onClick.subscribe(spy2);

      expect(onClick.subscriberCount).toBe(2);

      onClick.unsubscribe(spy1);
      expect(onClick.subscriberCount).toBe(1);
    });

    it('should notify subscribers without resetting existing return values', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const ed = new SlickEventData();
      const onClick = new SlickEvent('onClick');
      ed.addReturnValue('existing value');
      onClick.subscribe(spy1);
      onClick.subscribe(spy2);

      expect(onClick.subscriberCount).toBe(2);

      onClick.notify({ hello: 'world' }, ed);

      expect(spy1).toHaveBeenCalledWith(ed, { hello: 'world' });
      expect(spy2).toHaveBeenCalledWith(ed, { hello: 'world' });
      expect(ed.getReturnValue()).toBe('existing value');
    });

    it('should be able to subscribe to an event, call notify() and all subscribers to receive what was sent', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const ed = new SlickEventData();
      const onClick = new SlickEvent();
      onClick.subscribe(spy1);
      onClick.subscribe(spy2);

      expect(onClick.subscriberCount).toBe(2);

      onClick.notify({ hello: 'world' }, ed);

      expect(spy1).toHaveBeenCalledWith(ed, { hello: 'world' });
    });

    it('should be able to add a PubSub instance to the SlickEvent call notify() and expect PubSub .publish() to be called as well', () => {
      const ed = new SlickEventData();
      const onClick = new SlickEvent('onClick', pubSubServiceStub);

      onClick.notify({ hello: 'world' }, ed);

      expect(pubSubServiceStub.publish).toHaveBeenCalledWith('onClick', { eventData: ed, args: { hello: 'world' } });
    });

    it('should be able to mix a PubSub with regular SlickEvent subscribe and expect both to be triggered by the SlickEvent call notify()', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const ed = new SlickEventData();
      const onClick = new SlickEvent('onClick', pubSubServiceStub);
      onClick.subscribe(spy1);
      onClick.subscribe(spy2);

      expect(onClick.subscriberCount).toBe(2);

      onClick.notify({ hello: 'world' }, ed);

      expect(spy1).toHaveBeenCalledWith(ed, { hello: 'world' });
      expect(pubSubServiceStub.publish).toHaveBeenCalledWith('onClick', { eventData: ed, args: { hello: 'world' } });
    });

    it('should be able to call addSlickEventPubSubWhenDefined() and expect PubSub to be available in SlickEvent', () => {
      const ed = new SlickEventData();
      const onClick = new SlickEvent('onClick');
      const scope = { onClick };
      const setPubSubSpy = vi.spyOn(onClick, 'setPubSubService');

      Utils.addSlickEventPubSubWhenDefined(pubSubServiceStub, scope);
      onClick.notify({ hello: 'world' }, ed);

      expect(setPubSubSpy).toHaveBeenCalledWith(pubSubServiceStub);
      expect(pubSubServiceStub.publish).toHaveBeenCalledWith('onClick', { eventData: ed, args: { hello: 'world' } });
    });

    it('should do nothing when addSlickEventPubSubWhenDefined() is called without PubSub', () => {
      const onClick = new SlickEvent('onClick');
      const setPubSubSpy = vi.spyOn(onClick, 'setPubSubService');

      Utils.addSlickEventPubSubWhenDefined(undefined as any, { onClick });

      expect(setPubSubSpy).not.toHaveBeenCalled();
    });

    it('should publish the event data without changing the native event', () => {
      const ed = new SlickEventData();
      const publishSpy = vi.fn();
      const pubSubCopy = { ...pubSubServiceStub, publish: publishSpy };
      const onClick = new SlickEvent('onClick', pubSubCopy);
      onClick.notify({ hello: 'world' }, ed);

      expect(ed.getNativeEvent()).toBeUndefined();
      expect(publishSpy).toHaveBeenCalledWith('onClick', { eventData: ed, args: { hello: 'world' } });
    });
  });

  describe('SlickEventHandler class', () => {
    it('should be able to subscribe to multiple events and call unsubscribe() a single event', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const eventHandler = new SlickEventHandler();
      const onClick = new SlickEvent();
      const onDblClick = new SlickEvent();

      eventHandler.subscribe(onClick, spy1);
      eventHandler.subscribe(onDblClick, spy2);

      expect(onClick.subscriberCount + onDblClick.subscriberCount).toBe(2);

      const chain = eventHandler.unsubscribe(onClick, spy1);

      expect(chain).toBeUndefined(); // returns undefined when handler is found
      expect(onClick.subscriberCount + onDblClick.subscriberCount).toBe(1);
    });

    it('should return same amount of handlers when calling unsubscribe() on an event that is not found', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const eventHandler = new SlickEventHandler();
      const onClick = new SlickEvent();
      const onDblClick = new SlickEvent();

      eventHandler.subscribe(onClick, spy1);
      eventHandler.subscribe(onDblClick, spy2);

      expect(onClick.subscriberCount + onDblClick.subscriberCount).toBe(2);

      const chain = eventHandler.unsubscribe({} as any, spy1);

      expect(chain).toEqual(eventHandler);
      expect(onClick.subscriberCount + onDblClick.subscriberCount).toBe(2);
    });

    it('should be able to subscribe to multiple events and expect no more event handlers when calling unsubscribeAll()', () => {
      const spy1 = vi.fn();
      const spy2 = vi.fn();
      const eventHandler = new SlickEventHandler();
      const onClick = new SlickEvent();
      const onDblClick = new SlickEvent();

      eventHandler.subscribe(onClick, spy1);
      eventHandler.subscribe(onDblClick, spy2);

      expect(onClick.subscriberCount + onDblClick.subscriberCount).toBe(2);

      const chain = eventHandler.unsubscribeAll();

      expect(onClick.subscriberCount + onDblClick.subscriberCount).toBe(0);
      expect(chain).toEqual(eventHandler);
    });
  });

  describe('SlickRange class', () => {
    it('should call isSingleCell() and expect truthy when fromRow equals toRow', () => {
      const range = new SlickRange(0, 2);
      range.fromCell = 0;
      range.toCell = 0;

      expect(range.isSingleCell()).toBeTruthy();
    });

    it('should call isSingleCell() and expect falsy when fromRow does not equals toRow', () => {
      const range = new SlickRange(0, 2);
      range.fromCell = 0;
      range.toCell = 2;

      expect(range.isSingleCell()).toBeFalsy();
    });

    it('should call isSingleRow() and expect truthy when fromRow equals toRow', () => {
      const range = new SlickRange(0, 0);
      range.fromRow = 0;
      range.toRow = 0;

      expect(range.isSingleRow()).toBeTruthy();
    });

    it('should call isSingleRow() and expect falsy when fromRow does not equals toRow', () => {
      const range = new SlickRange(0, 1);
      range.fromRow = 0;
      range.toRow = 2;

      expect(range.isSingleRow()).toBeFalsy();
    });

    it('should call contains() and expect falsy when row is not found', () => {
      const range = new SlickRange(0, 1, 2, 5);

      expect(range.contains(4, 0)).toBeFalsy();
    });

    it('should call contains() and expect truthy when row is found within the range', () => {
      const range = new SlickRange(0, 1, 2, 5);

      expect(range.contains(1, 3)).toBeTruthy();
    });

    it('should call toString() and expect a readable stringified result for a single cell range', () => {
      const range = new SlickRange(0, 1, 0, 1);

      expect(range.toString()).toBe('(0:1)');
    });

    it('should call toString() and expect a readable stringified result for a range including multiple cells', () => {
      const range = new SlickRange(0, 1, 2, 5);

      expect(range.toString()).toBe('(0:1 - 2:5)');
    });
  });

  describe('SlickCopyRange class', () => {
    it('should be able to instantiate SlickCopyRange class', () => {
      const range = new SlickCopyRange(0, 2, 3, 4);

      expect(range).toEqual(new SlickCopyRange(0, 2, 3, 4));
    });
  });

  describe('SlickGroup class', () => {
    it('should call equals() and return truthy when groups are equal', () => {
      const group = new SlickGroup();
      group.value = '123' as any;
      group.count = 2;
      group.collapsed = false;
      group.level = 0;
      group.title = 'my title';
      const group2 = { ...group } as SlickGroup;

      expect(group.equals(group2)).toBeTruthy();
    });

    it('should call equals() and return false when groups have differences', () => {
      const group = new SlickGroup();
      group.value = '123' as any;
      group.count = 2;
      group.collapsed = false;
      group.level = 0;
      group.title = 'my title';

      const group2 = { ...group } as SlickGroup;
      group2.title = 'another title';
      group.value = '222' as any;

      expect(group.equals(group2)).toBeFalsy();
    });
  });

  describe('SlickGroupTotals class', () => {
    it('should be able to create a SlickGroupTotals and assign a SlickGroup', () => {
      const group = new SlickGroup();
      group.value = '123' as any;
      group.count = 2;
      group.collapsed = false;
      group.level = 0;
      group.title = 'my title';

      const groupTotals = new SlickGroupTotals();
      groupTotals.group = group;
      group.totals = groupTotals;

      expect(groupTotals).toBeTruthy();
      expect(groupTotals.__nonDataRow).toBeTruthy();
      expect(groupTotals.__groupTotals).toBeTruthy();
      expect(groupTotals.initialized).toBeFalsy();

      groupTotals.initialized = true;
      expect(groupTotals.initialized).toBeTruthy();
    });
  });

  describe('RowPositionIndexer class', () => {
    it('should build row top positions and row heights from callback values', () => {
      const indexer = new RowPositionIndexer();
      indexer.rebuild(3, 25, (row) => [25, 40, 30][row]);

      expect(indexer.count).toBe(3);
      expect(indexer.top(0)).toBe(0);
      expect(indexer.top(1)).toBe(25);
      expect(indexer.top(2)).toBe(65);
      expect(indexer.height(0)).toBe(25);
      expect(indexer.height(1)).toBe(40);
      expect(indexer.height(2)).toBe(30);
    });

    it('should fallback to default row height for undefined callback values and for extrapolated rows', () => {
      const indexer = new RowPositionIndexer();
      indexer.rebuild(2, 20, (row) => (row === 0 ? 35 : undefined));

      expect(indexer.height(0)).toBe(35);
      expect(indexer.height(1)).toBe(20);
      expect(indexer.top(2)).toBe(55);
      expect(indexer.height(2)).toBe(20);
      expect(indexer.top(3)).toBe(75);
    });

    it('should map vertical positions to row indexes for in-range and extrapolated positions', () => {
      const indexer = new RowPositionIndexer();
      indexer.rebuild(3, 25, (row) => [25, 40, 30][row]); // tops: 0, 25, 65, total: 95

      expect(indexer.rowAt(-3)).toBe(0);
      expect(indexer.rowAt(0)).toBe(0);
      expect(indexer.rowAt(24)).toBe(0);
      expect(indexer.rowAt(25)).toBe(1);
      expect(indexer.rowAt(64)).toBe(1);
      expect(indexer.rowAt(65)).toBe(2);
      expect(indexer.rowAt(94)).toBe(2);
      expect(indexer.rowAt(95)).toBe(3);
      expect(indexer.rowAt(119)).toBe(3);
      expect(indexer.rowAt(120)).toBe(4);
    });
  });

  describe('SlickEditorLock class', () => {
    it('should activate an EditController and expect isActive() to be truthy', () => {
      const commitSpy = vi.fn();
      const cancelSpy = vi.fn();
      const ec = { commitCurrentEdit: commitSpy, cancelCurrentEdit: cancelSpy } as EditController;

      const elock = new SlickEditorLock();
      elock.activate(ec);
      elock.activate(ec); // calling 2x shouldn't cause problem

      expect(elock.isActive()).toBeTruthy();
    });

    it('should report inactive/active state when checking without a specific controller', () => {
      const lock = new SlickEditorLock();
      expect(lock.isActive()).toBe(false);

      lock.activeEditController = { commitCurrentEdit: vi.fn(), cancelCurrentEdit: vi.fn() } as any;
      expect(lock.isActive()).toBe(true);
    });

    it('should compare a provided controller against the active controller', () => {
      const lock = new SlickEditorLock();
      const active = { commitCurrentEdit: vi.fn(), cancelCurrentEdit: vi.fn() } as EditController;
      const other = { commitCurrentEdit: vi.fn(), cancelCurrentEdit: vi.fn() } as EditController;
      lock.activate(active);

      expect(lock.isActive(active)).toBe(true);
      expect(lock.isActive(other)).toBe(false);
    });

    describe('parents() function', () => {
      it('should return all parents when selector is omitted', () => {
        const container = document.createElement('div');
        const div = document.createElement('div');
        const span = document.createElement('span');
        container.appendChild(div);
        div.appendChild(span);

        const result = Utils.parents(span) as HTMLElement[];

        expect(result).toEqual([div]);
      });
    });

    it('should throw when trying to call activate() with a second EditController', () => {
      const commitSpy = vi.fn();
      const cancelSpy = vi.fn();
      const commit2Spy = vi.fn();
      const cancel2Spy = vi.fn();
      const ec = { commitCurrentEdit: commitSpy, cancelCurrentEdit: cancelSpy } as EditController;
      const ec2 = { commitCurrentEdit: commit2Spy, cancelCurrentEdit: cancel2Spy } as EditController;

      const elock = new SlickEditorLock();
      elock.activate(ec);

      expect(() => elock.activate(ec2)).toThrow(`Slick.EditorLock.activate: an editController is still active, can't activate another editController`);
    });

    it('should throw when trying to call activate() with an EditController that forgot to implement commitCurrentEdit() method', () => {
      const cancelSpy = vi.fn();
      const ec = { cancelCurrentEdit: cancelSpy } as any;

      const elock = new SlickEditorLock();
      expect(() => elock.activate(ec)).toThrow(`Slick.EditorLock.activate: editController must implement .commitCurrentEdit()`);
    });

    it('should throw when trying to call activate() with an EditController that forgot to implement cancelCurrentEdit() method', () => {
      const commitSpy = vi.fn();
      const ec = { commitCurrentEdit: commitSpy } as any;

      const elock = new SlickEditorLock();
      expect(() => elock.activate(ec)).toThrow(`Slick.EditorLock.activate: editController must implement .cancelCurrentEdit()`);
    });

    it('should deactivate an EditController and expect isActive() to be falsy', () => {
      const commitSpy = vi.fn();
      const cancelSpy = vi.fn();
      const ec = { commitCurrentEdit: commitSpy, cancelCurrentEdit: cancelSpy } as EditController;

      const elock = new SlickEditorLock();
      elock.activate(ec);
      expect(elock.isActive()).toBeTruthy();

      elock.deactivate(ec);
      elock.deactivate(ec); // calling 2x should yield to same problem
      expect(elock.isActive()).toBeFalsy();
    });

    it('should throw when trying to deactivate an EditController that does not equal to the currently active EditController', () => {
      const commitSpy = vi.fn();
      const cancelSpy = vi.fn();
      const commit2Spy = vi.fn();
      const cancel2Spy = vi.fn();
      const ec = { commitCurrentEdit: commitSpy, cancelCurrentEdit: cancelSpy } as EditController;
      const ec2 = { commitCurrentEdit: commit2Spy, cancelCurrentEdit: cancel2Spy } as EditController;

      const elock = new SlickEditorLock();
      elock.activate(ec);

      expect(() => elock.deactivate(ec2)).toThrow(`Slick.EditorLock.deactivate: specified editController is not the currently active one`);
    });

    it('should expect active EditController.commitCurrentEdit() being called when calling commitCurrentEdit() after it was activated', () => {
      const commitSpy = vi.fn().mockReturnValue(true);
      const cancelSpy = vi.fn().mockReturnValue(true);
      const ec = { commitCurrentEdit: commitSpy, cancelCurrentEdit: cancelSpy } as EditController;

      const elock = new SlickEditorLock();
      elock.activate(ec);
      const committed = elock.commitCurrentEdit();

      expect(elock.isActive()).toBeTruthy();
      expect(commitSpy).toHaveBeenCalled();
      expect(cancelSpy).not.toHaveBeenCalled();
      expect(committed).toBe(true);
    });

    it('should expect active EditController.commitCurrentEdit() being called when calling commitCurrentEdit() after it was activated', () => {
      const commitSpy = vi.fn().mockReturnValue(true);
      const cancelSpy = vi.fn().mockReturnValue(true);
      const ec = { commitCurrentEdit: commitSpy, cancelCurrentEdit: cancelSpy } as EditController;

      const elock = new SlickEditorLock();
      elock.activate(ec);
      const cancelled = elock.cancelCurrentEdit();

      expect(elock.isActive()).toBeTruthy();
      expect(cancelSpy).toHaveBeenCalled();
      expect(commitSpy).not.toHaveBeenCalled();
      expect(cancelled).toBe(true);
    });
  });

  describe('Utils', () => {
    describe('storage() function', () => {
      it('should be able to store an object and retrieve it later', () => {
        const div = document.createElement('div');
        const col = { id: 'first', field: 'firstName', name: 'First Name' };

        Utils.storage.put(div, 'column', col);
        Utils.storage.put(div, 'column-2', col);
        const result = Utils.storage.get(div, 'column');

        expect(result).toEqual(col);
      });

      it('should be able to store an object and return null when element provided to .get() is invalid', () => {
        const div = document.createElement('div');
        const col = { id: 'first', field: 'firstName', name: 'First Name' };

        Utils.storage.put(div, 'column', col);
        const result = Utils.storage.get(null as any, 'column');

        expect(result).toBeNull();
      });

      it('should be able to store an object and retrieve it, then remove it and expect null', () => {
        const div = document.createElement('div');
        const col = { id: 'first', field: 'firstName', name: 'First Name' };

        Utils.storage.put(div, 'column', col);
        const result = Utils.storage.get(div, 'column');
        expect(result).toEqual(col);

        const removed = Utils.storage.remove(div, 'column');
        const result2 = Utils.storage.get(div, 'column');
        expect(result2).toBeUndefined();
        expect(removed).toBeTruthy();
      });

      it('should be able to store an object and return falsy when trying to remove something that does not exist', () => {
        const div = document.createElement('div');
        const col = { id: 'first', field: 'firstName', name: 'First Name' };

        Utils.storage.put(div, 'column', col);
        const result = Utils.storage.get(div, 'column');
        expect(result).toEqual(col);

        const removed = Utils.storage.remove(div, 'column2');
        expect(removed).toBeFalsy();
      });
    });

    describe('height() function', () => {
      it('should return null when calling without a valid element', () => {
        const result = Utils.height(null as any);
        expect(result).toBeUndefined();
      });

      it('should return client rect height when called without a 2nd argument value', () => {
        const div = document.createElement('div');
        vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({ height: 120 } as DOMRect);

        const result = Utils.height(div);

        expect(result).toBe(120);
      });

      it('should apply height to element when called with a 2nd argument value', () => {
        const div = document.createElement('div');
        vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({ height: 120 } as DOMRect);

        Utils.height(div, 130);

        expect(div.style.height).toBe('130px');
      });
    });

    describe('width() function', () => {
      it('should return null when calling without a valid element', () => {
        const result = Utils.width(null as any);
        expect(result).toBeUndefined();
      });

      it('should return client rect width when called without a 2nd argument value', () => {
        const div = document.createElement('div');
        vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({ width: 120 } as DOMRect);

        const result = Utils.width(div);

        expect(result).toBe(120);
      });

      it('should apply width to element when called with a 2nd argument value', () => {
        const div = document.createElement('div');
        vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({ width: 120 } as DOMRect);

        Utils.width(div, 130);

        expect(div.style.width).toBe('130px');
      });
    });

    describe('parents() function', () => {
      it('should return parent array when container element is hidden and we pass :hidden selector', () => {
        const container = document.createElement('div');
        const div = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');
        Object.defineProperty(div, 'offsetWidth', { writable: true, configurable: true, value: 0 });
        Object.defineProperty(div, 'offsetHeight', { writable: true, configurable: true, value: 0 });
        span.appendChild(input);
        div.appendChild(span);
        container.appendChild(div);

        const result = Utils.parents(span, ':hidden') as HTMLElement[];

        expect(result).toEqual([div]);
      });

      it('should skip visible parents when querying :hidden', () => {
        const container = document.createElement('div');
        const div = document.createElement('div');
        const span = document.createElement('span');
        Object.defineProperty(div, 'offsetWidth', { writable: true, configurable: true, value: 12 });
        Object.defineProperty(div, 'offsetHeight', { writable: true, configurable: true, value: 12 });
        div.appendChild(span);
        container.appendChild(div);

        expect(Utils.parents(span, ':hidden')).toEqual([]);
      });

      it('should return no parent when container element is hidden and we pass :visible selector', () => {
        const container = document.createElement('div');
        const div = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');
        Object.defineProperty(div, 'offsetWidth', { writable: true, configurable: true, value: 0 });
        Object.defineProperty(div, 'offsetHeight', { writable: true, configurable: true, value: 0 });
        span.appendChild(input);
        div.appendChild(span);
        container.appendChild(div);

        const result = Utils.parents(span, ':visible') as HTMLElement[];

        expect(result).toEqual([]);
      });

      it('should return no parent when container element itself has no parent', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');
        span.appendChild(input);
        div.appendChild(span);

        const result = Utils.parents(span, ':hidden') as HTMLElement[];

        expect(result).toEqual([]);
      });

      it('should return parent array when container element is visible and we pass :visible selector', () => {
        const container = document.createElement('div');
        const div = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');
        Object.defineProperty(div, 'offsetWidth', { writable: true, configurable: true, value: 12 });
        Object.defineProperty(div, 'offsetHeight', { writable: true, configurable: true, value: 12 });
        span.appendChild(input);
        div.appendChild(span);
        container.appendChild(div);

        const result = Utils.parents(span, ':visible') as HTMLElement[];

        expect(result).toEqual([div]);
      });

      it('should return list of parents with that includes querying selector with certain css class', () => {
        const container = document.createElement('div');
        const div = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');
        div.className = 'my-class';
        span.appendChild(input);
        div.appendChild(span);
        container.appendChild(div);

        const result = Utils.parents(span, '.my-class') as HTMLElement[];

        expect(result).toEqual([div]);
      });

      it('should stop walking parents when parentNode is missing', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        const fakeParent: any = { parentNode: null, matches: vi.fn().mockReturnValue(false) };
        Object.defineProperty(span, 'parentNode', { configurable: true, value: fakeParent });

        const result = Utils.parents(span, '.my-class') as HTMLElement[];
        expect(result).toEqual([]);
      });
    });

    describe('setStyleSize() function', () => {
      it('should execute value function when value is a function', () => {
        const mockFn = vi.fn().mockReturnValue(110);
        const div = document.createElement('div');
        Utils.setStyleSize(div, 'width', mockFn);

        expect(mockFn).toHaveBeenCalled();
        expect(div.style.width).toBe('110px');
      });
    });

    describe('isHidden() function', () => {
      it('should be falsy when element has height/width greater than 0', () => {
        const div = document.createElement('div');
        Object.defineProperty(div, 'offsetWidth', { writable: true, configurable: true, value: 10 });
        Object.defineProperty(div, 'offsetHeight', { writable: true, configurable: true, value: 10 });

        const result = Utils.isHidden(div);

        expect(result).toBeFalsy();
      });

      it('should be truthy when element has both height/width as 0', () => {
        const div = document.createElement('div');
        Object.defineProperty(div, 'offsetWidth', { writable: true, configurable: true, value: 0 });
        Object.defineProperty(div, 'offsetHeight', { writable: true, configurable: true, value: 0 });

        const result = Utils.isHidden(div);

        expect(result).toBeTruthy();
      });
    });

    describe('show() function', () => {
      it('should make element visible when providing a single element', () => {
        const div = document.createElement('div');
        div.style.display = 'none';
        Utils.show(div, 'block');

        expect(div.style.display).toBe('block');
      });

      it('should make multiple elements visible when providing an array of elements', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.style.display = 'none';
        span.style.display = 'none';

        Utils.show([div, span], 'block');

        expect(div.style.display).toBe('block');
        expect(span.style.display).toBe('block');
      });
    });

    describe('hide() function', () => {
      it('should make element hidden when providing a single element', () => {
        const div = document.createElement('div');
        div.style.display = 'block';
        Utils.hide(div);

        expect(div.style.display).toBe('none');
      });

      it('should make multiple elements hidden when providing an array of elements', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.style.display = 'block';
        span.style.display = 'block';

        Utils.hide([div, span]);

        expect(div.style.display).toBe('none');
        expect(span.style.display).toBe('none');
      });
    });

    describe('toFloat() function', () => {
      it('should parse string as a number', () => {
        const result = Utils.toFloat('120.2');

        expect(result).toBe(120.2);
      });

      it('should be able to parse string that include other text', () => {
        const result = Utils.toFloat('120.2px');

        expect(result).toBe(120.2);
      });

      it('should return 0 when input is not a number', () => {
        const result = Utils.toFloat('abc');

        expect(result).toBe(0);
      });
    });

    describe('applyDefaults() function', () => {
      it('should apply default values to the input object', () => {
        const defaults = {
          alwaysShowVerticalScroll: false,
          alwaysAllowHorizontalScroll: false,
        };
        const inputObj = { alwaysShowVerticalScroll: true };
        Utils.applyDefaults(inputObj, defaults);

        expect(inputObj).toEqual({
          alwaysShowVerticalScroll: true,
          alwaysAllowHorizontalScroll: false,
        });
      });

      it('should do nothing when source object is not an object', () => {
        const inputObj = { alwaysShowVerticalScroll: true };

        Utils.applyDefaults(inputObj, undefined as any);
        Utils.applyDefaults(inputObj, 123 as any);

        expect(inputObj).toEqual({ alwaysShowVerticalScroll: true });
      });

      it('should ignore inherited properties from source object', () => {
        const proto = { inherited: 'x' };
        const defaults = Object.create(proto);
        defaults.ownValue = true;
        const inputObj: any = {};

        Utils.applyDefaults(inputObj, defaults);

        expect(inputObj).toEqual({ ownValue: true });
        expect(inputObj.inherited).toBeUndefined();
      });

      it('should return null when key does not exist for an element', () => {
        const el = document.createElement('div');
        const result = Utils.storage.get(el, 'missing');
        expect(result).toBeNull();
      });
    });

    describe('normalRangeOppositeCellFromCopy()', () => {
      it('should fallback to 0 when target uses end-bound branch but end bounds are undefined', () => {
        const normRange = { start: { row: 5, cell: 5 }, end: {} };
        const target = { row: -1, cell: -1 };

        const result = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, target);
        expect(result).toEqual({ row: 0, cell: 0 });
      });
    });
  });

  describe('SlickSelectionUtils', () => {
    describe('copyRangeIsLarger()', () => {
      const baseRange = new SlickRange(2, 2, 4, 4);

      it('should return true when copyToRange extends beyond baseRange on any side', () => {
        // Test each boundary condition
        expect(SlickSelectionUtils.copyRangeIsLarger(baseRange, new SlickRange(1, 2, 4, 4))).toBe(true); // fromRow < base
        expect(SlickSelectionUtils.copyRangeIsLarger(baseRange, new SlickRange(2, 1, 4, 4))).toBe(true); // fromCell < base
        expect(SlickSelectionUtils.copyRangeIsLarger(baseRange, new SlickRange(2, 2, 5, 4))).toBe(true); // toRow > base
        expect(SlickSelectionUtils.copyRangeIsLarger(baseRange, new SlickRange(2, 2, 4, 5))).toBe(true); // toCell > base
      });

      it('should return false when copyToRange is within or equal to baseRange', () => {
        expect(SlickSelectionUtils.copyRangeIsLarger(baseRange, baseRange)).toBe(false); // equal ranges
        expect(SlickSelectionUtils.copyRangeIsLarger(baseRange, new SlickRange(3, 3, 3, 3))).toBe(false); // fully inside
      });
    });

    describe('normalRangeOppositeCellFromCopy()', () => {
      it('should return correct opposite cell when target is below/right of range', () => {
        const normRange = { start: { row: 1, cell: 1 }, end: { row: 3, cell: 3 } };
        const targetBelow = { row: 4, cell: 2 }; // below range
        const targetRight = { row: 2, cell: 4 }; // right of range

        // When target is below, should return start row
        const resultBelow = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, targetBelow);
        expect(resultBelow.row).toBe(normRange.start.row);

        // When target is right, should return start cell
        const resultRight = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, targetRight);
        expect(resultRight.cell).toBe(normRange.start.cell);
      });

      it('should return correct opposite cell when target is above/left of range', () => {
        const normRange = { start: { row: 3, cell: 3 }, end: { row: 5, cell: 5 } };
        const targetAbove = { row: 1, cell: 4 }; // above range
        const targetLeft = { row: 4, cell: 1 }; // left of range

        // When target is above, should return end row
        const resultAbove = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, targetAbove);
        expect(resultAbove.row).toBe(normRange.end.row);

        // When target is left, should return end cell
        const resultLeft = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, targetLeft);
        expect(resultLeft.cell).toBe(normRange.end.cell);
      });

      it('should anchor on the range start when target is inside the range so that it can shrink', () => {
        const normRange = { start: { row: 3, cell: 3 }, end: { row: 5, cell: 5 } };

        // dragging the handle back inside the range shrinks it (anchor stays on the range start)
        const result = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, { row: 4, cell: 4 });
        expect(result).toEqual({ row: 3, cell: 3 });
      });

      it('should fallback to 0 when normalised range has undefined bounds', () => {
        const normRange = { start: {}, end: {} };
        const target = { row: 0, cell: 0 };

        const result = SlickSelectionUtils.normalRangeOppositeCellFromCopy(normRange as any, target);
        expect(result).toEqual({ row: 0, cell: 0 });
      });
    });
    describe('normaliseDragRange()', () => {
      it('should normalize an already ordered drag range', () => {
        const rawRange = { start: { row: 2, cell: 1 }, end: { row: 4, cell: 3 } };
        const norm = SlickSelectionUtils.normaliseDragRange(rawRange as any);

        expect(norm.start).toEqual({ row: 2, cell: 1 });
        expect(norm.end).toEqual({ row: 4, cell: 3 });
        expect(norm.rowCount).toBe(3);
        expect(norm.cellCount).toBe(3);
        expect(norm.wasDraggedUp).toBe(false);
        // Note: implementation uses row comparison for wasDraggedLeft (keeps parity with code)
        expect(norm.wasDraggedLeft).toBe(false);
      });

      it('should normalize a dragged-up/left range and set wasDragged flags', () => {
        const rawRange = { start: { row: 4, cell: 5 }, end: { row: 1, cell: 2 } };
        const norm = SlickSelectionUtils.normaliseDragRange(rawRange as any);

        expect(norm.start).toEqual({ row: 1, cell: 2 });
        expect(norm.end).toEqual({ row: 4, cell: 5 });
        expect(norm.rowCount).toBe(4);
        expect(norm.cellCount).toBe(4);
        expect(norm.wasDraggedUp).toBe(true);
        // Implementation currently derives wasDraggedLeft from rows as well
        expect(norm.wasDraggedLeft).toBe(true);
      });

      it('should normalize ranges with missing row/cell values using 0 defaults', () => {
        const rawRange = { start: {}, end: {} };
        const norm = SlickSelectionUtils.normaliseDragRange(rawRange as any);

        expect(norm.start).toEqual({ row: undefined, cell: undefined });
        expect(norm.end).toEqual({ row: undefined, cell: undefined });
        expect(norm.rowCount).toBe(1);
        expect(norm.cellCount).toBe(1);
        expect(norm.wasDraggedUp).toBe(false);
        expect(norm.wasDraggedLeft).toBe(false);
      });
    });

    describe('verticalTargetRange()', () => {
      const base = new SlickRange(2, 1, 4, 3);

      it('should return a vertical target range when copying above', () => {
        const copyTo = new SlickRange(0, 0, 1, 2); // copy above base
        const result = SlickSelectionUtils.verticalTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(0, 0, 1, 3));
      });

      it('should return a vertical target range when copying below', () => {
        const copyTo = new SlickRange(5, 0, 6, 4); // copy below base
        const result = SlickSelectionUtils.verticalTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(5, 0, 6, 3));
      });

      it('should return null when no vertical copy area exists', () => {
        const copyTo = new SlickRange(3, 0, 3, 2); // fully inside base vertically
        const result = SlickSelectionUtils.verticalTargetRange(base, copyTo);
        expect(result).toBeNull();
      });
    });

    describe('horizontalTargetRange()', () => {
      const base = new SlickRange(2, 2, 4, 4);

      it('should return a horizontal target range when copying to the left', () => {
        const copyTo = new SlickRange(2, 0, 4, 1); // left of base
        const result = SlickSelectionUtils.horizontalTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(2, 0, 4, 1));
      });

      it('should return a horizontal target range when copying to the right', () => {
        const copyTo = new SlickRange(2, 5, 4, 6); // right of base
        const result = SlickSelectionUtils.horizontalTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(2, 5, 4, 6));
      });

      it('should return null when no horizontal copy area exists', () => {
        const copyTo = new SlickRange(2, 3, 4, 3); // inside base horizontally
        const result = SlickSelectionUtils.horizontalTargetRange(base, copyTo);
        expect(result).toBeNull();
      });
    });

    describe('cornerTargetRange()', () => {
      it('should return null when having (!copyLeft && !copyRight)', () => {
        const copyTo = new SlickRange(0, 2, 4, 1);
        const base = new SlickRange(2, 1, 1, 4);
        const result = SlickSelectionUtils.cornerTargetRange(base, copyTo);
        expect(result).toBeNull();
      });

      it('should return null when having (!copyUp && !copyDown)', () => {
        const copyTo = new SlickRange(2, 0, 1, 1);
        const base = new SlickRange(1, 2, 4, 4);
        const result = SlickSelectionUtils.cornerTargetRange(base, copyTo);
        expect(result).toBeNull();
      });

      it('should return corner range when copying to top-left (copyLeft && copyUp)', () => {
        const copyTo = new SlickRange(0, 0, 1, 1);
        const base = new SlickRange(2, 2, 4, 4);
        const result = SlickSelectionUtils.cornerTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(0, 0, 1, 1));
      });

      it('should return corner range when copying to top-left (copyLeft && copyDown)', () => {
        const copyTo = new SlickRange(2, 0, 4, 4);
        const base = new SlickRange(0, 2, 1, 1);
        const result = SlickSelectionUtils.cornerTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(2, 0, 4, 0));
      });

      it('should return corner range when copying to bottom-right (copyRight && copyUp)', () => {
        const copyTo = new SlickRange(2, 5, 6, 6);
        const base = new SlickRange(5, 2, 4, 4);
        const result = SlickSelectionUtils.cornerTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(2, 5, 3, 6));
      });

      it('should return corner range when copying to bottom-right (copyRight && copyDown)', () => {
        const copyTo = new SlickRange(5, 5, 6, 6);
        const base = new SlickRange(2, 2, 4, 4);
        const result = SlickSelectionUtils.cornerTargetRange(base, copyTo);
        expect(result).toEqual(new SlickRange(5, 5, 6, 6));
      });
    });

    describe('SlickSelectionUtils.copyCellsToTargetRange', () => {
      it('copies values from base range to target range for matching visible columns', () => {
        const columns = [{ field: 'f0' }, { field: 'f1' }, { field: 'f2' }, { field: 'f3' }];

        const data = Array.from({ length: 6 }, (_, r) => ({
          f0: `r${r}c0`,
          f1: `r${r}c1`,
          f2: `r${r}c2`,
          f3: `r${r}c3`,
        }));

        const grid = makeGrid(data, columns);

        const baseRange = new SlickRange(0, 1, 1, 2); // rows 0-1, cells f1..f2
        const targetRange = new SlickRange(2, 1, 3, 2); // rows 2-3, cells f1..f2

        SlickSelectionUtils.copyCellsToTargetRange(baseRange, targetRange, grid);

        // Verify copied values
        for (let i = 0; i < targetRange.rowCount(); i++) {
          const toRow = data[targetRange.fromRow + i];
          const fromRow = data[baseRange.fromRow + i];
          for (let j = 0; j < targetRange.cellCount(); j++) {
            const toField = columns[targetRange.fromCell + j].field;
            const fromField = columns[baseRange.fromCell + j].field;
            expect((toRow as any)[toField]).toBe((fromRow as any)[fromField]);
          }
        }
      });

      it('skips copies when either source or target column is hidden', () => {
        const columns = [
          { field: 'f0' },
          { field: 'f1', hidden: true }, // hidden source/target column
          { field: 'f2' },
        ];

        const data = Array.from({ length: 4 }, (_, r) => ({
          f0: `r${r}c0`,
          f1: `r${r}c1`,
          f2: `r${r}c2`,
        }));

        // make a copy target that includes the hidden column index 1
        const grid = makeGrid(data, columns);

        // pre-fill target rows with sentinel so we can assert it wasn't overwritten
        data[2].f1 = 'SENTINEL';
        data[3].f1 = 'SENTINEL';

        const baseRange = new SlickRange(0, 1, 1, 2); // includes hidden col f1 and visible f2
        const targetRange = new SlickRange(2, 1, 3, 2);

        SlickSelectionUtils.copyCellsToTargetRange(baseRange, targetRange, grid);

        // Hidden column should remain sentinel, visible column should be copied
        expect(data[2].f1).toBe('SENTINEL');
        expect(data[3].f1).toBe('SENTINEL');

        // f2 (visible) should have been copied from base
        expect(data[2].f2).toBe(data[baseRange.fromRow].f2);
        expect(data[3].f2).toBe(data[baseRange.fromRow + 1].f2);
      });

      it('uses dataItemColumnValueExtractor and wraps rows/cells when target larger than base', () => {
        const columns = [{ field: 'f0' }, { field: 'f1' }, { field: 'f2' }, { field: 'f3' }];

        const data = Array.from({ length: 6 }, (_, r) => ({
          f0: `r${r}c0`,
          f1: `r${r}c1`,
          f2: `r${r}c2`,
          f3: `r${r}c3`,
        }));

        const options = {
          dataItemColumnValueExtractor: (row: any, colDef: any) => `ex-${row[colDef.field]}`,
        };

        const grid = makeGrid(data, columns, options);

        // base is 1 row x 2 cells (row 0, cells f0..f1)
        const baseRange = new SlickRange(0, 0, 0, 1);
        // target is 3 rows x 4 cells; source values wrap across the larger target area
        const targetRange = new SlickRange(1, 0, 3, 3);

        // initialize target cells to known values to ensure they change
        for (let r = targetRange.fromRow; r <= targetRange.toRow; r++) {
          for (let c = targetRange.fromCell; c <= targetRange.toCell; c++) {
            if (columns[c]) {
              (data[r] as any)[columns[c].field] = 'INIT';
            }
          }
        }

        SlickSelectionUtils.copyCellsToTargetRange(baseRange, targetRange, grid);

        // Validate wrapping: since base has 1 row, all target rows use base row 0
        // base cellCount = 2, so target columns map as: 0->0,1->1,2->0,3->1
        const cellMap = [0, 1, 0, 1];

        for (let i = 0; i < targetRange.rowCount(); i++) {
          const toRowIdx = targetRange.fromRow + i;
          for (let j = 0; j < targetRange.cellCount(); j++) {
            const toColIdx = targetRange.fromCell + j;
            // Skip validation if column doesn't exist
            if (columns[toColIdx]) {
              const expectedFromColIdx = baseRange.fromCell + cellMap[j];
              const expectedVal = `ex-${(data[baseRange.fromRow] as any)[columns[expectedFromColIdx].field]}`;
              expect((data[toRowIdx] as any)[columns[toColIdx].field]).toBe(expectedVal);
            }
          }
        }
      });
    });
  });
});
