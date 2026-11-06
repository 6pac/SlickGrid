import { afterEach, describe, expect, it, vi } from 'vitest';
import { reconcileColumnOrder, setupColumnReorderDrag, setupDropzonePillDrag } from '../slick.interactions';

describe('slickColumnReorderDrag', () => {
  const createHeaderColumn = (id: string, extraClass = '') => {
    const elm = document.createElement('div');
    elm.className = `slick-header-column ${extraClass}`.trim();
    elm.dataset.id = id;
    elm.textContent = id;
    return elm;
  };

  const createDragEvent = (type: string, props: Partial<Record<string, unknown>> = {}) => {
    const evt = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
    for (const [key, value] of Object.entries(props)) {
      Object.defineProperty(evt, key, { value, configurable: true, writable: true });
    }
    return evt;
  };

  const createMouseEvent = (type: string, props: Partial<Record<string, unknown>> = {}) => {
    const evt = new MouseEvent(type, { bubbles: true, cancelable: true });
    for (const [key, value] of Object.entries(props)) {
      Object.defineProperty(evt, key, { value, configurable: true, writable: true });
    }
    return evt;
  };

  const createTouchEvent = (type: string, props: Partial<Record<string, unknown>> = {}) => {
    const evt = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
    for (const [key, value] of Object.entries(props)) {
      Object.defineProperty(evt, key, { value, configurable: true, writable: true });
    }
    return evt;
  };

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.style.userSelect = '';
    vi.restoreAllMocks();
  });

  it('should reconcile movable columns while preserving hidden and fixed positions', () => {
    const columns = [{ id: 'first' }, { id: 'fixed', reorderable: false }, { id: 'hidden', hidden: true }, { id: 'last' }];

    expect(reconcileColumnOrder(columns, ['last', 'first'])).toEqual([columns[3], columns[1], columns[2], columns[0]]);
  });

  it('should keep the original order when the reordered ID list is incomplete', () => {
    const columns = [{ id: 'first' }, { id: 'last' }];

    expect(reconcileColumnOrder(columns, ['last'])).toEqual(columns);
  });

  it('should apply a reorder to its original header slots, including a subset of columns', () => {
    const columns = [
      { id: 1 },
      { id: 'center1' },
      { id: 'fixed', reorderable: false },
      { id: 2 },
      { id: 'hidden', hidden: true },
      { id: 'center2' },
      { id: 'right' },
    ];
    expect(reconcileColumnOrder(columns, ['center2', 'center1'], ['center1', 'center2'])).toEqual([
      columns[0],
      columns[5],
      columns[2],
      columns[3],
      columns[4],
      columns[1],
      columns[6],
    ]);
    expect(reconcileColumnOrder(columns, ['2', '1', 'center2', 'center1', 'right'], ['1', '2', 'center1', 'center2', 'right'])).toEqual([
      columns[3],
      columns[5],
      columns[2],
      columns[0],
      columns[4],
      columns[1],
      columns[6],
    ]);
    expect(reconcileColumnOrder(columns, ['center2', 'center1'], ['center1', 'missing'])).toEqual(columns);
    expect(reconcileColumnOrder(columns, ['center2', 'center1'], ['center1', 'center1'])).toEqual(columns);
    expect(reconcileColumnOrder(columns, ['center2', 'right'], ['center1', 'center2'])).toEqual(columns);
  });

  it.each([false, true])('should avoid reversing an unequal-width swap when the pointer moves back after scrolling (rtl=%s)', (rtl) => {
    const header = document.createElement('div');
    header.style.direction = rtl ? 'rtl' : 'ltr';
    document.body.appendChild(header);
    const narrow = createHeaderColumn('narrow');
    const wide = createHeaderColumn('wide');
    header.append(narrow, wide);
    // Measure the current order, as a browser does after a DOM swap or horizontal scroll.
    vi.spyOn(narrow, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(header.firstElementChild === narrow ? (rtl ? 200 : 0) : rtl ? 0 : 200, 0, 100, 20)
    );
    vi.spyOn(wide, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(header.firstElementChild === wide ? (rtl ? 100 : 0) : rtl ? 0 : 100, 0, 200, 20)
    );
    const onDragEnd = vi.fn();
    const instance = setupColumnReorderDrag({ headers: [header], container: header, viewportScrollContainerX: header, onDragEnd });
    narrow.dispatchEvent(createDragEvent('dragstart', { clientX: rtl ? 250 : 50, clientY: 10 }));
    wide.dispatchEvent(createDragEvent('dragover', { clientX: rtl ? 110 : 190, clientY: 10 }));
    expect([...header.children]).toEqual([narrow, wide]);
    wide.dispatchEvent(createDragEvent('dragover', { clientX: rtl ? 90 : 210, clientY: 10 }));
    expect([...header.children]).toEqual([wide, narrow]);
    // The pointer can move back over the wider target without undoing the swap.
    wide.dispatchEvent(createDragEvent('dragover', { clientX: rtl ? 110 : 190, clientY: 10 }));
    expect([...header.children]).toEqual([wide, narrow]);
    narrow.dispatchEvent(createDragEvent('dragend'));
    expect(onDragEnd).toHaveBeenCalledWith(['wide', 'narrow'], ['narrow', 'wide']);
    instance.destroy();
  });

  it.each(['native', 'touch'])('should reverse auto-scroll without reentering the viewport and ignore terminal native coordinates (%s)', (mode) => {
    vi.useFakeTimers();
    const header = document.createElement('div');
    const viewport = document.createElement('div');
    const column = createHeaderColumn('column');
    header.append(column);
    Object.defineProperty(header, 'clientWidth', { configurable: true, value: 300 });
    const instance = setupColumnReorderDrag({ headers: [header], container: header, viewportScrollContainerX: viewport, onDragEnd: vi.fn() });
    const descriptor = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => column) });
    const move = (x: number, y = 10) => {
      document.dispatchEvent(
        mode === 'native'
          ? createDragEvent('drag', { pageX: x, clientX: x, clientY: y })
          : createTouchEvent('touchmove', { touches: [{ pageX: x, clientX: x, clientY: y }] })
      );
    };
    try {
      column.dispatchEvent(
        mode === 'native' ? createDragEvent('dragstart') : createTouchEvent('touchstart', { touches: [{ clientX: 10, clientY: 10, pageX: 10 }] })
      );
      move(400);
      vi.advanceTimersByTime(30);
      expect(viewport.scrollLeft).toBe(10);
      move(400);
      vi.advanceTimersByTime(30);
      expect(viewport.scrollLeft).toBe(20);
      if (mode === 'native') {
        move(0, 0);
        vi.advanceTimersByTime(30);
        expect(viewport.scrollLeft).toBe(30);
      }
      const beforeReverse = viewport.scrollLeft;
      move(-20);
      vi.advanceTimersByTime(30);
      expect(viewport.scrollLeft).toBe(beforeReverse - 10);
      move(100);
      vi.advanceTimersByTime(60);
      expect(viewport.scrollLeft).toBe(beforeReverse - 10);
    } finally {
      instance.destroy();
      if (descriptor) {
        Object.defineProperty(document, 'elementFromPoint', descriptor);
      } else {
        Reflect.deleteProperty(document, 'elementFromPoint');
      }
      vi.useRealTimers();
    }
  });



  it.each(['native', 'touch'])('should reorder the center band and prevent pinned-band auto-scroll with %s dragging', (mode) => {
    vi.useFakeTimers();
    const elementFromPointDescriptor = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
    const container = document.createElement('div');
    const viewport = document.createElement('div');
    const headerLeft = document.createElement('div');
    const headerCenter = document.createElement('div');
    const headerRight = document.createElement('div');
    container.append(headerLeft, headerCenter, headerRight, viewport);
    document.body.appendChild(container);
    const left = createHeaderColumn('left');
    const first = createHeaderColumn('first');
    const last = createHeaderColumn('last');
    const right = createHeaderColumn('right');
    headerLeft.append(left);
    headerCenter.append(first, last);
    headerRight.append(right);
    const onDragEnd = vi.fn();
    const instance = setupColumnReorderDrag({
      container,
      viewportScrollContainerX: viewport,
      headers: [headerLeft, headerCenter, headerRight],
      canAutoScroll: (column) => headerCenter.contains(column),
      onDragEnd,
    });
    const start = (element: HTMLElement) => {
      if (mode === 'native') {
        element.dispatchEvent(createDragEvent('dragstart', { clientX: 10, clientY: 10 }));
      } else {
        element.dispatchEvent(createTouchEvent('touchstart', { touches: [{ clientX: 10, clientY: 10, pageX: 10 }] }));
      }
    };
    const move = (clientX: number, target: HTMLElement) => {
      if (mode === 'native') {
        document.dispatchEvent(createDragEvent('drag', { clientX, clientY: 10, pageX: clientX }));
      } else {
        Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => target) });
        document.dispatchEvent(createTouchEvent('touchmove', { touches: [{ clientX, clientY: 10, pageX: clientX }] }));
      }
    };
    const end = (element: HTMLElement) => {
      if (mode === 'native') {
        element.dispatchEvent(createDragEvent('dragend'));
      } else {
        document.dispatchEvent(createTouchEvent('touchend', { touches: [], changedTouches: [{ clientX: 1000, clientY: 10, pageX: 1000 }] }));
      }
    };

    try {
      for (const pinned of [left, right]) {
        start(pinned);
        move(1000, pinned);
        vi.advanceTimersByTime(30);
        expect(viewport.scrollLeft).toBe(0);
        end(pinned);
      }
      start(first);
      move(1000, last);
      vi.advanceTimersByTime(30);
      expect(viewport.scrollLeft).toBe(10);
      // A pinned target must never receive a column from the center band.
      headerRight.dispatchEvent(createDragEvent('dragover', { target: right, clientX: 1000 }));
      expect(first.parentElement).toBe(headerCenter);
      headerCenter.insertBefore(last, first);
      end(first);
      expect(onDragEnd).toHaveBeenLastCalledWith(['left', 'last', 'first', 'right'], ['left', 'first', 'last', 'right']);
      instance.destroy();
      expect([left, first, last, right].every((column) => !column.draggable)).toBe(true);
    } finally {
      instance.destroy();
      if (elementFromPointDescriptor) {
        Object.defineProperty(document, 'elementFromPoint', elementFromPointDescriptor);
      } else {
        Reflect.deleteProperty(document, 'elementFromPoint');
      }
      vi.useRealTimers();
    }
  });

  it('should initialize draggable headers and clear draggable flags on destroy', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const orderable = createHeaderColumn('firstName');
    const unorderable = createHeaderColumn('lastName', 'unorderable');
    headerLeft.append(orderable, unorderable);

    const instance = setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      unorderableColumnCssClass: 'unorderable',
      onDragEnd: vi.fn(),
    });

    expect(orderable.draggable).toBe(true);
    expect(unorderable.draggable).toBe(false);

    instance.destroy();

    expect(orderable.draggable).toBe(false);
    expect(unorderable.draggable).toBe(false);
  });

  it('should prevent dragstart when event target is not a header column', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const onDragEnd = vi.fn();

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    const dragStartEvt = createDragEvent('dragstart');
    const preventDefaultSpy = vi.spyOn(dragStartEvt, 'preventDefault');
    headerLeft.dispatchEvent(dragStartEvt);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should prevent native dragstart from header menu button target', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const headerMenuBtn = document.createElement('button');
    headerMenuBtn.className = 'slick-header-menu-button';
    firstName.append(headerMenuBtn);
    headerLeft.append(firstName);

    const onDragStart = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      dragStartFilter: '.slick-header-menu-button',
      onDragStart,
      onDragEnd: vi.fn(),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      target: headerMenuBtn,
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      clientX: 10,
      clientY: 10,
    });
    const preventDefaultSpy = vi.spyOn(dragStartEvt, 'preventDefault');
    firstName.dispatchEvent(dragStartEvt);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('should prevent native dragstart when dragStartFilter selector matches target', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const dragHandle = document.createElement('span');
    dragHandle.className = 'no-reorder-handle';
    firstName.append(dragHandle);
    headerLeft.append(firstName);

    const onDragStart = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      dragStartFilter: '.no-reorder-handle',
      onDragStart,
      onDragEnd: vi.fn(),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      target: dragHandle,
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      clientX: 10,
      clientY: 10,
    });
    const preventDefaultSpy = vi.spyOn(dragStartEvt, 'preventDefault');
    firstName.dispatchEvent(dragStartEvt);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('should prevent native dragstart when dragStartFilter function returns true', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const onDragStart = vi.fn();
    const dragStartFilter = vi.fn(() => true);
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      dragStartFilter,
      onDragStart,
      onDragEnd: vi.fn(),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      target: firstName,
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      clientX: 10,
      clientY: 10,
    });
    const preventDefaultSpy = vi.spyOn(dragStartEvt, 'preventDefault');
    firstName.dispatchEvent(dragStartEvt);

    expect(dragStartFilter).toHaveBeenCalledWith(firstName, dragStartEvt);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('should prevent default on dragover and skip when drag was never started', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const target = createHeaderColumn('age');
    headerLeft.append(target);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    const dragOverEvt = createDragEvent('dragover', { clientX: 120 });
    const preventDefaultSpy = vi.spyOn(dragOverEvt, 'preventDefault');
    target.dispatchEvent(dragOverEvt);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(headerLeft.firstElementChild).toBe(target);
  });

  it('should move dragged header before target when cursor is in target left half', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    const age = createHeaderColumn('age');
    headerLeft.append(firstName, lastName, age);

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      offsetX: 8,
      offsetY: 4,
    });
    firstName.dispatchEvent(dragStartEvt);

    vi.spyOn(lastName, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);

    const dragOverEvt = createDragEvent('dragover', { clientX: 110 }); // left side of lastName
    lastName.dispatchEvent(dragOverEvt);

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName', 'lastName', 'age']);

    const dragEndEvt = createDragEvent('dragend');
    firstName.dispatchEvent(dragEndEvt);
    expect(onDragEnd).toHaveBeenCalledWith(['firstName', 'lastName', 'age'], ['firstName', 'lastName', 'age']);
  });

  it('should ignore dragover when target is the same dragged header element', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      offsetX: 5,
      offsetY: 3,
    });
    firstName.dispatchEvent(dragStartEvt);

    const dragOverEvt = createDragEvent('dragover', { clientX: 10 });
    firstName.dispatchEvent(dragOverEvt);

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName', 'lastName']);
  });

  it('should move dragged header after target when cursor is in target right half', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    const age = createHeaderColumn('age');
    headerLeft.append(firstName, lastName, age);
    vi.spyOn(firstName, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 40, 20));

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      offsetX: 8,
      offsetY: 4,
    });
    firstName.dispatchEvent(dragStartEvt);

    vi.spyOn(lastName, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);

    const dragOverEvt = createDragEvent('dragover', { clientX: 139 }); // right side of lastName
    lastName.dispatchEvent(dragOverEvt);

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['lastName', 'firstName', 'age']);
  });

  it('should not move dragged header into a preheader-style container', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    const preHeaderGroup = createHeaderColumn('preHeaderGroup');
    const preHeaderContainer = document.createElement('div');
    preHeaderContainer.append(preHeaderGroup);
    headerLeft.append(firstName, lastName);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      offsetX: 8,
      offsetY: 4,
    });
    firstName.dispatchEvent(dragStartEvt);

    vi.spyOn(preHeaderGroup, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);

    const dragOverEvt = createDragEvent('dragover', { clientX: 110 });
    preHeaderGroup.dispatchEvent(dragOverEvt);

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName', 'lastName']);
    expect(preHeaderContainer.contains(firstName)).toBe(false);
  });

  it('should call setDragImage with rect-relative coords (Firefox/Linux ghost fix) on dragstart', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    const setDragImageSpy = vi.fn();
    // Simulate the column header at left=50, top=10 in the viewport
    vi.spyOn(firstName, 'getBoundingClientRect').mockReturnValue({
      left: 50,
      top: 10,
      right: 130,
      bottom: 30,
      width: 80,
      height: 20,
      x: 50,
      y: 10,
      toJSON: () => ({}),
    } as DOMRect);

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: setDragImageSpy },
      clientX: 60, // 10px inside the column header
      clientY: 15, // 5px inside the column header
    });
    firstName.dispatchEvent(dragStartEvt);

    // The ghost should be anchored at (clientX - rect.left, clientY - rect.top) = (10, 5)
    // NOT at e.offsetX / e.offsetY which would be relative to whichever child element was clicked
    expect(setDragImageSpy).toHaveBeenCalledWith(firstName, 10, 5);
  });

  it('should notify onDrop instead of onDragEnd when dropped onto a dropzone', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(dropzone);
    headerLeft.append(firstName);

    const onDragEnd = vi.fn();
    const onDrop = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
      onDrop,
    });

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => dropzone as Element),
    });

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      clientX: 10,
      clientY: 10,
    });
    firstName.dispatchEvent(dragStartEvt);

    const dragEndEvt = createDragEvent('dragend', { clientX: 20, clientY: 20 });
    firstName.dispatchEvent(dragEndEvt);

    expect(onDrop).toHaveBeenCalledWith(firstName, dragEndEvt, 'firstName');
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should reorder headers with Firefox/Linux mouse fallback and call onDragEnd', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);
    vi.spyOn(firstName, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 40, 20));

    vi.spyOn(lastName, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => lastName as Element),
    });

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 139, clientY: 10 }));
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 139, clientY: 10 }));

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['lastName', 'firstName']);
    expect(onDragEnd).toHaveBeenCalledWith(['lastName', 'firstName'], ['firstName', 'lastName']);

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should call onDrop on Firefox/Linux fallback mouseup when dropped over a dropzone', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(dropzone);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => dropzone as Element),
    });

    const onDragEnd = vi.fn();
    const onDrop = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
      onDrop,
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 20, clientY: 20 }));

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDragEnd).not.toHaveBeenCalled();

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should reorder headers and call onDragEnd with touch fallback', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);
    vi.spyOn(firstName, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 40, 20));

    vi.spyOn(lastName, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => lastName as Element),
    });

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    firstName.dispatchEvent(
      createTouchEvent('touchstart', {
        touches: [{ clientX: 10, clientY: 10, pageX: 10 }],
        changedTouches: [{ clientX: 10, clientY: 10, pageX: 10 }],
        target: firstName,
      })
    );
    document.dispatchEvent(
      createTouchEvent('touchmove', {
        touches: [{ clientX: 139, clientY: 10, pageX: 139 }],
        changedTouches: [{ clientX: 139, clientY: 10, pageX: 139 }],
      })
    );
    document.dispatchEvent(
      createTouchEvent('touchend', {
        touches: [],
        changedTouches: [{ clientX: 139, clientY: 10, pageX: 139 }],
      })
    );

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['lastName', 'firstName']);
    expect(onDragEnd).toHaveBeenCalledWith(['lastName', 'firstName'], ['firstName', 'lastName']);
  });

  it('should call onDrop on touch fallback when dropped over a dropzone', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(dropzone);
    headerLeft.append(firstName);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => dropzone as Element),
    });

    const onDragEnd = vi.fn();
    const onDrop = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
      onDrop,
    });

    firstName.dispatchEvent(
      createTouchEvent('touchstart', {
        touches: [{ clientX: 10, clientY: 10, pageX: 10 }],
        changedTouches: [{ clientX: 10, clientY: 10, pageX: 10 }],
        target: firstName,
      })
    );
    document.dispatchEvent(
      createTouchEvent('touchmove', {
        touches: [{ clientX: 20, clientY: 20, pageX: 20 }],
        changedTouches: [{ clientX: 20, clientY: 20, pageX: 20 }],
      })
    );
    document.dispatchEvent(
      createTouchEvent('touchend', {
        touches: [],
        changedTouches: [{ clientX: 20, clientY: 20, pageX: 20 }],
      })
    );

    expect(onDrop).toHaveBeenCalledWith(firstName, expect.any(Event), 'firstName');
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  // ── Deviation 1: frozen boundary stays uncrossable ────────────────────────

  it('should not allow dragging a column from headerLeft into headerRight (frozen boundary uncrossable)', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName'); // in left (frozen) pane
    const start = createHeaderColumn('start'); // in right pane
    headerLeft.append(firstName);
    headerRight.append(start);

    vi.spyOn(start, 'getBoundingClientRect').mockReturnValue({
      left: 200,
      width: 80,
      right: 280,
      top: 0,
      bottom: 20,
      x: 200,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);
    // elementFromPoint returns the right-pane column
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => start as Element),
    });

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      canAutoScroll: (column) => headerRight.contains(column),
      onDragEnd,
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );
    // dragover over the right-pane column — should NOT trigger a cross-boundary reorder
    headerRight.dispatchEvent(createDragEvent('dragover', { clientX: 240, clientY: 10, target: start }));

    // firstName must still be in headerLeft, start must still be in headerRight
    expect(headerLeft.children[0]).toBe(firstName);
    expect(headerRight.children[0]).toBe(start);

    firstName.dispatchEvent(createDragEvent('dragend', { clientX: 240, clientY: 10 }));
    // Same order (no cross-boundary reorder occurred) — onDragEnd receives all column IDs
    // from both headers; setColumns is a no-op at the grid level (same order).
    expect(onDragEnd).toHaveBeenCalledWith(['firstName', 'start'], ['firstName', 'start']);
  });

  it('should not allow dragging a column from headerRight into headerLeft (frozen boundary uncrossable)', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName'); // in left (frozen) pane
    const start = createHeaderColumn('start'); // in right pane
    headerLeft.append(firstName);
    headerRight.append(start);

    vi.spyOn(firstName, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 100,
      right: 100,
      top: 0,
      bottom: 20,
      x: 0,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => firstName as Element),
    });

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      canAutoScroll: (column) => headerRight.contains(column),
      onDragEnd,
    });

    start.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 240,
        clientY: 10,
      })
    );
    // dragover over the left-pane column — should NOT trigger a cross-boundary reorder
    headerLeft.dispatchEvent(createDragEvent('dragover', { clientX: 50, clientY: 10, target: firstName }));

    expect(headerLeft.children[0]).toBe(firstName);
    expect(headerRight.children[0]).toBe(start);

    start.dispatchEvent(createDragEvent('dragend', { clientX: 50, clientY: 10 }));
    expect(onDragEnd).toHaveBeenCalledWith(['firstName', 'start'], ['firstName', 'start']);
  });

  // ── Deviation 2: finalize on `drop` as well as `dragend` ─────────────────

  it('should finalize the reorder on drop (no subsequent dragend) and call onDragEnd', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);

    vi.spyOn(lastName, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 20,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => lastName as Element),
    });

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );
    // simulate live DOM reorder via dragover
    headerLeft.dispatchEvent(createDragEvent('dragover', { clientX: 139, clientY: 10, target: lastName }));

    // drop fires on the header (no dragend follows — e.g. @4tw/cypress-drag-drop behaviour)
    const dropEvt = createDragEvent('drop', { clientX: 139, clientY: 10 });
    headerLeft.dispatchEvent(dropEvt);

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledWith(expect.arrayContaining(['lastName', 'firstName']), ['firstName', 'lastName']);
  });

  it('should not double-finalize when both drop and dragend fire (real browser sequence)', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);

    vi.spyOn(lastName, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 20,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => lastName as Element),
    });

    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );
    headerLeft.dispatchEvent(createDragEvent('dragover', { clientX: 139, clientY: 10, target: lastName }));

    // real browser fires drop then dragend
    headerLeft.dispatchEvent(createDragEvent('drop', { clientX: 139, clientY: 10 }));
    firstName.dispatchEvent(createDragEvent('dragend', { clientX: 139, clientY: 10 }));

    // onDragEnd must be called exactly once despite both events firing
    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });







  it('should keep working when elementFromPoint throws in dragend and still call onDragEnd', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const onDragEnd = vi.fn();
    const instance = setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
    });

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => {
        throw new Error('boom');
      }),
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );
    firstName.dispatchEvent(createDragEvent('dragend', { clientX: 20, clientY: 20 }));

    expect(onDragEnd).toHaveBeenCalledWith(['firstName'], ['firstName']);

    instance.destroy();
  });

  it('should return early on dragover when pointer is over a dropzone and restore dragged header parent', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);
    const foreignParent = document.createElement('div');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(dropzone, foreignParent);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );

    foreignParent.append(firstName);

    const dropzoneOverEvent = createDragEvent('dragover', { clientX: 10, clientY: 10, target: dropzone });
    headerLeft.dispatchEvent(dropzoneOverEvent);

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName', 'lastName']);
  });

  it('should handle document-level dropzone enter/leave/hover listeners during an active drag', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    headerLeft.append(firstName, lastName);

    const foreignParent = document.createElement('div');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(dropzone, foreignParent);

    const onDrop = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
      onDrop,
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );

    // simulate dragged element being moved outside headers before document-level listeners fire
    foreignParent.append(firstName);

    const dragEnterEvt = createDragEvent('dragenter', { target: dropzone });
    document.dispatchEvent(dragEnterEvt);
    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName', 'lastName']);

    // dragleave should clear dropzone active state and avoid onDrop
    const dragLeaveEvt = createDragEvent('dragleave', { target: dropzone });
    document.dispatchEvent(dragLeaveEvt);

    firstName.dispatchEvent(createDragEvent('dragend', { clientX: 20, clientY: 20 }));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('should ignore another grid dropzone when a specific dropzone element is provided', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const ownGrid = document.createElement('div');
    ownGrid.className = 'grid-a';
    const ownDropzone = document.createElement('div');
    ownDropzone.className = 'slick-dropzone';
    ownGrid.append(ownDropzone);
    const otherDropzone = document.createElement('div');
    otherDropzone.className = 'slick-dropzone';
    document.body.append(ownGrid, otherDropzone);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => otherDropzone as Element),
    });

    const onDrop = vi.fn();
    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      dropzoneSelector: '.grid-a .slick-dropzone',
      onDrop,
      onDragEnd,
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );
    document.dispatchEvent(createDragEvent('dragenter', { target: otherDropzone }));
    firstName.dispatchEvent(createDragEvent('dragend', { clientX: 25, clientY: 25 }));

    expect(onDrop).not.toHaveBeenCalled();
    expect(onDragEnd).toHaveBeenCalledWith(['firstName'], ['firstName']);
  });

  it('should keep dropzone active on dragleave when relatedTarget is null but pointer is still over dropzone', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    const dropzoneChild = document.createElement('div');
    dropzone.append(dropzoneChild);
    document.body.append(dropzone);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => dropzoneChild as Element),
    });

    const onDrop = vi.fn();
    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd,
      onDrop,
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );

    // mark dropzone active first
    document.dispatchEvent(createDragEvent('dragenter', { target: dropzone }));

    // dragleave with null relatedTarget but elementFromPoint inside dropzone should keep it active
    const dragLeaveEvt = createDragEvent('dragleave', { target: dropzone, relatedTarget: null, clientX: 25, clientY: 25 });
    document.dispatchEvent(dragLeaveEvt);

    firstName.dispatchEvent(createDragEvent('dragend', { clientX: 25, clientY: 25 }));

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should return early on dragover when target parent is not a header container', () => {
    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    const lastName = createHeaderColumn('lastName');
    const preHeaderGroup = createHeaderColumn('preHeaderGroup');
    const preHeaderContainer = document.createElement('div');
    preHeaderContainer.append(preHeaderGroup);
    headerLeft.append(firstName, lastName);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    firstName.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
      })
    );

    // listener is on header containers, so dispatch from headerLeft with a foreign target
    headerLeft.dispatchEvent(createDragEvent('dragover', { target: preHeaderGroup, clientX: 110, clientY: 10 }));

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName', 'lastName']);
  });

  it('should return early in fallback mousemove when target header parent is not a header container', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const externalParent = document.createElement('div');
    const externalHeader = createHeaderColumn('externalHeader');
    externalParent.append(externalHeader);
    document.body.append(externalParent);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => externalHeader as Element),
    });

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 120, clientY: 10 }));

    expect(Array.from(headerLeft.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['firstName']);

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should toggle dropzone hover class during Firefox/Linux fallback mousemove', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const nonDropzoneElm = document.createElement('div');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    const dropzoneChild = document.createElement('div');
    dropzone.append(dropzoneChild);
    document.body.append(nonDropzoneElm, dropzone);

    const elementFromPointMock = vi.fn((x: number) => (x === 40 ? (dropzoneChild as Element) : (nonDropzoneElm as Element)));
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPointMock,
    });

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 40, clientY: 10 }));
    expect(dropzone.classList.contains('slick-dropzone-hover')).toBe(true);

    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 80, clientY: 10 }));
    expect(dropzone.classList.contains('slick-dropzone-hover')).toBe(false);

    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 80, clientY: 10 }));
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should detect dropzone from elementFromPoint on fallback mouseup when dropzone was not previously active', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const nonDropzoneElm = document.createElement('div');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(nonDropzoneElm, dropzone);

    const elementFromPointMock = vi.fn((x: number) => (x === 30 ? (dropzone as Element) : (nonDropzoneElm as Element)));
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPointMock,
    });

    const onDrop = vi.fn();
    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDrop,
      onDragEnd,
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 30, clientY: 20 }));

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDragEnd).not.toHaveBeenCalled();

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should keep fallback column drag uncommitted when mousemove stays below threshold', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const elementFromPointMock = vi.fn(() => firstName);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPointMock,
    });

    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragStart,
      onDragEnd,
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    const moveEvt = createMouseEvent('mousemove', { clientX: 12, clientY: 12, pageX: 12 });
    const preventDefaultSpy = vi.spyOn(moveEvt, 'preventDefault');
    document.dispatchEvent(moveEvt);
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 12, clientY: 12 }));

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(elementFromPointMock).toHaveBeenCalledTimes(1);
    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should set droppedOnDropzone during fallback mouseup from elementFromPoint detection path', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const nonDropzoneElm = document.createElement('div');
    const dropzone = document.createElement('div');
    dropzone.className = 'slick-dropzone';
    document.body.append(nonDropzoneElm, dropzone);

    let pointCallCount = 0;
    const elementFromPointMock = vi.fn(() => {
      pointCallCount += 1;
      return pointCallCount === 1 ? (nonDropzoneElm as Element) : (dropzone as Element);
    });
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPointMock,
    });

    const onDrop = vi.fn();
    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDrop,
      onDragEnd,
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    // 1st call to elementFromPoint from fallback mousemove => non-dropzone
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    // 2nd call from fallback mouseup => dropzone (hits droppedOnDropzone = true path)
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 30, clientY: 30 }));

    expect(elementFromPointMock).toHaveBeenCalledTimes(2);
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDragEnd).not.toHaveBeenCalled();

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should fallback to onDragEnd when elementFromPoint throws in fallback mouseup', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const elementFromPointMock = vi
      .fn()
      // fallback mousemove: return a non-dropzone element so drag can proceed
      .mockImplementationOnce(() => firstName)
      // fallback mouseup: throw and verify fallback path still calls onDragEnd
      .mockImplementation(() => {
        throw new Error('boom');
      });
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPointMock,
    });

    const onDrop = vi.fn();
    const onDragEnd = vi.fn();
    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDrop,
      onDragEnd,
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 20, clientY: 20 }));

    expect(onDrop).not.toHaveBeenCalled();
    expect(onDragEnd).toHaveBeenCalledWith(['firstName'], ['firstName']);
    expect(elementFromPointMock).toHaveBeenCalledTimes(2);

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should remove Firefox fallback mousedown listener on destroy', () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    const removeLeftSpy = vi.spyOn(headerLeft, 'removeEventListener');
    const removeRightSpy = vi.spyOn(headerRight, 'removeEventListener');

    const instance = setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    instance.destroy();

    expect(removeLeftSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
    expect(removeRightSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);

    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });







  it('should return early in dropzone fallback mousemove when target resolves to dragged pill', () => {
    const originalUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 Firefox/128.0 Linux x86_64',
    });

    const dropzoneElm = document.createElement('div');
    const firstPill = document.createElement('div');
    const secondPill = document.createElement('div');
    firstPill.className = 'slick-dropped-grouping';
    secondPill.className = 'slick-dropped-grouping';
    firstPill.dataset.id = 'age';
    secondPill.dataset.id = 'medals';
    dropzoneElm.append(firstPill, secondPill);
    document.body.append(dropzoneElm);

    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => firstPill as Element), // ensures target === draggedPill
    });

    const onPillDragEnd = vi.fn();
    const instance = setupDropzonePillDrag({
      dropzoneElm,
      onPillDragEnd,
    });

    firstPill.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstPill }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 20, clientY: 20 }));

    // Should stay unchanged because fallback mousemove returned early when target === draggedPill.
    expect(Array.from(dropzoneElm.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['age', 'medals']);

    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 20, clientY: 20 }));
    expect(onPillDragEnd).toHaveBeenCalledTimes(1);

    instance.destroy();
    Object.defineProperty(window.navigator, 'userAgent', { configurable: true, value: originalUserAgent });
  });

  it('should keep dropzone fallback drag uncommitted when mousemove stays below threshold', () => {
    const originalUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 Firefox/128.0 Linux x86_64',
    });

    const dropzoneElm = document.createElement('div');
    const firstPill = document.createElement('div');
    const secondPill = document.createElement('div');
    firstPill.className = 'slick-dropped-grouping';
    secondPill.className = 'slick-dropped-grouping';
    firstPill.dataset.id = 'age';
    secondPill.dataset.id = 'medals';
    dropzoneElm.append(firstPill, secondPill);
    document.body.append(dropzoneElm);

    const elementFromPointMock = vi.fn(() => secondPill as Element);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: elementFromPointMock,
    });

    const onPillDragEnd = vi.fn();
    const instance = setupDropzonePillDrag({
      dropzoneElm,
      onPillDragEnd,
    });

    firstPill.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstPill }));
    const moveEvt = createMouseEvent('mousemove', { clientX: 12, clientY: 12 });
    const preventDefaultSpy = vi.spyOn(moveEvt, 'preventDefault');
    document.dispatchEvent(moveEvt);
    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 12, clientY: 12 }));

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(elementFromPointMock).not.toHaveBeenCalled();
    expect(Array.from(dropzoneElm.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['age', 'medals']);
    expect(onPillDragEnd).toHaveBeenCalledTimes(1);

    instance.destroy();
    Object.defineProperty(window.navigator, 'userAgent', { configurable: true, value: originalUserAgent });
  });

  it('should forward native dropzone dragenter, dragleave, and drop callbacks when no pill is dragged', () => {
    const dropzoneElm = document.createElement('div');
    document.body.append(dropzoneElm);

    const onColumnDragEnter = vi.fn();
    const onColumnDragLeave = vi.fn();
    const onColumnDrop = vi.fn();
    setupDropzonePillDrag({
      dropzoneElm,
      onColumnDragEnter,
      onColumnDragLeave,
      onColumnDrop,
    });

    const dragEnterEvt = createDragEvent('dragenter');
    const dragEnterPreventDefaultSpy = vi.spyOn(dragEnterEvt, 'preventDefault');
    dropzoneElm.dispatchEvent(dragEnterEvt);
    expect(onColumnDragEnter).toHaveBeenCalledWith(dragEnterEvt);
    expect(dragEnterPreventDefaultSpy).toHaveBeenCalled();

    const dragLeaveEvt = createDragEvent('dragleave');
    dropzoneElm.dispatchEvent(dragLeaveEvt);
    expect(onColumnDragLeave).toHaveBeenCalledWith(dragLeaveEvt);

    const dropEvt = createDragEvent('drop', {
      dataTransfer: { getData: vi.fn(() => 'firstName') },
    });
    const dropPreventDefaultSpy = vi.spyOn(dropEvt, 'preventDefault');
    dropzoneElm.dispatchEvent(dropEvt);
    expect(dropPreventDefaultSpy).toHaveBeenCalled();
    expect(onColumnDrop).toHaveBeenCalledWith('firstName', dropEvt);
  });

  it('should reorder dropzone pills with native drag and remove dragging class on dragend', () => {
    const dropzoneElm = document.createElement('div');
    const firstPill = document.createElement('div');
    const secondPill = document.createElement('div');
    firstPill.className = 'slick-dropped-grouping';
    secondPill.className = 'slick-dropped-grouping';
    firstPill.dataset.id = 'age';
    secondPill.dataset.id = 'medals';
    dropzoneElm.append(firstPill, secondPill);
    document.body.append(dropzoneElm);

    vi.spyOn(secondPill, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);

    const onPillDragEnd = vi.fn();
    setupDropzonePillDrag({
      dropzoneElm,
      draggingCssClass: 'dragging',
      onPillDragEnd,
    });

    const dragStartEvt = createDragEvent('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
      clientX: 10,
      clientY: 10,
      target: firstPill,
    });
    firstPill.dispatchEvent(dragStartEvt);

    const dragOverEvt = createDragEvent('dragover', { clientX: 139, clientY: 10, target: secondPill });
    secondPill.dispatchEvent(dragOverEvt);

    expect(Array.from(dropzoneElm.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['medals', 'age']);

    const dragEndEvt = createDragEvent('dragend');
    firstPill.dispatchEvent(dragEndEvt);

    expect(firstPill.classList.contains('dragging')).toBe(false);
    expect(onPillDragEnd).toHaveBeenCalledWith(firstPill);
  });

  it('should call onPillDragEnd on native dragend even without draggingCssClass', () => {
    const dropzoneElm = document.createElement('div');
    const firstPill = document.createElement('div');
    firstPill.className = 'slick-dropped-grouping';
    firstPill.dataset.id = 'age';
    dropzoneElm.append(firstPill);
    document.body.append(dropzoneElm);

    const onPillDragEnd = vi.fn();
    setupDropzonePillDrag({
      dropzoneElm,
      onPillDragEnd,
    });

    firstPill.dispatchEvent(
      createDragEvent('dragstart', {
        dataTransfer: { effectAllowed: '', setData: vi.fn(), setDragImage: vi.fn() },
        clientX: 10,
        clientY: 10,
        target: firstPill,
      })
    );
    firstPill.dispatchEvent(createDragEvent('dragend'));

    expect(onPillDragEnd).toHaveBeenCalledWith(firstPill);
  });

  it('should reorder dropzone pills and clear dragging class on touch fallback', () => {
    const dropzoneElm = document.createElement('div');
    const firstPill = document.createElement('div');
    const secondPill = document.createElement('div');
    firstPill.className = 'slick-dropped-grouping';
    secondPill.className = 'slick-dropped-grouping';
    firstPill.dataset.id = 'age';
    secondPill.dataset.id = 'medals';
    dropzoneElm.append(firstPill, secondPill);
    document.body.append(dropzoneElm);

    vi.spyOn(secondPill, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 40,
      right: 140,
      top: 0,
      bottom: 0,
      x: 100,
      y: 0,
      height: 20,
      toJSON: () => ({}),
    } as DOMRect);
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => secondPill as Element),
    });

    const onPillDragEnd = vi.fn();
    setupDropzonePillDrag({
      dropzoneElm,
      draggingCssClass: 'dragging',
      onPillDragEnd,
    });

    firstPill.dispatchEvent(
      createTouchEvent('touchstart', {
        touches: [{ clientX: 10, clientY: 10, pageX: 10 }],
        changedTouches: [{ clientX: 10, clientY: 10, pageX: 10 }],
        target: firstPill,
      })
    );
    expect(firstPill.classList.contains('dragging')).toBe(true);

    document.dispatchEvent(
      createTouchEvent('touchmove', {
        touches: [{ clientX: 139, clientY: 10, pageX: 139 }],
        changedTouches: [{ clientX: 139, clientY: 10, pageX: 139 }],
      })
    );
    document.dispatchEvent(
      createTouchEvent('touchend', {
        touches: [],
        changedTouches: [{ clientX: 139, clientY: 10, pageX: 139 }],
      })
    );

    expect(Array.from(dropzoneElm.children).map((el) => (el as HTMLElement).dataset.id)).toEqual(['medals', 'age']);
    expect(firstPill.classList.contains('dragging')).toBe(false);
    expect(onPillDragEnd).toHaveBeenCalledWith(firstPill);
  });



  it('should start left auto-scroll when pointer moves past left viewport edge during fallback drag (line 331)', () => {
    // In jsdom: getOffset() returns {left:0}, container.clientWidth=0 → viewportLeft=0, containerRight=0.
    // pageX = -5 satisfies !columnScrollTimer && pageX < viewportLeft(0) → hits scrollColumnsLeft branch.
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => null) });
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval').mockReturnValue(99 as any);

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 0, clientY: 10, pageX: -5 }));

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30);

    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 0, clientY: 10 }));
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });

  it('should stop auto-scroll when pointer returns within viewport bounds during fallback drag (line 333)', () => {
    // First mousemove with pageX=5 > containerRight(0) starts the scroll timer.
    // Second mousemove with pageX=0 satisfies columnScrollTimer && pageX<=0 && pageX>=0 → stopAutoScroll.
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { userAgent: 'Mozilla/5.0 Firefox/128.0 Linux x86_64' },
    });

    const headerLeft = document.createElement('div');
    const headerRight = document.createElement('div');
    const viewport = document.createElement('div');
    const container = document.createElement('div');
    const firstName = createHeaderColumn('firstName');
    headerLeft.append(firstName);

    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: vi.fn(() => null) });
    vi.spyOn(globalThis, 'setInterval').mockReturnValue(99 as any);
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    setupColumnReorderDrag({
      headers: [headerLeft, headerRight],
      container,
      viewportScrollContainerX: viewport,
      onDragEnd: vi.fn(),
    });

    firstName.dispatchEvent(createMouseEvent('mousedown', { clientX: 10, clientY: 10, target: firstName }));
    // starts right-scroll timer (pageX > containerRight=0)
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 5, clientY: 10, pageX: 5 }));
    // stops timer (pageX=0, within [viewportLeft=0, containerRight=0])
    document.dispatchEvent(createMouseEvent('mousemove', { clientX: 0, clientY: 10, pageX: 0 }));

    expect(clearIntervalSpy).toHaveBeenCalledWith(99);

    document.dispatchEvent(createMouseEvent('mouseup', { clientX: 0, clientY: 10 }));
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: originalNavigator });
  });
});
