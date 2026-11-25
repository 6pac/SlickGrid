import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, GridOption, RowDetailViewOption } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickRowDetailView } from '../slick.rowdetailview';

type DetailItem = { id: number | string; name: string; [key: string]: any };

const columns: Column[] = [
  { id: '_detail_selector', field: 'sel' },
  { id: 'name', field: 'name' },
];

const items: DetailItem[] = [];
const dataView = {
  getIdPropertyName: vi.fn(() => 'id'),
  getItemById: vi.fn((id: number | string) => items.find((item) => item.id === id)),
  getRowById: vi.fn((id: number | string) => {
    const index = items.findIndex((item) => item.id === id);
    return index >= 0 ? index : undefined;
  }),
  updateItem: vi.fn((id: number | string, item: DetailItem) => {
    const index = items.findIndex((existing) => existing.id === id);
    if (index >= 0) items[index] = item;
  }),
  onRowCountChanged: new SlickEvent(),
  onRowsChanged: new SlickEvent<{ rows: number[] }>(),
};
/** what `grid.getData()` returns: the DataView-like provider by default, a plain array in some tests */
let gridData: any = dataView;

let gridOptions: GridOption;
const editorLock = { commitCurrentEdit: vi.fn(() => true), isActive: vi.fn(() => false) };
const canvas = document.createElement('div');
canvas.className = 'grid-canvas';
Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 600 });
const viewport = document.createElement('div');
Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 500 });
const gridElement = document.createElement('div');
gridElement.className = 'row-detail-grid';
gridElement.appendChild(viewport);
viewport.appendChild(canvas);
document.body.appendChild(gridElement);

/** rendered rows, by row index, as the grid row cache exposes them */
let rowCache: Record<number, { rowNode: HTMLElement[] }> = {};

const grid = {
  getCanvases: vi.fn(() => [canvas]),
  getCellNode: vi.fn(),
  getColumns: vi.fn(() => columns),
  getData: vi.fn(() => gridData),
  getDataItem: vi.fn((row: number) => items[row]),
  getDataLength: vi.fn(() => items.length),
  getEditorLock: vi.fn(() => editorLock),
  getOptions: vi.fn(() => gridOptions),
  getPubSubService: vi.fn(),
  getRowCache: vi.fn(() => rowCache),
  getRowHeight: vi.fn((row: number) => gridOptions.rowHeightProvider?.(grid, row, items[row]) ?? gridOptions.rowHeight!),
  getUID: () => 'row-detail-grid',
  getViewportNode: vi.fn(() => viewport),
  invalidateRowHeights: vi.fn(),
  invalidateRows: vi.fn(),
  render: vi.fn(),
  sanitizeHtmlString: vi.fn((html: string) => html),
  setOptions: vi.fn((options: Partial<GridOption>) => Object.assign(gridOptions, options)),
  updateRowCount: vi.fn(),
  onBeforeDestroy: new SlickEvent(),
  onClick: new SlickEvent(),
  onKeyDown: new SlickEvent(),
  onRendered: new SlickEvent(),
  onScroll: new SlickEvent(),
  onSetOptions: new SlickEvent(),
  onSort: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickRowDetailView', () => {
  let plugin: SlickRowDetailView;
  let options: RowDetailViewOption;
  let item: DetailItem;

  beforeEach(() => {
    vi.clearAllMocks();
    items.splice(0, items.length, { id: 1, name: 'First' }, { id: 2, name: 'Second' }, { id: 3, name: 'Third' });
    gridData = dataView;
    gridOptions = { rowHeight: 25, explicitInitialization: true };
    editorLock.isActive.mockReturnValue(false);
    editorLock.commitCurrentEdit.mockReturnValue(true);
    vi.mocked(dataView.getIdPropertyName).mockImplementation(() => 'id');
    item = items[0];
    options = { panelRows: 2, process: vi.fn() };
    plugin = new SlickRowDetailView(options);
    canvas.replaceChildren();
    rowCache = {};
  });

  afterEach(() => {
    plugin.destroy();
    canvas.replaceChildren();
  });

  const keyEvent = (key: string, target?: EventTarget) =>
    Object.assign(new SlickEventData(), { key, target, preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });
  const clickEvent = (target: HTMLElement) =>
    Object.assign(new SlickEventData(), { target, preventDefault: vi.fn(), stopPropagation: vi.fn(), stopImmediatePropagation: vi.fn() });
  const toggleTarget = () => {
    const target = document.createElement('div');
    target.className = 'detailView-toggle';
    return target;
  };

  /** Simulate a grid render: (re)create the row nodes of the given rows, drop the others, then notify onRendered. */
  const renderRows = (rows: number[] = items.map((_item, row) => row)) => {
    rowCache = {};
    canvas.replaceChildren();
    rows.forEach((row) => {
      const rowNode = document.createElement('div');
      rowNode.className = 'slick-row';
      canvas.appendChild(rowNode);
      rowCache[row] = { rowNode: [rowNode] };
    });
    grid.onRendered.notify({ startRow: 0, endRow: 20, grid });
  };
  const rowNodeOf = (row: number) => rowCache[row]?.rowNode[0];
  const panelOf = (id: number | string) => canvas.querySelector<HTMLElement>(`.row-detail-${id}`);
  const respond = (detail: DetailItem, detailView?: any) => plugin.onAsyncResponse.notify({ item: detail, itemDetail: detail, detailView, grid });

  /** Initialize the plugin with the test's current `options` (tests tweak them after the plugin was constructed). */
  const init = () => {
    plugin.setOptions(options);
    plugin.init(grid);
  };

  // the panelRows: 2 default of these tests => Math.ceil(2 * 26 / 25) * 25 = 75px
  const PANEL_HEIGHT = 75;

  it('exposes default options and builds the detail selector column', () => {
    const column = plugin.getColumnDefinition();

    expect(plugin.pluginName).toBe('RowDetailView');
    expect(plugin.getOptions()).toEqual(expect.objectContaining({
      columnId: '_detail_selector',
      cssClass: 'detailView-toggle',
      panelRows: 2,
      width: 30,
      collapseAllOnSort: false,
      loadOnce: false,
    }));
    expect(column).toEqual(expect.objectContaining({
      id: '_detail_selector',
      field: 'sel',
      width: 30,
      resizable: false,
      sortable: false,
      formatter: expect.any(Function),
    }));
  });

  it('requires a grid instance during initialization', () => {
    expect(() => plugin.init(null as unknown as SlickGrid)).toThrow(/requires the Grid instance/);
  });

  describe('row height provider', () => {
    it('turns on variable row height in place on a grid that is not initialized yet, and wraps the row height provider', () => {
      init();

      expect(gridOptions.enableVariableRowHeight).toBe(true);
      expect(gridOptions.rowHeightProvider).toEqual(expect.any(Function));
      expect(grid.setOptions).not.toHaveBeenCalled();
      expect(grid.invalidateRowHeights).not.toHaveBeenCalled();
    });

    it('goes through setOptions on an initialized grid so it rebuilds its variable row height cell rule', () => {
      gridOptions.explicitInitialization = false;
      init();

      expect(grid.setOptions).toHaveBeenCalledWith({ enableVariableRowHeight: true });
      expect(gridOptions.rowHeightProvider).toEqual(expect.any(Function));
    });

    it('only re-measures the rows when variable row height is already enabled', () => {
      gridOptions.enableVariableRowHeight = true;
      init();

      expect(grid.setOptions).not.toHaveBeenCalled();
      expect(grid.invalidateRowHeights).toHaveBeenCalledWith();
    });

    it('adds the panel height to the expanded rows only, on top of the user provider height', () => {
      const userProvider = vi.fn((_grid: SlickGrid, row: number) => (row === 0 ? 40 : undefined));
      gridOptions.rowHeightProvider = userProvider;
      init();
      const provider = gridOptions.rowHeightProvider!;

      plugin.expandDetailView(items[0]);
      plugin.expandDetailView(items[1]);

      expect(provider(grid, 0, items[0])).toBe(40 + PANEL_HEIGHT);
      expect(provider(grid, 1, items[1])).toBe(25 + PANEL_HEIGHT);
      expect(provider(grid, 2, items[2])).toBeUndefined();
      expect(provider(grid, 3, undefined)).toBeUndefined();
      expect(userProvider).toHaveBeenCalledWith(grid, 0, items[0]);
    });

    it('wraps a provider set later with grid.setOptions', () => {
      init();
      const wrapper = gridOptions.rowHeightProvider!;
      plugin.expandDetailView(item);

      // the grid has already merged the new provider when it notifies onSetOptions
      gridOptions.rowHeightProvider = () => 50;
      grid.onSetOptions.notify({ optionsBefore: {}, optionsAfter: gridOptions, grid });

      expect(gridOptions.rowHeightProvider).toBe(wrapper);
      expect(wrapper(grid, 0, item)).toBe(50 + PANEL_HEIGHT);

      // an option change that keeps our wrapper leaves the wrapped provider alone
      grid.onSetOptions.notify({ optionsBefore: {}, optionsAfter: gridOptions, grid });
      expect(wrapper(grid, 0, item)).toBe(50 + PANEL_HEIGHT);
    });

    it('sizes the panel from panelRows, panelHeight and maxRows', () => {
      init();
      const provider = gridOptions.rowHeightProvider!;

      plugin.setOptions({ panelRows: 6 }); // Math.ceil(6 * 26 / 25) * 25
      plugin.expandDetailView(items[0]);
      expect(provider(grid, 0, items[0])).toBe(25 + 175);

      plugin.setOptions({ panelHeight: 120 });
      plugin.expandDetailView(items[1]);
      expect(provider(grid, 1, items[1])).toBe(25 + 120);

      plugin.setOptions({ maxRows: 2 });
      plugin.expandDetailView(items[2]);
      expect(provider(grid, 2, items[2])).toBe(25 + 50);
    });
  });

  describe('expand and collapse', () => {
    it('expands a row without touching the data, re-measures its row height and starts the async process', () => {
      options.preTemplate = () => '<span class="loading">Loading</span>';
      init();
      const keysBefore = Object.keys(item);

      plugin.expandDetailView(item);

      expect(plugin.isExpanded(item)).toBe(true);
      expect(plugin.isExpanded(1)).toBe(true);
      expect(plugin.isExpanded(items[1])).toBe(false);
      expect(plugin.getExpandedRows()).toEqual([item]);
      expect(items).toHaveLength(3);
      expect(Object.keys(item)).toEqual(keysBefore);
      expect(dataView.updateItem).not.toHaveBeenCalled();
      expect(grid.invalidateRowHeights).toHaveBeenCalledWith([0]);
      expect(options.process).toHaveBeenCalledWith(item);

      renderRows();
      expect(panelOf(1)?.querySelector('.loading')?.textContent).toBe('Loading');
    });

    it('ignores expanding a row that is already expanded or has no id', () => {
      init();
      plugin.expandDetailView(item);
      vi.mocked(grid.invalidateRowHeights).mockClear();

      plugin.expandDetailView(item);
      plugin.expandDetailView({ name: 'no id' });
      plugin.expandDetailView(undefined);

      expect(grid.invalidateRowHeights).not.toHaveBeenCalled();
      expect(options.process).toHaveBeenCalledOnce();
    });

    it('does not re-measure anything when the expanded row is not in the grid (filtered out)', () => {
      init();
      plugin.expandDetailView({ id: 99, name: 'filtered out' });

      expect(plugin.isExpanded(99)).toBe(true);
      expect(grid.invalidateRowHeights).not.toHaveBeenCalled();
    });

    it('collapses an expanded row, removes its panel and re-measures its row', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      vi.mocked(grid.invalidateRowHeights).mockClear();

      plugin.collapseDetailView(item);

      expect(plugin.isExpanded(item)).toBe(false);
      expect(panelOf(1)).toBeNull();
      expect(grid.invalidateRowHeights).toHaveBeenCalledWith([0]);

      // collapsing a row that is not expanded does nothing
      plugin.collapseDetailView(item);
      expect(grid.invalidateRowHeights).toHaveBeenCalledOnce();
    });

    it('collapses every expanded row with a single row height refresh', () => {
      init();
      plugin.expandDetailView(items[0]);
      plugin.expandDetailView(items[2]);
      vi.mocked(grid.invalidateRowHeights).mockClear();

      plugin.collapseAll();

      expect(plugin.getExpandedRows()).toEqual([]);
      expect(grid.invalidateRowHeights).toHaveBeenCalledExactlyOnceWith([0, 2]);

      plugin.collapseAll();
      expect(grid.invalidateRowHeights).toHaveBeenCalledOnce();
    });

    it('keeps only one row open when singleRowExpand is enabled', () => {
      options.singleRowExpand = true;
      init();
      plugin.expandDetailView(items[0]);
      vi.mocked(grid.invalidateRowHeights).mockClear();

      plugin.expandDetailView(items[1]);

      expect(plugin.getExpandedRows()).toEqual([items[1]]);
      expect(grid.invalidateRowHeights).toHaveBeenCalledExactlyOnceWith([0, 1]);
    });

    it('collapses existing details when setOptions turns singleRowExpand on, and not otherwise', () => {
      init();
      plugin.expandDetailView(item);
      const collapse = vi.spyOn(plugin, 'collapseAll');

      plugin.setOptions({ columnId: 'detail-toggle' });
      expect(collapse).not.toHaveBeenCalled();

      plugin.setOptions({ singleRowExpand: true });
      expect(collapse).toHaveBeenCalledOnce();
      expect(plugin.getExpandedRows()).toEqual([]);
    });

    it('stays open through sorting by default, and collapses all on sort with collapseAllOnSort', () => {
      init();
      plugin.expandDetailView(item);
      grid.onSort.notify({ grid } as any);
      expect(plugin.isExpanded(item)).toBe(true);
      plugin.destroy();

      plugin = new SlickRowDetailView({ ...options, collapseAllOnSort: true });
      init();
      plugin.expandDetailView(item);
      grid.onSort.notify({ grid } as any);
      expect(plugin.isExpanded(item)).toBe(false);
    });

    it('reuses the saved detail view on re-expand when loadOnce is enabled', () => {
      options.loadOnce = true;
      options.postTemplate = (detail) => `<input class="detail-input" value="${detail.name}">`;
      init();
      const asyncResponse = vi.fn();
      plugin.onAsyncResponse.subscribe((_e, args) => asyncResponse(args.detailView));

      plugin.expandDetailView(item);
      respond(item);
      renderRows();
      panelOf(1)!.querySelector('input')!.setAttribute('value', 'edited');
      plugin.collapseDetailView(item);

      plugin.expandDetailView(item);
      renderRows();

      expect(options.process).toHaveBeenCalledOnce();
      expect(asyncResponse).toHaveBeenLastCalledWith('<input class="detail-input" value="edited">');
      expect(panelOf(1)!.querySelector('input')!.getAttribute('value')).toBe('edited');
    });

    it('reuses an async response received while collapsed when loadOnce is enabled', () => {
      options.loadOnce = true;
      options.postTemplate = (detail) => `<b>${detail.name}</b>`;
      init();
      respond(item);

      plugin.expandDetailView(item);
      renderRows();

      expect(options.process).not.toHaveBeenCalled();
      expect(panelOf(1)!.innerHTML).toBe('<b>First</b>');
    });
  });

  describe('async response', () => {
    it('renders the postTemplate in the mounted panel and notifies the end of the update', () => {
      options.preTemplate = () => 'loading';
      options.postTemplate = (detail) => `<b>${detail.name}</b>`;
      init();
      const endUpdate = vi.fn();
      plugin.onAsyncEndUpdate.subscribe((_e, args) => endUpdate(args.item));
      plugin.expandDetailView(item);
      renderRows();
      expect(panelOf(1)!.textContent).toBe('loading');

      respond(item);

      expect(panelOf(1)!.innerHTML).toBe('<b>First</b>');
      expect(endUpdate).toHaveBeenCalledWith(item);
      expect(dataView.updateItem).not.toHaveBeenCalled();
    });

    it('uses an explicit detailView and accepts the response as itemDetail', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();

      plugin.onAsyncResponse.notify({ itemDetail: item, detailView: '<i>direct</i>' } as any);

      expect(panelOf(1)!.innerHTML).toBe('<i>direct</i>');
    });

    it('throws when the response has no item', () => {
      init();
      expect(() => plugin.onAsyncResponse.notify({} as any)).toThrow(/requires the onAsyncResponse\(\) to supply "args.item"/);
      expect(() => plugin.onAsyncResponse.notify(undefined as any)).toThrow(/args.item/);
    });

    it('replaces the row item when the process responds with a new item object', () => {
      options.postTemplate = (detail) => detail.assignee;
      init();
      plugin.expandDetailView(item);
      const detail = { ...item, assignee: 'Jane' };

      respond(detail);
      renderRows();

      expect(dataView.updateItem).toHaveBeenCalledWith(1, detail);
      expect(plugin.getExpandedRows()).toEqual([detail]);
      expect(panelOf(1)!.textContent).toBe('Jane');
    });

    it('renders an HTMLElement detail content as a child of the panel', () => {
      init();
      plugin.expandDetailView(item);
      const content = document.createElement('section');
      respond(item, content);
      renderRows();

      expect(panelOf(1)!.firstElementChild).toBe(content);
    });
  });

  describe('panel mounting', () => {
    it('renders the panel inside its row, below the cells, and keeps the cells at the base row height', () => {
      init();
      plugin.expandDetailView(items[1]);
      renderRows();

      const rowNode = rowNodeOf(1);
      const panel = panelOf(2)!;
      expect(panel.parentElement).toBe(rowNode);
      expect(panel.getAttribute('role')).toBe('region');
      expect(rowNode.classList.contains('slick-row-detail-expanded')).toBe(true);
      expect(rowNode.style.getPropertyValue('--slick-row-extra-height')).toBe(`${PANEL_HEIGHT}px`);
      expect(panel.style.top).toBe('25px');
      expect(panel.style.height).toBe(`${PANEL_HEIGHT}px`);
      expect(rowNodeOf(0).classList.contains('slick-row-detail-expanded')).toBe(false);
    });

    it('moves the same panel element into a re-created row node, keeping its live content', () => {
      options.postTemplate = () => '<input class="detail-input">';
      init();
      plugin.expandDetailView(item);
      respond(item);
      renderRows();
      const panel = panelOf(1)!;
      const input = panel.querySelector('input')!;
      input.value = 'typed';
      const sanitizeCalls = vi.mocked(grid.sanitizeHtmlString).mock.calls.length;

      renderRows(); // the grid rebuilt every row

      expect(panelOf(1)).toBe(panel);
      expect(panel.parentElement).toBe(rowNodeOf(0));
      expect(panel.querySelector('input')).toBe(input);
      expect(input.value).toBe('typed');
      expect(vi.mocked(grid.sanitizeHtmlString).mock.calls.length).toBe(sanitizeCalls);
    });

    it('does nothing on render when no row is expanded', () => {
      init();
      renderRows();
      expect(canvas.querySelector('.slick-row-detail-container')).toBeNull();
    });

    it('anchors the panel to the visible part of the viewport', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue({ left: 100 } as DOMRect);
      vi.spyOn(rowNodeOf(0), 'getBoundingClientRect').mockReturnValue({ left: -50 } as DOMRect);

      grid.onScroll.notify({ scrollLeft: 150, scrollTop: 0, grid } as any);

      expect(panelOf(1)!.style.left).toBe('150px');
      expect(panelOf(1)!.style.width).toBe('500px');
    });

    it('repositions the panels on a horizontal scroll only', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      const rowRect = vi.spyOn(rowNodeOf(0), 'getBoundingClientRect');

      grid.onScroll.notify({ scrollLeft: 0, scrollTop: 100, grid } as any);
      expect(rowRect).toHaveBeenCalledOnce(); // first scroll event: scrollLeft unknown until now

      grid.onScroll.notify({ scrollLeft: 0, scrollTop: 200, grid } as any);
      expect(rowRect).toHaveBeenCalledOnce();

      grid.onScroll.notify({ scrollLeft: 30, scrollTop: 200, grid } as any);
      expect(rowRect).toHaveBeenCalledTimes(2);
    });

    it('keeps the keys typed in the panel away from the grid keyboard navigation', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      const gridKeyDown = vi.fn();
      canvas.addEventListener('keydown', gridKeyDown);

      panelOf(1)!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      rowNodeOf(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

      expect(gridKeyDown).toHaveBeenCalledOnce();
      canvas.removeEventListener('keydown', gridKeyDown);
    });
  });

  describe('viewport range notifications', () => {
    it('notifies when an expanded row stops being rendered and when it comes back with its panel', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      const panel = panelOf(1)!;
      const out = vi.fn();
      const back = vi.fn();
      plugin.onRowOutOfViewportRange.subscribe((_e, args) => out({ rowId: args.rowId, rowIndex: args.rowIndex, ids: [...args.rowIdsOutOfViewport], expanded: args.expandedRows }));
      plugin.onRowBackToViewportRange.subscribe((_e, args) => back({ rowId: args.rowId, rowIndex: args.rowIndex, ids: [...args.rowIdsOutOfViewport], inDom: !!panelOf(1) }));

      renderRows([1, 2]);
      expect(out).toHaveBeenCalledExactlyOnceWith({ rowId: 1, rowIndex: 0, ids: [1], expanded: [item] });
      expect(panel.isConnected).toBe(false);

      renderRows([2]);
      expect(out).toHaveBeenCalledOnce();

      renderRows([0, 1]);
      expect(back).toHaveBeenCalledExactlyOnceWith({ rowId: 1, rowIndex: 0, ids: [], inDom: true });
      expect(panelOf(1)).toBe(panel);
    });

    it('saves the detail view of a row leaving the rendered range unless saveDetailViewOnScroll is off', () => {
      options.postTemplate = () => 'content';
      init();
      const save = vi.spyOn(plugin, 'saveDetailView');
      plugin.expandDetailView(item);
      respond(item);
      renderRows();

      renderRows([2]);
      expect(save).toHaveBeenCalledWith(item);
      plugin.destroy();

      plugin = new SlickRowDetailView({ ...options, saveDetailViewOnScroll: false });
      init();
      const noSave = vi.spyOn(plugin, 'saveDetailView');
      plugin.expandDetailView(item);
      renderRows();
      renderRows([2]);
      expect(noSave).not.toHaveBeenCalled();
    });

    it('reports a row index of -1 for an expanded row that is no longer in the grid', () => {
      init();
      const out = vi.fn();
      plugin.onRowOutOfViewportRange.subscribe((_e, args) => out(args.rowIndex));
      plugin.expandDetailView({ id: 99, name: 'gone' });

      renderRows();

      expect(out).toHaveBeenCalledWith(-1);
    });

    it('forgets the out-of-viewport state of a collapsed row', () => {
      init();
      plugin.expandDetailView(item);
      renderRows([1]);
      const back = vi.fn();
      plugin.onRowBackToViewportRange.subscribe(back);

      plugin.collapseDetailView(item);
      plugin.expandDetailView(item);
      renderRows();

      expect(back).not.toHaveBeenCalled();
    });
  });

  describe('saveDetailView and resizeDetailView', () => {
    it('saves the panel HTML without re-rendering the live panel, even while its row is not rendered', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      const panel = panelOf(1)!;
      panel.innerHTML = '<p>edited</p>';
      renderRows([1]);

      plugin.saveDetailView(item);
      renderRows();

      expect(panelOf(1)).toBe(panel);
      expect(panel.innerHTML).toBe('<p>edited</p>');
      plugin.saveDetailView(items[1]); // not expanded: nothing to save
    });

    it('ignores resize requests without an item or a mounted panel', () => {
      init();
      plugin.resizeDetailView(undefined);
      plugin.resizeDetailView(item);
      plugin.expandDetailView(item);
      vi.mocked(grid.invalidateRowHeights).mockClear();
      plugin.resizeDetailView(item);

      expect(grid.invalidateRowHeights).not.toHaveBeenCalled();
    });

    it('resizes the panel to its content height, capped by maxRows, and re-measures the row only when it changed', () => {
      init();
      plugin.expandDetailView(item);
      renderRows();
      const panel = panelOf(1)!;
      panel.scrollTop = 0;
      Object.defineProperty(panel, 'scrollHeight', { configurable: true, value: 140 });
      vi.mocked(grid.invalidateRowHeights).mockClear();

      plugin.resizeDetailView(item);
      expect(grid.invalidateRowHeights).toHaveBeenCalledExactlyOnceWith([0]);
      expect(gridOptions.rowHeightProvider!(grid, 0, item)).toBe(25 + 140);

      plugin.resizeDetailView(item);
      expect(grid.invalidateRowHeights).toHaveBeenCalledOnce();

      plugin.setOptions({ maxRows: 4 });
      plugin.resizeDetailView(item);
      expect(gridOptions.rowHeightProvider!(grid, 0, item)).toBe(25 + 100);
    });
  });

  describe('detail selector formatter', () => {
    const format = (row: number, dataContext: any) =>
      (plugin.getColumnDefinition().formatter as any)(row, 0, null, columns[0], dataContext, grid);

    it('renders an accessible expand button for a collapsed row without writing to the item', () => {
      init();
      const keysBefore = Object.keys(item);
      const toggle = format(0, item) as HTMLElement;

      expect(toggle.className).toBe('detailView-toggle expand ');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(toggle.dataset.rowDetailToggle).toBe('');
      expect(Object.keys(item)).toEqual(keysBefore);
    });

    it('renders an accessible collapse button for an expanded row, with the expandedClass', () => {
      options.expandedClass = 'is-open';
      options.collapsedClass = 'is-closed';
      init();
      expect((format(1, items[1]) as HTMLElement).className).toBe('detailView-toggle expand is-closed');

      plugin.expandDetailView(item);
      const result = format(0, item) as { html: HTMLElement };

      expect(result.html.className).toBe('detailView-toggle collapse is-open');
      expect(result.html.getAttribute('aria-expanded')).toBe('true');
    });

    it('renders nothing for rows rejected by an expandableOverride', () => {
      options.expandableOverride = (row) => row !== 1;
      plugin = new SlickRowDetailView(options);
      init();

      expect(format(1, items[1])).toBe('');
      expect(format(0, item)).not.toBe('');
    });
  });

  describe('click toggle', () => {
    it('expands then collapses on successive selector clicks and reports the new state after each toggle', () => {
      init();
      const before = vi.fn();
      const after = vi.fn();
      plugin.onBeforeRowDetailToggle.subscribe((_e, args) => before(args.expanded));
      plugin.onAfterRowDetailToggle.subscribe((_e, args) => after({ expanded: args.expanded, rows: args.expandedRows.map((row: DetailItem) => row.id) }));

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));
      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));

      expect(before.mock.calls).toEqual([[true], [false]]);
      expect(after.mock.calls).toEqual([[{ expanded: true, rows: [1] }], [{ expanded: false, rows: [] }]]);
    });

    it('does not toggle when the before-toggle event returns false', () => {
      init();
      plugin.onBeforeRowDetailToggle.subscribe(() => false);

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));

      expect(plugin.isExpanded(item)).toBe(false);
    });

    it('ignores clicks on the selector cell that are not on the toggle, and clicks on other columns', () => {
      init();
      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(document.createElement('span')));
      grid.onClick.notify({ row: 0, cell: 1, grid }, clickEvent(toggleTarget()));

      expect(plugin.isExpanded(item)).toBe(false);
    });

    it('expands from any column with useRowClick', () => {
      options.useRowClick = true;
      init();
      grid.onClick.notify({ row: 1, cell: 1, grid }, clickEvent(document.createElement('span')));

      expect(plugin.isExpanded(items[1])).toBe(true);
    });

    it('does not toggle and stops the event when the active edit cannot be committed', () => {
      init();
      editorLock.isActive.mockReturnValue(true);
      editorLock.commitCurrentEdit.mockReturnValue(false);
      const event = clickEvent(toggleTarget());

      grid.onClick.notify({ row: 0, cell: 0, grid }, event);

      expect(plugin.isExpanded(item)).toBe(false);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('commits an active edit and then toggles', () => {
      init();
      editorLock.isActive.mockReturnValue(true);

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));

      expect(editorLock.commitCurrentEdit).toHaveBeenCalled();
      expect(plugin.isExpanded(item)).toBe(true);
    });

    it('does not toggle rows rejected by an expandableOverride set after construction', () => {
      init();
      plugin.expandableOverride((row) => row !== 0);

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));
      expect(plugin.isExpanded(item)).toBe(false);

      // the toggle itself also checks the override (e.g. when a click handler calls it directly)
      (plugin as any).toggleRowSelection(0, item);
      expect(plugin.isExpanded(item)).toBe(false);
    });

    it('notifies the after-toggle event without toggling when a row click has no data item', () => {
      options.useRowClick = true;
      init();
      const after = vi.fn();
      plugin.onAfterRowDetailToggle.subscribe((_e, args) => after(args.expanded));

      grid.onClick.notify({ row: 9, cell: 1, grid }, clickEvent(document.createElement('span')));

      expect(after).toHaveBeenCalledWith(false);
    });
  });

  describe('keyboard toggle', () => {
    const toggleCell = () => {
      const cell = document.createElement('div');
      const toggle = toggleTarget();
      toggle.dataset.rowDetailToggle = '';
      cell.appendChild(toggle);
      vi.mocked(grid.getCellNode).mockReturnValue(cell as HTMLDivElement);
      return toggle;
    };

    it('activates the toggle with Enter or Space on the selector cell', () => {
      init();
      const toggle = toggleCell();
      const click = vi.spyOn(toggle, 'click');
      const enter = keyEvent('Enter');
      const space = keyEvent(' ');

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, enter);
      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, space);

      expect(click).toHaveBeenCalledTimes(2);
      expect(enter.preventDefault).toHaveBeenCalled();
      expect(space.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('ignores other keys, other columns, an active editor, panel targets and rows without a toggle', () => {
      init();
      const toggle = toggleCell();
      const click = vi.spyOn(toggle, 'click');
      const panel = document.createElement('div');
      panel.className = 'slick-row-detail-container';
      const input = document.createElement('input');
      panel.appendChild(input);

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, keyEvent('a'));
      grid.onKeyDown.notify({ row: 0, cell: 1, grid }, keyEvent('Enter'));
      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, keyEvent('Enter', input));
      editorLock.isActive.mockReturnValue(true);
      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, keyEvent('Enter'));
      editorLock.isActive.mockReturnValue(false);
      vi.mocked(grid.getCellNode).mockReturnValue(document.createElement('div') as HTMLDivElement);
      const noToggle = keyEvent('Enter', {} as EventTarget);
      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, noToggle);

      expect(click).not.toHaveBeenCalled();
      expect(noToggle.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('data providers', () => {
    it('uses the data view id property name', () => {
      vi.mocked(dataView.getIdPropertyName).mockReturnValue('num');
      items.splice(0, items.length, { id: 'a', num: 10, name: 'Ten' } as DetailItem);
      init();

      plugin.expandDetailView(items[0]);

      expect(plugin.isExpanded(10)).toBe(true);
      expect(plugin.isExpanded('a')).toBe(false);
    });

    it('works with a plain array provider, looking rows up by id', () => {
      gridData = items;
      init();

      plugin.expandDetailView(items[2]);
      expect(grid.invalidateRowHeights).toHaveBeenCalledWith([2]);

      plugin.expandDetailView({ id: 99, name: 'missing' });
      expect(grid.invalidateRowHeights).toHaveBeenCalledOnce();

      renderRows();
      expect(panelOf(3)?.parentElement).toBe(rowNodeOf(2));
    });

    it('wires the DataView change events to the grid', () => {
      init();

      dataView.onRowCountChanged.notify({} as any);
      expect(grid.updateRowCount).toHaveBeenCalledOnce();
      expect(grid.render).toHaveBeenCalledOnce();

      dataView.onRowsChanged.notify({ rows: [1, 2] });
      expect(grid.invalidateRows).toHaveBeenCalledWith([1, 2]);
      expect(grid.render).toHaveBeenCalledTimes(2);
    });

    it('does not wire anything for a provider without the DataView events', () => {
      gridData = items;
      init();
      dataView.onRowCountChanged.notify({} as any);
      expect(grid.updateRowCount).not.toHaveBeenCalled();
    });
  });

  describe('getFilterItem (deprecated)', () => {
    it('returns the item unchanged and warns once', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      init();

      expect(plugin.getFilterItem(item)).toBe(item);
      expect(plugin.getFilterItem(items[1])).toBe(items[1]);
      expect(warn).toHaveBeenCalledOnce();
      warn.mockRestore();
    });
  });

  describe('destroy', () => {
    it('removes the panels, restores the user row height provider and re-measures the rows', () => {
      const userProvider = vi.fn(() => 30);
      gridOptions.rowHeightProvider = userProvider;
      init();
      plugin.expandDetailView(item);
      renderRows();
      vi.mocked(grid.invalidateRowHeights).mockClear();

      plugin.destroy();

      expect(panelOf(1)).toBeNull();
      expect(gridOptions.rowHeightProvider).toBe(userProvider);
      expect(grid.invalidateRowHeights).toHaveBeenCalledExactlyOnceWith();
      expect(plugin.getExpandedRows()).toEqual([]);
    });

    it('does not re-measure the rows while the grid itself is being destroyed or when nothing was expanded', () => {
      init();
      plugin.destroy();
      expect(grid.invalidateRowHeights).not.toHaveBeenCalled();

      plugin = new SlickRowDetailView(options);
      init();
      plugin.expandDetailView(item);
      vi.mocked(grid.invalidateRowHeights).mockClear();
      grid.onBeforeDestroy.notify({ grid });
      plugin.destroy();
      expect(grid.invalidateRowHeights).not.toHaveBeenCalled();
    });

    it('leaves a provider replaced by someone else alone', () => {
      init();
      const other = () => 10;
      gridOptions.rowHeightProvider = other;
      plugin.destroy();
      expect(gridOptions.rowHeightProvider).toBe(other);
    });

    it('stops reacting to grid and data view events once destroyed', () => {
      init();
      plugin.destroy();

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));
      dataView.onRowsChanged.notify({ rows: [0] });
      plugin.expandDetailView(item);
      renderRows();

      expect(grid.invalidateRows).not.toHaveBeenCalled();
      expect(panelOf(1)).toBeNull();
    });
  });
});
