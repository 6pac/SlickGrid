import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Draggable, MouseWheel, Resizable } from '../slick.interactions';

describe('Draggable class', () => {
  let containerElement: HTMLDivElement;
  let dg: any;

  beforeEach(() => {
    vi.resetAllMocks();
    containerElement = document.createElement('div');
  });

  afterEach(() => {
    containerElement?.remove();
    dg?.destroy();
  });

  it('should be able to instantiate the class', () => {
    dg = Draggable({ containerElement, allowDragFrom: 'div.slick-cell' });

    expect(dg).toBeTruthy();
  });

  it('should be able to instantiate the class even without a valid containerElement', () => {
    dg = Draggable({ allowDragFrom: 'div.slick-cell' });

    expect(dg).toBeTruthy();
  });

  it('should trigger mousedown but NOT expect a dragInit to happen since it was not triggered by an allowed element', () => {
    const dragInitSpy = vi.fn();

    dg = Draggable({ containerElement, allowDragFrom: 'div.slick-cell', onDrag: dragInitSpy });

    containerElement.dispatchEvent(new MouseEvent('mousedown'));

    expect(dg).toBeTruthy();
    expect(dragInitSpy).not.toHaveBeenCalled();
  });

  it('should trigger mousedown and expect a dragInit to happen since it was triggered by an allowed element but NOT expect a drag to actually happen since we did not move afterward', () => {
    const dragInitSpy = vi.fn();
    const dragSpy = vi.fn();
    containerElement.className = 'slick-cell';

    dg = Draggable({ containerElement, allowDragFrom: 'div.slick-cell', onDrag: dragSpy, onDragInit: dragInitSpy });

    containerElement.dispatchEvent(new MouseEvent('mousedown'));

    expect(dg).toBeTruthy();
    expect(dragInitSpy).toHaveBeenCalled();
    expect(dragSpy).not.toHaveBeenCalled();

    dg.destroy();
  });

  it('should NOT trigger dragInit event when user is pressing mousedown and mousemove + Ctrl key combo that we considered as forbidden via "preventDragFromKeys"', () => {
    const dragInitSpy = vi.fn();
    const dragSpy = vi.fn();
    containerElement.className = 'slick-cell';

    dg = Draggable({ containerElement, allowDragFrom: 'div.slick-cell', preventDragFromKeys: ['ctrlKey'], onDrag: dragSpy, onDragInit: dragInitSpy });

    containerElement.dispatchEvent(new MouseEvent('mousedown', { ctrlKey: true }));

    expect(dg).toBeTruthy();
    expect(dragInitSpy).not.toHaveBeenCalled();
    expect(dragSpy).not.toHaveBeenCalled();

    dg.destroy();
  });

  it('should ignore secondary-button mousedown events', () => {
    const dragInitSpy = vi.fn();
    const dragStartSpy = vi.fn();
    const dragSpy = vi.fn();
    const dragEndSpy = vi.fn();
    containerElement.className = 'slick-cell';

    dg = Draggable({
      containerElement,
      allowDragFrom: 'div.slick-cell',
      onDrag: dragSpy,
      onDragInit: dragInitSpy,
      onDragStart: dragStartSpy,
      onDragEnd: dragEndSpy,
    });

    const secondaryButtonEvent = new Event('mousedown');
    Object.defineProperty(secondaryButtonEvent, 'button', { value: 2 });
    containerElement.dispatchEvent(secondaryButtonEvent);

    expect(dragInitSpy).not.toHaveBeenCalled();
    expect(dragStartSpy).not.toHaveBeenCalled();
    expect(dragSpy).not.toHaveBeenCalled();
    expect(dragEndSpy).not.toHaveBeenCalled();
  });

  it('should trigger mousedown and expect a dragInit and a dragStart and drag to all happen since it was triggered by an allowed element and we did move afterward', () => {
    const removeBodyListenerSpy = vi.spyOn(document.body, 'removeEventListener');
    const removeWindowListenerSpy = vi.spyOn(window, 'removeEventListener');
    const dragInitSpy = vi.fn();
    const dragSpy = vi.fn();
    // the drag position object is mutated in place, so snapshot it at call time to assert X/Y pos
    let dragInitPos: any;
    let dragStartPos: any;
    let dragPos: any;
    let dragEndPos: any;
    const dragStartSpy = vi.fn((_e, dd) => (dragStartPos = { ...dd }));
    const dragEndSpy = vi.fn((_e, dd) => (dragEndPos = { ...dd }));
    dragInitSpy.mockImplementation((_e, dd) => (dragInitPos = { ...dd }));
    dragSpy.mockImplementation((_e, dd) => (dragPos = { ...dd }));
    containerElement.className = 'slick-cell';

    dg = Draggable({
      containerElement,
      allowDragFrom: 'div.slick-cell',
      dragFromClassDetectArr: [{ cssSelector: '.slick-cell', tag: '.slick-cell' }],
      onDrag: dragSpy,
      onDragInit: dragInitSpy,
      onDragStart: dragStartSpy,
      onDragEnd: dragEndSpy,
    });

    const mdEvt = new MouseEvent('mousedown');
    Object.defineProperty(mdEvt, 'clientX', { writable: true, configurable: true, value: 10 });
    Object.defineProperty(mdEvt, 'clientY', { writable: true, configurable: true, value: 10 });
    containerElement.dispatchEvent(mdEvt);

    const mmEvt = new MouseEvent('mousemove');
    const muEvt = new MouseEvent('mouseup');
    Object.defineProperty(mmEvt, 'clientX', { writable: true, configurable: true, value: 12 });
    Object.defineProperty(mmEvt, 'clientY', { writable: true, configurable: true, value: 10 });
    Object.defineProperty(muEvt, 'clientX', { writable: true, configurable: true, value: 12 });
    Object.defineProperty(muEvt, 'clientY', { writable: true, configurable: true, value: 10 });
    document.body.dispatchEvent(mmEvt);
    window.dispatchEvent(muEvt);

    expect(dg).toBeTruthy();
    expect(dragInitSpy).toHaveBeenCalledWith(mdEvt, expect.anything());
    expect(dragInitPos).toEqual({
      startX: 10,
      startY: 10,
      deltaX: 0,
      deltaY: 0,
      dragHandle: containerElement,
      dragSource: containerElement,
      matchClassTag: '.slick-cell',
      target: containerElement,
    });
    expect(dragStartSpy).toHaveBeenCalledWith(mmEvt, expect.anything());
    expect(dragStartPos).toEqual({
      startX: 10,
      startY: 10,
      deltaX: 2,
      deltaY: 0,
      dragHandle: containerElement,
      dragSource: containerElement,
      matchClassTag: '.slick-cell',
      target: document.body,
    });
    expect(dragPos).toEqual(dragStartPos);
    expect(dragEndPos).toEqual({ ...dragStartPos, target: expect.any(Window) });
    expect(removeBodyListenerSpy).toHaveBeenCalledTimes(2 * 2); // 2x events
    expect(removeWindowListenerSpy).toHaveBeenCalledTimes(3 * 2); // 3x events
  });

  it('should NOT trigger dragInit,dragStart events when user is pressing mousedown and mousemove + Meta key combo that we considered as forbidden via "preventDragFromKeys"', async () => {
    const bodyRemoveListenerSpy = vi.spyOn(document.body, 'removeEventListener');
    const dragInitSpy = vi.fn();
    const dragSpy = vi.fn();
    const dragStartSpy = vi.fn();
    const dragEndSpy = vi.fn();
    containerElement.className = 'slick-cell';

    dg = Draggable({
      containerElement,
      allowDragFrom: 'div.slick-cell',
      preventDragFromKeys: ['metaKey'],
      onDrag: dragSpy,
      onDragInit: dragInitSpy,
      onDragStart: dragStartSpy,
      onDragEnd: dragEndSpy,
    });

    const mdEvt = new MouseEvent('mousedown', { metaKey: true });
    Object.defineProperty(mdEvt, 'clientX', { writable: true, configurable: true, value: 10 });
    Object.defineProperty(mdEvt, 'clientY', { writable: true, configurable: true, value: 10 });
    containerElement.dispatchEvent(mdEvt);

    const mmEvt = new MouseEvent('mousemove', { metaKey: true });
    const muEvt = new MouseEvent('mouseup', { metaKey: true });
    Object.defineProperty(mmEvt, 'clientX', { writable: true, configurable: true, value: 12 });
    Object.defineProperty(mmEvt, 'clientY', { writable: true, configurable: true, value: 10 });
    Object.defineProperty(muEvt, 'clientX', { writable: true, configurable: true, value: 12 });
    Object.defineProperty(muEvt, 'clientY', { writable: true, configurable: true, value: 10 });
    document.body.dispatchEvent(mmEvt);
    window.dispatchEvent(muEvt);

    expect(dg).toBeTruthy();
    expect(dragInitSpy).not.toHaveBeenCalledWith(mdEvt, {
      startX: 10,
      startY: 10,
      deltaX: 2,
      deltaY: 0,
      dragHandle: containerElement,
      dragSource: containerElement,
      target: document.body,
    });
    expect(dragStartSpy).not.toHaveBeenCalled();
    expect(dragSpy).not.toHaveBeenCalled();
    expect(dragEndSpy).not.toHaveBeenCalled();
    expect(bodyRemoveListenerSpy).not.toHaveBeenCalled();
  });
});

describe('MouseWheel class', () => {
  let mw: any;

  afterEach(() => {
    mw?.destroy();
  });

  it('should be able to instantiate the class', () => {
    mw = MouseWheel({ element: document.createElement('div') });

    expect(mw).toBeTruthy();
  });

  it('should trigger mouse wheel event and expect onMouseWheel handler to be called old school way with regular mouse and WebKit browser event', () => {
    const wheelSpy = vi.fn();

    const element = document.createElement('div');
    mw = MouseWheel({ element, onMouseWheel: wheelSpy });

    const mdEvt = new Event('wheel');
    Object.defineProperty(mdEvt, 'wheelDelta', { writable: true, configurable: true, value: -120 });
    Object.defineProperty(mdEvt, 'wheelDeltaX', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(mdEvt, 'wheelDeltaY', { writable: true, configurable: true, value: -120 });
    element.dispatchEvent(mdEvt);

    expect(mw).toBeTruthy();
    expect(wheelSpy).toHaveBeenCalledWith(mdEvt, -1, -0, -1);
  });

  it('should trigger mouse wheel event and expect onMouseWheel handler to be called new school way with touchpad multidimensional scroll', () => {
    const wheelSpy = vi.fn();

    const element = document.createElement('div');
    mw = MouseWheel({ element, onMouseWheel: wheelSpy });

    const mdEvt = new Event('wheel');
    Object.defineProperty(mdEvt, 'detail', { writable: true, configurable: true, value: 3 });
    Object.defineProperty(mdEvt, 'wheelDeltaX', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(mdEvt, 'wheelDeltaY', { writable: true, configurable: true, value: -120 });
    element.dispatchEvent(mdEvt);

    expect(mw).toBeTruthy();
    expect(wheelSpy).toHaveBeenCalledWith(mdEvt, -1, -0, -1);
  });

  it('should trigger mouse wheel event and expect onMouseWheel handler to be called old school way with regular mouse and Gecko browser event', () => {
    const wheelSpy = vi.fn();

    const element = document.createElement('div');
    mw = MouseWheel({ element, onMouseWheel: wheelSpy });

    const mdEvt = new Event('wheel');
    Object.defineProperty(mdEvt, 'wheelDelta', { writable: true, configurable: true, value: -120 });
    Object.defineProperty(mdEvt, 'axis', { writable: true, configurable: true, value: 3 });
    Object.defineProperty(mdEvt, 'HORIZONTAL_AXIS', { writable: true, configurable: true, value: 3 });
    element.dispatchEvent(mdEvt);

    expect(mw).toBeTruthy();
    expect(wheelSpy).toHaveBeenCalledWith(mdEvt, -1, 1, 0);
  });
});

describe('Resizable class', () => {
  let rsz: any;
  let containerElement: HTMLDivElement;

  beforeEach(() => {
    containerElement = document.createElement('div');
    containerElement.className = 'slick-container';
  });

  afterEach(() => {
    rsz?.destroy();
  });

  it('should be able to instantiate the class', () => {
    rsz = Resizable({
      resizeableElement: document.createElement('div'),
      resizeableHandleElement: document.createElement('div'),
    });

    expect(rsz).toBeTruthy();
  });

  it('should throw when instantiating without a valid handle resizeable element', () => {
    expect(() => Resizable({} as any)).toThrow('[Slick.Resizable] You did not provide a valid html element that will be used for the handle to resize.');
  });

  it('should trigger resize callbacks on start, move and end interactions', () => {
    const resizeSpy = vi.fn();
    const resizeStartSpy = vi.fn();
    const resizeEndSpy = vi.fn();
    containerElement.className = 'slick-cell';

    rsz = Resizable({
      resizeableElement: containerElement,
      resizeableHandleElement: containerElement,
      onResize: resizeSpy,
      onResizeStart: resizeStartSpy,
      onResizeEnd: resizeEndSpy,
    });

    containerElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10 }));
    document.body.dispatchEvent(new MouseEvent('mousemove', { clientX: 12, clientY: 10 }));
    document.body.dispatchEvent(new MouseEvent('mouseup', { clientX: 12, clientY: 10 }));

    expect(rsz).toBeTruthy();
    expect(resizeStartSpy).toHaveBeenCalledTimes(1);
    expect(resizeSpy).toHaveBeenCalled();
    expect(resizeEndSpy).toHaveBeenCalled();
  });

  it('should handle mouse and touch resize with the appropriate default prevention', () => {
    const resizeSpy = vi.fn();
    const touch = { clientX: 10, clientY: 20 };
    const touchEvent = (type: string, touches = [touch]) => Object.assign(new Event(type), { touches, changedTouches: [touch] });

    rsz = Resizable({
      resizeableElement: containerElement,
      resizeableHandleElement: containerElement,
      onResize: resizeSpy,
    });

    containerElement.dispatchEvent(touchEvent('touchstart'));
    const touchMoveEvt = touchEvent('touchmove');
    const preventDefaultSpy = vi.spyOn(touchMoveEvt, 'preventDefault');
    document.body.dispatchEvent(touchMoveEvt);
    document.body.dispatchEvent(touchEvent('touchend', []));

    containerElement.dispatchEvent(new MouseEvent('mousedown'));
    const mouseMoveEvt = new MouseEvent('mousemove');
    const mousePreventDefaultSpy = vi.spyOn(mouseMoveEvt, 'preventDefault');
    document.body.dispatchEvent(mouseMoveEvt);
    document.body.dispatchEvent(new MouseEvent('mouseup'));

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(mousePreventDefaultSpy).toHaveBeenCalled();
    expect(resizeSpy).toHaveBeenCalledWith(touch, expect.any(Object));
  });
});
