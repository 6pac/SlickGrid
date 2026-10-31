import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Column, GridOption } from '../../models';
import { SlickDataView } from '../../slick.dataview';
import { SlickEditorLock, SlickEvent, SlickEventData } from '../../slick.core';
import { SlickCustomTooltip } from '../slick.customtooltip';
import { SlickGrid } from '../../slick.grid';

vi.useFakeTimers();

const GRID_UID = 'slickgrid12345';

const gridOptionsMock = { enableAutoTooltip: true } as GridOption;

const dataviewStub = {
  getItem: vi.fn(),
} as unknown as SlickDataView;

const getEditorLockMock = {
  isActive: vi.fn(),
} as unknown as SlickEditorLock;

const gridStub = {
  getCellFromEvent: vi.fn(),
  getCellNode: vi.fn(),
  getColumns: vi.fn(),
  getContainerNode: vi.fn(),
  getData: () => dataviewStub,
  getEditorLock: () => getEditorLockMock,
  getOptions: () => gridOptionsMock,
  getUID: () => GRID_UID,
  registerPlugin: vi.fn(),
  sanitizeHtmlString: (text: string) => text,
  applyHtmlCode: (element: HTMLElement, html: string) => { element.innerHTML = html; },
  onMouseEnter: new SlickEvent(),
  onHeaderMouseEnter: new SlickEvent(),
  onHeaderMouseLeave: new SlickEvent(),
  onHeaderRowMouseEnter: new SlickEvent(),
  onHeaderMouseOver: new SlickEvent(),
  onHeaderRowMouseOver: new SlickEvent(),
  onHeaderRowMouseLeave: new SlickEvent(),
  onMouseLeave: new SlickEvent(),
  onHeaderMouseOut: new SlickEvent(),
  onHeaderRowMouseOut: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickCustomTooltip plugin', () => {
  const divContainer = document.createElement('div');
  let plugin: SlickCustomTooltip;

  beforeEach(() => {
    plugin = new SlickCustomTooltip();
    divContainer.className = `slickgrid-container ${GRID_UID}`;
    document.body.appendChild(divContainer);
  });

  afterEach(() => {
    plugin.destroy();
    delete gridOptionsMock.customTooltip;
    vi.clearAllMocks();
  });

  it('should create the plugin', () => {
    plugin.init(gridStub);
    expect(plugin).toBeTruthy();
  });

  it('should be able to change plugin options', () => {
    const mockOptions = {
      bodyClassName: 'tooltip-body',
      className: 'some-class',
      offsetLeft: 5,
      offsetRight: 7,
      offsetTopBottom: 8,
      regularTooltipWhiteSpace: 'pre-wrap',
      whiteSpace: 'normal',
      autoHideDelay: 3000,
      persistOnHover: true,
      observeAllTooltips: false,
      observeTooltipContainer: '.slickgrid-container',
    };
    plugin.init(gridStub);
    plugin.setOptions(mockOptions);

    expect(plugin.getOptions()).toEqual(expect.objectContaining(mockOptions));
  });

  it('should return without creating a tooltip when column definition has "disableTooltip: true" when "onMouseEnter" event is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    const mockColumns = [{ id: 'firstName', field: 'firstName', disableTooltip: true }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should return without creating a tooltip when column definition has "disableTooltip: true" when "onHeaderMouseOver" event is triggered', () => {
    const mockColumns = [{ id: 'firstName', field: 'firstName', disableTooltip: true }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    gridStub.onHeaderMouseOver.notify({ column: mockColumns[0], grid: gridStub });

    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should return without creating a tooltip when column definition has "disableTooltip: true" when "onHeaderRowMouseEnter" event is triggered', () => {
    const mockColumns = [{ id: 'firstName', field: 'firstName', disableTooltip: true }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    gridStub.onHeaderRowMouseEnter.notify({ column: mockColumns[0], grid: gridStub });

    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should return without creating a tooltip when column definition has "disableTooltip: true" when "onHeaderRowMouseOver" event is triggered', () => {
    const mockColumns = [{ id: 'firstName', field: 'firstName', disableTooltip: true }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    gridStub.onHeaderRowMouseOver.notify({ column: mockColumns[0], grid: gridStub });

    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should return without creating a tooltip when "usabilityOverride" returns False', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ usabilityOverride: () => false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should NOT create a tooltip when tooltip option has "useRegularTooltip" set BUT [title] attribute is not set or is empty', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', '');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should create a tooltip and the editor [title] attribute instead of the cell [title] when currently editing (editor lock)', () => {
    vi.spyOn(getEditorLockMock, 'isActive').mockReturnValue(true);
    const cellNode = document.createElement('div');
    const editInput = document.createElement('input');
    cellNode.className = 'slick-cell l2 r2';
    editInput.setAttribute('title', 'editing input tooltip text');
    cellNode.appendChild(editInput);
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('editing input tooltip text');
  });

  it('should set tooltip accessibility attributes and associate the tooltip with the trigger element via aria-describedby', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'accessible tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.id).toBeTruthy();
    expect(tooltipElm.getAttribute('role')).toBe('tooltip');
    expect(tooltipElm.getAttribute('aria-live')).toBe('polite');
    expect(tooltipElm.getAttribute('aria-atomic')).toBe('true');
    expect(cellNode.getAttribute('aria-describedby')).toBe(tooltipElm.id);
  });

  it('should restore previous aria-describedby on the trigger when tooltip is hidden', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'accessible tooltip text');
    cellNode.setAttribute('aria-describedby', 'previous-tooltip-id');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(cellNode.getAttribute('aria-describedby')).toBe(tooltipElm.id);

    plugin.hideTooltip();

    expect(cellNode.getAttribute('aria-describedby')).toBe('previous-tooltip-id');
    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should remove aria-describedby from the trigger when tooltip is hidden and no previous value existed', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'accessible tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(cellNode.getAttribute('aria-describedby')).toBe(tooltipElm.id);

    plugin.hideTooltip();

    expect(cellNode.hasAttribute('aria-describedby')).toBe(false);
    expect(document.body.querySelector('.slick-custom-tooltip')).toBeFalsy();
  });

  it('should create a tooltip from the editor [title] attribute and a formatter instead of the cell [title] when currently editing (editor lock) and a formatter is provided', () => {
    vi.spyOn(getEditorLockMock, 'isActive').mockReturnValue(true);
    const cellNode = document.createElement('div');
    const editInput = document.createElement('input');
    cellNode.className = 'slick-cell l2 r2';
    editInput.setAttribute('title', 'editing input tooltip text 20');
    cellNode.appendChild(editInput);
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: false, formatter: () => 'EDITING FORMATTER' });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('EDITING FORMATTER');
  });

  it('should create a tooltip, with default positioning (down & leftAlign), when tooltip option has "useRegularTooltip" enabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('tooltip text');
  });

  it('should create a tooltip align on the right, when position is set to "right-align"', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, position: 'right-align' });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('tooltip text');
  });

  it('should create a centered tooltip, when position is set to "center"', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, position: 'center' });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('tooltip text');
  });

  it('should create a tooltip with truncated text when tooltip option has "useRegularTooltip" enabled and the tooltip text is longer than that of "tooltipTextMaxLength"', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'some very extra long tooltip text sentence');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, tooltipTextMaxLength: 23 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('some very extra long...');
  });

  it('should create a tooltip as regular tooltip with coming from text content when it is filled & also expect "hideTooltip" to be called after leaving the cell when "onMouseLeave" event is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.textContent = 'some text content';
    cellNode.setAttribute('title', 'tooltip text');
    Object.defineProperty(cellNode, 'scrollWidth', { writable: true, configurable: true, value: 400 });
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });
    const hideColumnSpy = vi.spyOn(plugin, 'hideTooltip');

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, maxWidth: 85 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.classList.contains('slick-custom-tooltip')).toBe(true);
    expect(plugin.getOptions()).toBeTruthy();
    expect(tooltipElm.style.maxWidth).toBe('85px');
    expect(tooltipElm.textContent).toBe('some text content');

    gridStub.onMouseLeave.notify({ grid: gridStub } as any);
    expect(hideColumnSpy).toHaveBeenCalled();
  });

  it('should create a tooltip as regular tooltip with coming from text content when it is filled & also expect "hideTooltip" to be called after leaving the cell when "onHeaderRowMouseLeave" event is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.textContent = 'some text content';
    cellNode.setAttribute('title', 'tooltip text');
    Object.defineProperty(cellNode, 'scrollWidth', { writable: true, configurable: true, value: 400 });
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });
    const hideColumnSpy = vi.spyOn(plugin, 'hideTooltip');

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, maxWidth: 85 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.classList.contains('slick-custom-tooltip')).toBe(true);
    expect(plugin.getOptions()).toBeTruthy();
    expect(tooltipElm.style.maxWidth).toBe('85px');
    expect(tooltipElm.textContent).toBe('some text content');

    gridStub.onHeaderRowMouseLeave.notify({ grid: gridStub } as any);
    expect(hideColumnSpy).toHaveBeenCalled();
  });

  it('should create a tooltip as regular tooltip with truncated text when tooltip option has "useRegularTooltip" enabled and the tooltip text is longer than that of "tooltipTextMaxLength"', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.textContent = 'some very extra long tooltip text sentence';
    cellNode.setAttribute('title', 'tooltip text');
    Object.defineProperty(cellNode, 'scrollWidth', { writable: true, configurable: true, value: 400 });
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, tooltipTextMaxLength: 23 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('some very extra long...');
  });

  it('should create a tooltip with only the tooltip pulled from the cell text when enabling option "useRegularTooltip" & "useRegularTooltipFromCellTextOnly" and column definition has a regular formatter with a "title" attribute filled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName', formatter: () => `<span title="formatter tooltip text">Hello World</span>` }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, useRegularTooltipFromCellTextOnly: true, maxHeight: 100 });

    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('tooltip text');
    expect(tooltipElm.style.maxHeight).toBe('100px');
  });

  it('should create a tooltip aligned left from a cell with multiple span and title attributes', () => {
    const cellNode = document.createElement('div');
    const icon1Elm = document.createElement('span');
    const icon2Elm = document.createElement('span');
    cellNode.className = 'slick-cell l2 r2';
    icon1Elm.className = 'mdi mdi-check';
    icon1Elm.title = 'Click here when successful';
    icon2Elm.className = 'mdi mdi-cancel';
    icon2Elm.title = 'Click here to cancel the action';
    cellNode.appendChild(icon1Elm);
    cellNode.appendChild(icon2Elm);

    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, maxHeight: 100 });

    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: icon2Elm } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('Click here to cancel the action');
    expect(tooltipElm.style.maxHeight).toBe('100px');
  });

  it('should create a tooltip aligned right from a cell with multiple span and title attributes', () => {
    const cellNode = document.createElement('div');
    const icon1Elm = document.createElement('span');
    const icon2Elm = document.createElement('span');
    cellNode.className = 'slick-cell l2 r2';
    icon1Elm.className = 'mdi mdi-check';
    icon1Elm.title = 'Click here when successful';
    icon2Elm.className = 'mdi mdi-cancel';
    icon2Elm.title = 'Click here to cancel the action';
    cellNode.appendChild(icon1Elm);
    cellNode.appendChild(icon2Elm);

    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, maxHeight: 100 });

    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: icon2Elm } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('Click here to cancel the action');
    expect(tooltipElm.style.maxHeight).toBe('100px');
  });

  it('should NOT create a tooltip from a cell with multiple span and title attributes but it is actually hidden', () => {
    const cellNode = document.createElement('div');
    const icon1Elm = document.createElement('span');
    const icon2Elm = document.createElement('span');
    cellNode.className = 'slick-cell l2 r2';
    icon1Elm.className = 'mdi mdi-check';
    icon1Elm.title = 'Click here when successful';
    icon2Elm.className = 'mdi mdi-cancel';
    icon2Elm.title = 'Click here to cancel the action';
    icon2Elm.style.display = 'none';
    cellNode.appendChild(icon1Elm);
    cellNode.appendChild(icon2Elm);

    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, maxHeight: 100 });

    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeFalsy();
  });

  it('should create a tooltip with only the tooltip formatter output when tooltip option has "useRegularTooltip" & "useRegularTooltipFromFormatterOnly" enabled and column definition has a regular formatter with a "title" attribute filled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName', formatter: () => `<span title="formatter tooltip text">Hello World</span>` }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, useRegularTooltipFromFormatterOnly: true, maxHeight: 100 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('formatter tooltip text');
    expect(tooltipElm.style.maxHeight).toBe('100px');
  });

  it('should throw an error when trying to create an async tooltip without "asyncPostFormatter" defined', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({
      offsetLeft: 5,
      position: 'bottom',
      asyncProcess: () => Promise.resolve({ ratio: 1.2 }),
      formatter: () => 'loading...',
      asyncPostFormatter: undefined,
    });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    expect(consoleSpy).toHaveBeenCalledWith(
      `[SlickGrid] when using "asyncProcess", you must also provide an "asyncPostFormatter" formatter`
    );
  });

  it('should create a Promise async tooltip with position (up & right align) when space is not available on the right of the tooltip', async () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({
      offsetLeft: 5,
      position: 'left-align',
      formatter: () => 'loading...',
      asyncProcess: () => Promise.resolve({ ratio: 1.2 }),
      asyncPostFormatter: (row, cell, val, column, dataContext) => `async post text with ratio: ${dataContext.__params.ratio || ''}`,
    });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    let tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    vi.spyOn(tooltipElm, 'getBoundingClientRect').mockReturnValue({ top: 22, left: 11, height: 100, width: 250 } as any);
    tooltipElm.style.top = '22px';
    tooltipElm.style.left = '11px';
    tooltipElm.style.height = '100px';
    tooltipElm.style.width = '250px';

    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('loading...');

    await vi.runAllTimersAsync();

    tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm.textContent).toBe('async post text with ratio: 1.2');
  });

  it('should render the async post formatter output when the formatter returns html', async () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({
      useRegularTooltip: true,
      useRegularTooltipFromFormatterOnly: true,
      formatter: () => 'loading...',
      asyncProcess: () => Promise.resolve({ ratio: 1.2 }),
      asyncPostFormatter: (row, cell, val, column, dataContext) =>
        `<span title="tooltip title text with ratio: ${dataContext.__params.ratio || ''}">cell value</span>`,
    });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    let tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;

    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('loading...');

    await vi.runAllTimersAsync();

    tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm.textContent).toBe('cell value');
  });

  it('should create a Promise async tooltip and throw an error when the Promise is not completing (rejected)', () =>
    new Promise((done: any) => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

      plugin.init(gridStub);
      plugin.setOptions({
        asyncProcess: () => Promise.reject('promise error'),
        formatter: () => 'loading...',
        asyncPostFormatter: (row, cell, val, column, dataContext) => `async post text with ratio: ${dataContext.__params.ratio || ''}`,
      });
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);
      const cancellablePromise = (plugin as any)._cancellablePromise;
      let tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('loading...');

      cancellablePromise!.promise.catch((e: any) => {
        tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
        expect(tooltipElm.textContent).toBe('loading...');
        expect(e.toString()).toBe('promise error');
        done();
      });
    }));

  it('should create a tooltip on the header column when "useRegularTooltip" enabled and "onHeaderMouseOver" is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName', name: `<span title="name title tooltip">First Name</span>` }] as Column[];
    const mockFormatter = vi.fn();
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, headerFormatter: mockFormatter });
    const eventData = new SlickEventData();
    const div = document.createElement('div');
    div.className = 'toggle';
    Object.defineProperty(eventData, 'target', { writable: true, value: div });
    gridStub.onHeaderMouseOver.notify({ column: mockColumns[0], grid: gridStub }, eventData);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('name title tooltip');
  });

  it('should create a tooltip on the header column when "useRegularTooltip" enabled and "onHeaderMouseOver" is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ headerFormatter: () => 'header tooltip text' });
    const eventData = new SlickEventData();
    const divHeaders = document.createElement('div');
    divHeaders.className = 'slick-header-columns';
    const divHeaderColumn = document.createElement('div');
    divHeaderColumn.className = 'slick-header-column';
    divHeaders.appendChild(divHeaderColumn);
    divHeaders.className = 'toggle';
    Object.defineProperty(eventData, 'target', { writable: true, value: divHeaderColumn });
    gridStub.onHeaderMouseOver.notify({ column: mockColumns[0], grid: gridStub }, eventData);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('header tooltip text');
  });

  it('should create a tooltip on the header column when "useRegularTooltip" enabled and "onHeaderRowMouseEnter" is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ headerRowFormatter: () => 'header row tooltip text' });
    const eventData = new SlickEventData();
    const divHeaders = document.createElement('div');
    divHeaders.className = 'slick-header-columns';
    const divHeaderColumn = document.createElement('div');
    divHeaderColumn.className = 'slick-headerrow-column';
    divHeaders.appendChild(divHeaderColumn);
    divHeaders.className = 'toggle';
    Object.defineProperty(eventData, 'target', { writable: true, value: divHeaderColumn });
    gridStub.onHeaderRowMouseEnter.notify({ column: mockColumns[0], grid: gridStub }, eventData);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('header row tooltip text');
  });

  it('should create a tooltip on the header column when "useRegularTooltip" enabled and "onHeaderRowMouseOver" is triggered', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName', name: 'First Name' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ headerRowFormatter: () => 'header row tooltip text' });
    const eventData = new SlickEventData();
    const divHeaders = document.createElement('div');
    divHeaders.className = 'slick-header-columns';
    const divHeaderColumn = document.createElement('div');
    divHeaderColumn.className = 'slick-headerrow-column';
    divHeaders.appendChild(divHeaderColumn);
    divHeaders.className = 'toggle';
    Object.defineProperty(eventData, 'target', { writable: true, value: divHeaderColumn });
    gridStub.onHeaderRowMouseOver.notify({ column: mockColumns[0], grid: gridStub }, eventData);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('header row tooltip text');
  });

  it('should keep tooltip open when mouse hovers over it with persistOnHover disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();
    expect(tooltipElm.textContent).toBe('tooltip text');

    const mouseEnterEvent = new Event('mouseenter');
    tooltipElm.dispatchEvent(mouseEnterEvent);
    gridStub.onMouseLeave.notify({ grid: gridStub } as any);

    // Fake time passed to check that tooltip is still open
    vi.advanceTimersByTime(2000);
    const tooltipStillVisible = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipStillVisible).toBeTruthy();
  });

  it('should hide tooltip after mouse leaves both cell and tooltip with persistOnHover disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    const mouseLeaveEvent = new Event('mouseleave');
    tooltipElm.dispatchEvent(mouseLeaveEvent);

    const tooltipAfterLeave = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipAfterLeave).toBeFalsy();
  });

  it('should auto-hide tooltip after autoHideDelay when persistOnHover is disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false, autoHideDelay: 3000 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    const mouseEnterEvent = new Event('mouseenter');
    tooltipElm.dispatchEvent(mouseEnterEvent);

    // Advance time to just before auto-hide
    vi.advanceTimersByTime(2999);
    let tooltipStillVisible = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipStillVisible).toBeTruthy();

    // Advance time past auto-hide delay
    vi.advanceTimersByTime(1);
    const tooltipAfterAutoHide = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipAfterAutoHide).toBeFalsy();
  });

  it('should clear previous auto-hide timeout when showing new tooltip', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: false, persistOnHover: false, autoHideDelay: 3000, formatter: () => 'test tooltip' });

    // Set internal state to simulate existing timeout
    (plugin as any)._cellNodeElm = cellNode;
    (plugin as any)._cellTooltipOptions = plugin.getOptions();
    (plugin as any)._autoHideTimeout = setTimeout(() => {}, 5000);
    const oldTimeout = (plugin as any)._autoHideTimeout;

    // Call renderTooltipFormatter directly - this should trigger bindPersistOnHoverEvents
    // which should clear the previous _autoHideTimeout
    (plugin as any).renderTooltipFormatter(() => 'test tooltip', { row: 0, cell: 0 }, 'value', mockColumns[0], { firstName: 'John', lastName: 'Doe' });

    // Verify the old timeout was different from the new one
    const newTimeout = (plugin as any)._autoHideTimeout;
    expect(oldTimeout).not.toBe(newTimeout);
    expect(newTimeout).toBeTruthy();
  });

  it('should hide tooltip immediately when persistOnHover is enabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: true });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    gridStub.onMouseLeave.notify({ grid: gridStub } as any);

    const tooltipAfterLeave = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipAfterLeave).toBeFalsy();
  });

  it('should cancel hide timeout when mouse re-enters tooltip with persistOnHover disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    gridStub.onMouseLeave.notify({ grid: gridStub } as any);

    // simulate quick cell re-entry before hide timeout completes (flickering mouse movements)
    vi.advanceTimersByTime(50);
    const mouseEnterEvent = new Event('mouseenter');
    tooltipElm.dispatchEvent(mouseEnterEvent);

    // Advance past original timeout
    vi.advanceTimersByTime(100);

    const tooltipStillVisible = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipStillVisible).toBeTruthy();
  });

  it('should clear hide timeout when disposing plugin with persistOnHover disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    gridStub.onMouseLeave.notify({ grid: gridStub } as any);

    // Dispose plugin while timeout is active
    plugin.destroy();

    vi.advanceTimersByTime(200);
    const tooltipAfterDispose = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipAfterDispose).toBeFalsy();
  });

  it('should clear auto-hide timeout when disposing plugin with persistOnHover disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false, autoHideDelay: 3000 });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    // Simulate mouse entering tooltip to trigger auto-hide timeout
    const mouseEnterEvent = new Event('mouseenter');
    tooltipElm.dispatchEvent(mouseEnterEvent);

    // Dispose plugin while auto-hide timeout is active
    plugin.destroy();

    vi.advanceTimersByTime(3000);
    const tooltipAfterDispose = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipAfterDispose).toBeFalsy();
  });

  it('should clear existing hide timeout when mouse leaves cell again with persistOnHover disabled', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    // The first leave starts the 100ms timeout
    gridStub.onMouseLeave.notify({ grid: gridStub } as any);
    vi.advanceTimersByTime(50);

    // 2nd leave before first timeout completes and thus resets the timeout
    gridStub.onMouseLeave.notify({ grid: gridStub } as any);

    vi.advanceTimersByTime(50);

    // Tooltip should still stick around as the 2nd timeout is pending
    let tooltipStillVisible = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipStillVisible).toBeTruthy();

    vi.advanceTimersByTime(50);
    const tooltipAfterSecondTimeout = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipAfterSecondTimeout).toBeFalsy();
  });

  it('should dispose any dangling timeouts when plugin is disposed', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    (plugin as any)._hideTooltipTimeout = 123 as any; // simulate existing timeout
    (plugin as any)._autoHideTimeout = 456 as any; // simulate existing timeout

    plugin.destroy();

    expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(456);
    clearTimeoutSpy.mockClear();

    plugin.setOptions({ useRegularTooltip: true, persistOnHover: true });
    plugin.destroy();

    expect(clearTimeoutSpy).not.toHaveBeenCalledWith(123);
    expect(clearTimeoutSpy).not.toHaveBeenCalledWith(456);
  });

  it('should not hide tooltip when mouse is over tooltip after timeout expires', () => {
    const cellNode = document.createElement('div');
    cellNode.className = 'slick-cell l2 r2';
    cellNode.setAttribute('title', 'tooltip text');
    const mockColumns = [{ id: 'firstName', field: 'firstName' }] as Column[];
    vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
    vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
    vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ firstName: 'John', lastName: 'Doe' });

    plugin.init(gridStub);
    plugin.setOptions({ useRegularTooltip: true, persistOnHover: false });
    gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

    const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipElm).toBeTruthy();

    const mouseEnterEvent = new Event('mouseenter');
    tooltipElm.dispatchEvent(mouseEnterEvent);

    gridStub.onMouseLeave.notify({ grid: gridStub } as any);

    vi.advanceTimersByTime(100);

    const tooltipStillVisible = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
    expect(tooltipStillVisible).toBeTruthy();
  });

  describe('observeAllTooltips feature', () => {
    let mockGridContainer: HTMLDivElement;
    let mockGridContainer2: HTMLDivElement;

    beforeEach(() => {
      mockGridContainer = document.createElement('div');
      mockGridContainer2 = document.createElement('div');
      mockGridContainer.className = 'grid-container';
      mockGridContainer2.className = 'grid-container2';
      document.body.appendChild(mockGridContainer);
      document.body.appendChild(mockGridContainer2);
      vi.spyOn(gridStub, 'getContainerNode').mockReturnValue(mockGridContainer);
    });

    afterEach(() => {
      mockGridContainer.remove();
    });

    it('should NOT create global listeners when observeAllTooltips is false (default)', () => {
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button tooltip';
      document.body.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip');
      expect(tooltipElm).toBeFalsy();

      button.remove();
    });

    it('should create global listeners on document.body when observeAllTooltips is true with scope=document', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button tooltip';
      document.body.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Button tooltip');

      button.remove();
    });

    it('should create global listeners on grid container when observeAllTooltips is true with scope=grid-container', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: '.grid-container' };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button in container';
      mockGridContainer.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Button in container');

      button.remove();
    });

    it('should create global listeners on grid container when observeAllTooltips is true with 2 scopes "grid-container,grid-container2"', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: '.grid-container, .grid-container2' };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button in container';
      mockGridContainer.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Button in container');
      button.remove();

      const button2 = document.createElement('button');
      button2.title = 'Button in container 2';
      mockGridContainer2.appendChild(button2);

      const mouseoverEvent2 = new MouseEvent('mouseover', { bubbles: true });
      button2.dispatchEvent(mouseoverEvent2);

      const tooltipElm2 = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm2).toBeTruthy();
      expect(tooltipElm2.textContent).toBe('Button in container 2');

      button2.remove();
    });

    it('should show tooltip for element with data-slick-tooltip attribute', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const div = document.createElement('div');
      div.setAttribute('data-slick-tooltip', 'Custom tooltip text');
      document.body.appendChild(div);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      div.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Custom tooltip text');

      div.remove();
    });

    it('should hide tooltip when mouse leaves the element', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button tooltip';
      document.body.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      let tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();

      const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body });
      Object.defineProperty(mouseoutEvent, 'target', { value: button, enumerable: true });
      button.dispatchEvent(mouseoutEvent);

      tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeFalsy();

      button.remove();
    });

    it('should NOT show tooltip on grid elements when observeAllTooltips is enabled (to avoid duplicates)', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell';
      cellNode.title = 'Cell tooltip';
      document.body.appendChild(cellNode);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      cellNode.dispatchEvent(mouseoverEvent);

      // Should NOT create tooltip via global handler (grid events handle this)
      const tooltipElm = document.body.querySelector('.slick-custom-tooltip');
      expect(tooltipElm).toBeFalsy();

      cellNode.remove();
    });

    it('should hide existing tooltip when moving to element without title attribute', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button tooltip';
      document.body.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      let tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();

      const div = document.createElement('div');
      document.body.appendChild(div);

      const mouseoverDiv = new MouseEvent('mouseover', { bubbles: true });
      div.dispatchEvent(mouseoverDiv);

      tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeFalsy();

      button.remove();
      div.remove();
    });

    it('should NOT hide tooltip when moving to tooltip element itself (persistOnHover)', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body', persistOnHover: false };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button tooltip';
      document.body.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();

      const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true, relatedTarget: tooltipElm });
      Object.defineProperty(mouseoutEvent, 'target', { value: button, enumerable: true });
      button.dispatchEvent(mouseoutEvent);

      const tooltipStillVisible = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipStillVisible).toBeTruthy();

      button.remove();
    });

    it('should properly clean up global listeners on dispose', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const button = document.createElement('button');
      button.title = 'Button tooltip';
      document.body.appendChild(button);

      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      button.dispatchEvent(mouseoverEvent);

      let tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();

      plugin.destroy();

      // After dispose, new mouseover should not create tooltip
      button.dispatchEvent(mouseoverEvent);
      tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeFalsy();

      button.remove();
    });

    // Nested tooltip tests
    it('should show icon tooltip instead of button tooltip when hovering icon inside button', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      const button = document.createElement('button');
      button.title = 'Button tooltip';
      const icon = document.createElement('span');
      icon.title = 'Icon tooltip';
      button.appendChild(icon);
      cellNode.appendChild(button);

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button title="Button tooltip"><span title="Icon tooltip"></span></button>',
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true });

      // Hover over the icon
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: icon } as any);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Icon tooltip');
    });

    it('should show button tooltip when hovering button with nested icon', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      const button = document.createElement('button');
      button.title = 'Button tooltip';
      const icon = document.createElement('span');
      icon.title = 'Icon tooltip';
      button.appendChild(icon);
      cellNode.appendChild(button);

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button title="Button tooltip"><span title="Icon tooltip"></span></button>',
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true });

      // Hover over the button
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: button } as any);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Button tooltip');
    });

    it('should prioritize formatter tooltip over cell tooltip when useRegularTooltipFromFormatterOnly is enabled with nested elements', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      cellNode.setAttribute('title', 'Cell tooltip');
      const button = document.createElement('button');
      button.title = 'Button tooltip from formatter';
      const icon = document.createElement('span');
      icon.title = 'Icon tooltip from formatter';
      button.appendChild(icon);
      cellNode.appendChild(button);

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button title="Button tooltip from formatter"><span title="Icon tooltip from formatter"></span></button>',
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true, useRegularTooltipFromFormatterOnly: true });

      // Hover over the button - should show formatter tooltip, not cell tooltip
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: button } as any);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Button tooltip from formatter');
    });

    it('should not fallback to cell tooltip when useRegularTooltipFromFormatterOnly is enabled but formatter has no tooltip element', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      cellNode.setAttribute('title', 'Cell tooltip fallback');

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button>No tooltip</button>', // formatter output has no title attribute
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true, useRegularTooltipFromFormatterOnly: true });

      // Hover over the cell - should fallback to cell tooltip since formatter has no tooltip
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeFalsy();
    });

    it('should return null and not show tooltip when useRegularTooltipFromFormatterOnly is enabled but neither formatter nor cell has tooltip', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      // No title attribute on cell node

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button>No tooltip</button>', // formatter output has no title attribute
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true, useRegularTooltipFromFormatterOnly: true });

      // Hover over the cell - should not show tooltip since neither formatter nor cell has tooltip
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeFalsy();
    });

    it('should clear the selected title attribute when using a tooltip formatter', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      const button = document.createElement('button');
      button.title = 'Button tooltip';
      const icon = document.createElement('span');
      icon.title = 'Icon tooltip';
      button.appendChild(icon);
      cellNode.appendChild(button);

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button title="Button tooltip"><span title="Icon tooltip"></span></button>',
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({
        useRegularTooltip: false,
        formatter: () => 'Custom tooltip',
      });

      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

      expect(button.getAttribute('title')).toBe('');
      expect(icon.getAttribute('title')).toBe('Icon tooltip');
    });

    it('should clear both cell and child element title attributes when both have titles', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      cellNode.setAttribute('title', 'Cell tooltip');
      const childButton = document.createElement('button');
      childButton.title = 'Button tooltip';
      cellNode.appendChild(childButton);

      const mockColumns = [
        {
          id: 'action',
          field: 'action',
          formatter: () => '<button title="Button tooltip">Click me</button>',
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ action: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true });

      // Hover over the cell node so that when searching for title elements,
      // cellNode will have title and childButton will also have title
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

      // The cell title is selected first; nested titles remain available.
      expect(cellNode.getAttribute('title')).toBe('');
      expect(childButton.getAttribute('title')).toBe('Button tooltip');
    });

    it('should handle global tooltip observation with nested elements', () => {
      gridOptionsMock.customTooltip = { observeAllTooltips: true, observeTooltipContainer: 'body' };
      plugin.init(gridStub);

      const htmlContainer = document.createElement('div');
      const button = document.createElement('button');
      button.title = 'Button tooltip';
      const icon = document.createElement('span');
      icon.title = 'Icon tooltip';
      button.appendChild(icon);
      htmlContainer.appendChild(button);
      document.body.appendChild(htmlContainer);

      // Hover over the icon
      const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
      Object.defineProperty(mouseoverEvent, 'target', { value: icon, enumerable: true });
      htmlContainer.dispatchEvent(mouseoverEvent);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Icon tooltip');

      htmlContainer.remove();
    });

    it('should find tooltip on cell node itself when it has a title attribute in grid tooltip mode', () => {
      const cellNode = document.createElement('div');
      cellNode.className = 'slick-cell l2 r2';
      cellNode.setAttribute('title', 'Cell has title directly');

      const mockColumns = [
        {
          id: 'name',
          field: 'name',
        },
      ] as Column[];
      vi.spyOn(gridStub, 'getCellFromEvent').mockReturnValue({ cell: 0, row: 1 });
      vi.spyOn(gridStub, 'getCellNode').mockReturnValue(cellNode);
      vi.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
      vi.spyOn(dataviewStub, 'getItem').mockReturnValue({ name: 'test' });

      plugin.init(gridStub);
      plugin.setOptions({ useRegularTooltip: true });

      // Hover over the cell node itself
      gridStub.onMouseEnter.notify({ grid: gridStub } as any, { ...new SlickEventData(), target: cellNode } as any);

      const tooltipElm = document.body.querySelector('.slick-custom-tooltip') as HTMLDivElement;
      expect(tooltipElm).toBeTruthy();
      expect(tooltipElm.textContent).toBe('Cell has title directly');
    });
  });
});
