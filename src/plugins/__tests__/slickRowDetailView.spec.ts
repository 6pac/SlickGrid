import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, GridOption, RowDetailViewOption } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickDataView } from '../../slick.dataview';
import type { SlickGrid } from '../../slick.grid';
import { SlickRowDetailView } from '../slick.rowdetailview';

type DetailItem = { id: number | string; name: string; [key: string]: any };

const columns: Column[] = [
  { id: '_detail_selector', field: 'sel' },
  { id: 'name', field: 'name' },
];

const items: DetailItem[] = [];
const dataView = {
  beginUpdate: vi.fn(),
  deleteItem: vi.fn((id: number | string) => {
    const index = items.findIndex((item) => String(item.id) === String(id));
    if (index >= 0) items.splice(index, 1);
  }),
  endUpdate: vi.fn(),
  getIdPropertyName: vi.fn(() => 'id'),
  getIdxById: vi.fn((id: number | string) => items.findIndex((item) => String(item.id) === String(id))),
  getItemById: vi.fn((id: number | string) => items.find((item) => String(item.id) === String(id))),
  getItemByIdx: vi.fn((index: number) => items[index]),
  getRowById: vi.fn((id: number | string) => items.findIndex((item) => String(item.id) === String(id))),
  insertItem: vi.fn((index: number, item: DetailItem) => items.splice(index, 0, item)),
  updateItem: vi.fn((id: number | string, item: DetailItem) => {
    const index = items.findIndex((existing) => String(existing.id) === String(id));
    if (index >= 0) items[index] = item;
  }),
  onRowCountChanged: new SlickEvent(),
  onRowsChanged: new SlickEvent(),
  onSetItemsCalled: new SlickEvent(),
} as unknown as SlickDataView;

const gridOptions: GridOption = { rowHeight: 25, minRowBuffer: 4 };
const editorLock = { commitCurrentEdit: vi.fn(() => true), isActive: vi.fn(() => false) };
const canvas = document.createElement('div');
Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 600 });
const viewport = document.createElement('div');
Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 500 });
const gridElement = document.createElement('div');
gridElement.className = 'row-detail-grid';
canvas.className = 'grid-canvas';
gridElement.appendChild(canvas);
gridElement.appendChild(viewport);
document.body.appendChild(gridElement);

const grid = {
  getCanvases: vi.fn(() => [canvas]),
  getCellNodeBox: vi.fn((row: number) => ({ top: row * 25 })),
  getCellNode: vi.fn(),
  getColumnIndex: vi.fn(() => 0),
  getColumns: vi.fn(() => columns),
  getData: vi.fn(() => dataView),
  getDataItem: vi.fn((row: number) => items[row]),
  getEditorLock: vi.fn(() => editorLock),
  getOptions: vi.fn(() => gridOptions),
  getPubSubService: vi.fn(),
  getRenderedRange: vi.fn(() => ({ top: 0, bottom: 20, leftPx: 0, rightPx: 600 })),
  getRowHeight: vi.fn(() => 25),
  getRowTop: vi.fn((row: number) => row * 25),
  getUID: () => 'row-detail-grid',
  getViewportNode: vi.fn(() => viewport),
  invalidateRows: vi.fn(),
  render: vi.fn(),
  sanitizeHtmlString: vi.fn((html: string) => html),
  updateRowCount: vi.fn(),
  onBeforeEditCell: new SlickEvent(),
  onClick: new SlickEvent(),
  onKeyDown: new SlickEvent(),
  onRendered: new SlickEvent(),
  onScroll: new SlickEvent(),
  onSort: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickRowDetailView', () => {
  let plugin: SlickRowDetailView;
  let options: RowDetailViewOption;
  let item: DetailItem;

  beforeEach(() => {
    vi.clearAllMocks();
    items.splice(0, items.length, { id: 1, name: 'First' }, { id: 2, name: 'Second' });
    gridOptions.minRowBuffer = 4;
    editorLock.isActive.mockReturnValue(false);
    editorLock.commitCurrentEdit.mockReturnValue(true);
    vi.mocked(grid.getRenderedRange).mockImplementation(() => ({ top: 0, bottom: 20, leftPx: 0, rightPx: 600 }));
    vi.mocked(dataView.getIdPropertyName).mockImplementation(() => 'id');
    item = items[0];
    options = { panelRows: 2, process: vi.fn().mockResolvedValue(undefined) };
    plugin = new SlickRowDetailView(options);
    canvas.replaceChildren();
  });

  afterEach(() => {
    plugin.destroy();
    canvas.replaceChildren();
    vi.useRealTimers();
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
  const mountPanels = () => grid.onRendered.notify({ startRow: 0, endRow: 20, grid });
  const panelOf = (id: number | string) => canvas.querySelector<HTMLElement>(`.row-detail-${id}`);

  const init = () => plugin.init(grid);

  it('exposes default options and builds the detail selector column', () => {
    const column = plugin.getColumnDefinition();

    expect(plugin.pluginName).toBe('RowDetailView');
    expect(plugin.getOptions()).toEqual(expect.objectContaining({
      columnId: '_detail_selector',
      cssClass: 'detailView-toggle',
      panelRows: 2,
      width: 30,
      collapseAllOnSort: true,
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

  it('initializes the data view, subscribes to grid events, and expands the row buffer', () => {
    init();

    expect(gridOptions.minRowBuffer).toBe(5);
    dataView.onRowCountChanged.notify({ previous: 2, current: 2, itemCount: 2, dataView, callingOnRowsChanged: false });
    expect(grid.updateRowCount).toHaveBeenCalledOnce();
    expect(grid.render).toHaveBeenCalledOnce();
  });

  it('requires a grid instance during initialization', () => {
    expect(() => plugin.init(null as unknown as SlickGrid)).toThrow(/requires the Grid instance/);
  });

  it('supports option updates and collapses existing details when singleRowExpand is enabled', () => {
    init();
    plugin.expandDetailView(item);
    const collapse = vi.spyOn(plugin, 'collapseAll');

    plugin.setOptions({ singleRowExpand: true, columnId: 'detail-toggle' });

    expect(plugin.getOptions().columnId).toBe('detail-toggle');
    expect(collapse).toHaveBeenCalledOnce();
  });

  it('initializes collapsed metadata in the formatter and honors expandableOverride', () => {
    init();
    const formatter = plugin.getColumnDefinition().formatter!;
    const collapsed = formatter(0, 0, null, columns[0], item, grid) as HTMLElement;

    expect(collapsed.className).toContain('detailView-toggle');
    expect(collapsed.className).toContain('expand');
    expect(collapsed.getAttribute('aria-expanded')).toBe('false');
    expect(collapsed.getAttribute('aria-label')).toBe('Expand row details');
    expect(item._collapsed).toBe(true);
    expect(formatter(0, 0, null, columns[0], { ...item, _isPadding: true }, grid)).toBe('');

    plugin.destroy();
    plugin = new SlickRowDetailView({ ...options, expandableOverride: () => false });
    expect(plugin.getColumnDefinition().formatter!(0, 0, null, columns[0], item, grid)).toBe('');
  });

  it('activates the row detail toggle from the selector cell with Space', () => {
    init();
    const cell = document.createElement('div');
    const toggle = document.createElement('div');
    toggle.dataset.rowDetailToggle = '';
    cell.appendChild(toggle);
    vi.mocked(grid.getCellNode).mockReturnValue(cell);
    const click = vi.spyOn(toggle, 'click');
    const event = Object.assign(new SlickEventData(), { key: ' ', preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });
    grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);
    expect(click).toHaveBeenCalledOnce();
    expect(event.preventDefault).toHaveBeenCalledOnce();
  });

  it('leaves Space and Enter alone when they are typed inside a row detail panel', () => {
    init();
    const cell = document.createElement('div');
    const toggle = document.createElement('div');
    toggle.dataset.rowDetailToggle = '';
    cell.appendChild(toggle);
    vi.mocked(grid.getCellNode).mockReturnValue(cell);
    const click = vi.spyOn(toggle, 'click');
    const panel = document.createElement('div');
    panel.className = 'slick-row-detail-container row-detail-0';
    const input = panel.appendChild(document.createElement('input'));

    for (const key of [' ', 'Enter']) {
      const event = Object.assign(new SlickEventData(), { key, target: input, preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });
      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    }
    expect(click).not.toHaveBeenCalled();
  });

  it('expands a detail row, inserts padding rows, and starts the async process', () => {
    init();

    plugin.expandDetailView(item);

    expect(item._collapsed).toBe(false);
    expect(item._sizePadding).toBe(3);
    expect(items).toHaveLength(5);
    expect(dataView.insertItem).toHaveBeenCalledTimes(3);
    expect(options.process).toHaveBeenCalledWith(item);
    expect(plugin.getExpandedRows()).toEqual([item]);
  });

  it('caps padding row insertion with maxRows', () => {
    plugin = new SlickRowDetailView({ ...options, maxRows: 2 });
    init();

    plugin.expandDetailView(item);

    expect(item._sizePadding).toBe(2);
    expect(items).toHaveLength(4);
    expect(dataView.insertItem).toHaveBeenCalledTimes(2);
  });

  it('updates detail content and notifies when an async response arrives', () => {
    init();
    plugin.expandDetailView(item);
    const asyncEnd = vi.fn();
    plugin.onAsyncEndUpdate.subscribe((_event: SlickEventData, args: { grid: SlickGrid; item: DetailItem; itemDetail: DetailItem }) => asyncEnd(args));

    plugin.onAsyncResponse.notify({ item, detailView: '<strong>Loaded</strong>', grid }, new SlickEventData());

    expect(item._detailContent).toBe('<strong>Loaded</strong>');
    expect(item._detailViewLoaded).toBe(true);
    expect(dataView.updateItem).toHaveBeenCalledWith(item.id, item);
    expect(asyncEnd).toHaveBeenCalledWith({ grid, item, itemDetail: item });
  });

  it('collapses an expanded row and removes its padding rows', () => {
    init();
    plugin.expandDetailView(item);

    plugin.collapseDetailView(item);

    expect(item._collapsed).toBe(true);
    expect(item._sizePadding).toBe(0);
    expect(items).toHaveLength(2);
    expect(plugin.getExpandedRows()).toEqual([]);
    expect(dataView.beginUpdate).toHaveBeenCalledOnce();
    expect(dataView.endUpdate).toHaveBeenCalledOnce();
  });

  it('collapses all expanded rows when requested or when the grid sorts', () => {
    init();
    plugin.expandDetailView(item);
    plugin.expandDetailView(items[4]);

    grid.onSort.notify({ grid, columnId: 'name', sortAsc: true });

    expect(plugin.getExpandedRows()).toEqual([]);
    expect(items).toHaveLength(2);
  });

  it('does not collapse all on sort when collapseAllOnSort is disabled', () => {
    plugin = new SlickRowDetailView({ ...options, collapseAllOnSort: false });
    init();
    plugin.expandDetailView(item);

    grid.onSort.notify({ grid, columnId: 'name', sortAsc: true });

    expect(plugin.getExpandedRows()).toEqual([item]);
  });

  it('toggles from the detail selector click and honors the before-toggle event', () => {
    init();
    const beforeToggle = vi.fn(() => false);
    plugin.onBeforeRowDetailToggle.subscribe(beforeToggle);
    const target = document.createElement('div');
    target.className = 'detailView-toggle';
    const event = Object.assign(new SlickEventData(), { target, stopPropagation: vi.fn(), stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 0, cell: 0, grid }, event);

    expect(beforeToggle).toHaveBeenCalledOnce();
    expect(plugin.getExpandedRows()).toEqual([]);
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });

  it('expands from a row click when useRowClick is enabled', () => {
    plugin = new SlickRowDetailView({ ...options, useRowClick: true });
    init();
    plugin.getColumnDefinition().formatter!(0, 0, null, columns[0], item, grid);
    const event = Object.assign(new SlickEventData(), { target: document.createElement('div'), stopPropagation: vi.fn(), stopImmediatePropagation: vi.fn() });

    grid.onClick.notify({ row: 0, cell: 1, grid }, event);

    expect(plugin.getExpandedRows()).toEqual([item]);
    expect(event.stopPropagation).toHaveBeenCalledOnce();
  });

  it('returns the parent item for padding rows in filtering', () => {
    init();
    const paddingItem = { id: '1.1', _isPadding: true, _parent: item };

    expect(plugin.getFilterItem(paddingItem)).toBe(item);
    expect(plugin.getFilterItem(item)).toBe(item);
  });

  it('invalidates rows and rerenders when the data view reports changed rows', () => {
    init();

    dataView.onRowsChanged.notify({ rows: [1, 2], itemCount: 2, dataView, calledOnRowCountChanged: false });

    expect(grid.invalidateRows).toHaveBeenCalledWith([1, 2]);
    expect(grid.render).toHaveBeenCalledOnce();
  });

  it('mounts, positions, and removes a detail overlay panel with its parent row', () => {
    init();
    plugin.expandDetailView(item);
    item._detailContent = '<div>Details</div>';

    grid.onRendered.notify({ startRow: 0, endRow: 20, grid });
    const panel = canvas.querySelector<HTMLElement>('.row-detail-1');

    expect(panel?.innerHTML).toBe('<div>Details</div>');
    expect(panel?.style.top).toBe('25px');
    expect(panel?.style.height).toBe('75px');
    plugin.collapseDetailView(item);
    expect(canvas.querySelector('.row-detail-1')).toBeNull();
  });

  it('cleans up subscriptions and mounted panels when destroyed', () => {
    init();
    plugin.expandDetailView(item);
    grid.onRendered.notify({ startRow: 0, endRow: 20, grid });
    expect(canvas.querySelector('.row-detail-1')).not.toBeNull();

    plugin.destroy();
    grid.onRendered.notify({ startRow: 0, endRow: 20, grid });

    expect(canvas.querySelector('.row-detail-1')).toBeNull();
  });
  describe('keyboard toggle', () => {
    let toggle: HTMLDivElement;

    beforeEach(() => {
      init();
      const cell = document.createElement('div');
      toggle = cell.appendChild(document.createElement('div'));
      toggle.dataset.rowDetailToggle = '';
      vi.mocked(grid.getCellNode).mockReturnValue(cell);
    });

    it('activates the toggle with Enter as well as Space', () => {
      const click = vi.spyOn(toggle, 'click');
      const event = keyEvent('Enter');

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);

      expect(click).toHaveBeenCalledOnce();
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
    });

    it('ignores keys other than Enter and Space', () => {
      const click = vi.spyOn(toggle, 'click');
      const event = keyEvent('a');

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);

      expect(click).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(grid.getCellNode).not.toHaveBeenCalled();
    });

    it('ignores Enter when the active cell is not the detail selector column', () => {
      const click = vi.spyOn(toggle, 'click');
      const event = keyEvent('Enter');

      grid.onKeyDown.notify({ row: 0, cell: 1, grid }, event);

      expect(click).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('ignores Enter while an editor is active', () => {
      editorLock.isActive.mockReturnValue(true);
      const click = vi.spyOn(toggle, 'click');
      const event = keyEvent('Enter');

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);

      expect(click).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('does nothing when the selector cell has no toggle (non-expandable row)', () => {
      vi.mocked(grid.getCellNode).mockReturnValueOnce(document.createElement('div'));
      const event = keyEvent(' ');

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    });

    it('handles a key typed outside any detail panel when the target has no closest()', () => {
      const click = vi.spyOn(toggle, 'click');
      const event = keyEvent('Enter', {} as EventTarget);

      grid.onKeyDown.notify({ row: 0, cell: 0, grid }, event);

      expect(click).toHaveBeenCalledOnce();
    });
  });

  describe('detail selector formatter', () => {
    it('renders an accessible collapse button for an expanded row, with the expandedClass', () => {
      plugin = new SlickRowDetailView({ ...options, expandedClass: 'is-open', collapsedClass: 'is-closed' });
      init();
      const formatter = plugin.getColumnDefinition().formatter!;
      const collapsed = formatter(0, 0, null, columns[0], item, grid) as HTMLElement;
      expect(collapsed.className).toBe('detailView-toggle expand is-closed');

      plugin.expandDetailView(item);
      const result = formatter(0, 0, null, columns[0], item, grid) as { html: HTMLElement };

      expect(result.html).toBeInstanceOf(HTMLElement);
      expect(result.html.className).toBe('detailView-toggle collapse is-open');
      expect(result.html.getAttribute('role')).toBe('button');
      expect(result.html.getAttribute('aria-label')).toBe('Collapse row details');
      expect(result.html.getAttribute('aria-expanded')).toBe('true');
      expect(result.html.dataset.rowDetailToggle).toBe('');
    });

    it('renders the expanded toggle without extra classes by default and nothing for padding rows', () => {
      init();
      plugin.expandDetailView(item);
      const formatter = plugin.getColumnDefinition().formatter!;

      const result = formatter(0, 0, null, columns[0], item, grid) as { html: HTMLElement };
      expect(result.html.className).toBe('detailView-toggle collapse ');
      expect(formatter(1, 0, null, columns[0], items[1], grid)).toBe('');
    });

    it('keeps existing metadata of an item already initialized by the formatter', () => {
      init();
      const formatter = plugin.getColumnDefinition().formatter!;
      formatter(0, 0, null, columns[0], item, grid);
      item._sizePadding = 7;

      formatter(0, 0, null, columns[0], item, grid);

      expect(item._sizePadding).toBe(7);
    });
  });

  describe('click toggle', () => {
    it('expands then collapses on successive selector clicks and reports the expanded rows after each toggle', () => {
      init();
      const after = vi.fn();
      plugin.onAfterRowDetailToggle.subscribe((_e, args) => after(args.expandedRows.map((row: DetailItem) => row.id)));
      formatterInit();

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));
      expect(plugin.getExpandedRows()).toEqual([item]);
      expect(items).toHaveLength(5);

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));
      expect(plugin.getExpandedRows()).toEqual([]);
      expect(items).toHaveLength(2);
      expect(after.mock.calls).toEqual([[[1]], [[]]]);
    });

    it('ignores clicks on the selector cell that are not on the toggle, and clicks on other columns', () => {
      init();
      const before = vi.fn();
      plugin.onBeforeRowDetailToggle.subscribe(before);
      formatterInit();

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(document.createElement('div')));
      grid.onClick.notify({ row: 0, cell: 1, grid }, clickEvent(toggleTarget()));

      expect(before).not.toHaveBeenCalled();
      expect(plugin.getExpandedRows()).toEqual([]);
    });

    it('does not toggle and stops the event when the active edit cannot be committed', () => {
      init();
      editorLock.isActive.mockReturnValue(true);
      editorLock.commitCurrentEdit.mockReturnValue(false);
      const event = clickEvent(toggleTarget());

      grid.onClick.notify({ row: 0, cell: 0, grid }, event);

      expect(plugin.getExpandedRows()).toEqual([]);
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
    });

    it('commits an active edit and then toggles', () => {
      init();
      formatterInit();
      editorLock.isActive.mockReturnValue(true);

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));

      expect(editorLock.commitCurrentEdit).toHaveBeenCalledOnce();
      expect(plugin.getExpandedRows()).toEqual([item]);
    });

    it('does not toggle rows rejected by an expandableOverride set after construction', () => {
      init();
      const override = vi.fn((row: number) => row !== 0);
      plugin.expandableOverride(override);
      const formatter = plugin.getColumnDefinition().formatter!;

      grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));

      expect(override).toHaveBeenCalledWith(0, item, grid);
      expect(plugin.getExpandedRows()).toEqual([]);
      expect(formatter(0, 0, null, columns[0], item, grid)).toBe('');
      expect(formatter(1, 0, null, columns[0], items[1], grid)).toBeInstanceOf(HTMLElement);
    });

    it('notifies the after-toggle event without toggling when a row click has no data item', () => {
      plugin = new SlickRowDetailView({ ...options, useRowClick: true });
      init();
      const after = vi.fn();
      plugin.onAfterRowDetailToggle.subscribe(after);

      grid.onClick.notify({ row: 99, cell: 1, grid }, clickEvent(document.createElement('div')));

      expect(after).toHaveBeenCalledOnce();
      expect(dataView.insertItem).not.toHaveBeenCalled();
    });

    function formatterInit() {
      plugin.getColumnDefinition().formatter!(0, 0, null, columns[0], item, grid);
    }
  });

  describe('expand and collapse', () => {
    it('builds padding rows that copy the parent column values and point back to the parent', () => {
      init();
      plugin.expandDetailView(item);

      expect(items.map((row) => row.id)).toEqual([1, '1.1', '1.2', '1.3', 2]);
      expect(items[2]).toEqual(expect.objectContaining({
        id: '1.2', name: 'First', _collapsed: true, _isPadding: true, _parent: item, _offset: 2,
      }));
      expect(plugin.getFilterItem(items[2])).toBe(item);
    });

    it('renders the preTemplate while the async process runs', () => {
      const preTemplate = vi.fn(() => '<span>Loading</span>');
      plugin = new SlickRowDetailView({ ...options, preTemplate });
      init();

      plugin.expandDetailView(item);

      expect(preTemplate).toHaveBeenCalledWith(item);
      expect(item._detailContent).toBe('<span>Loading</span>');
      expect(item._detailViewLoaded).toBe(false);
    });

    it('applies the postTemplate once a Promise-based process notifies its response', async () => {
      const process = vi.fn(async (row: DetailItem) => {
        await Promise.resolve();
        plugin.onAsyncResponse.notify({ item: { ...row, extra: 'loaded' }, grid });
      });
      plugin = new SlickRowDetailView({
        ...options,
        process,
        preTemplate: () => 'Loading',
        postTemplate: (row: DetailItem) => `<b>${row.extra}</b>`,
      });
      init();
      const asyncEnd = vi.fn();
      plugin.onAsyncEndUpdate.subscribe((_e, args) => asyncEnd(args.item));

      plugin.expandDetailView(item);
      expect(item._detailContent).toBe('Loading');
      await process.mock.results[0].value;

      const loaded = plugin.getExpandedRows()[0];
      expect(loaded).not.toBe(item);
      expect(loaded).toEqual(expect.objectContaining({ id: 1, extra: 'loaded', _detailContent: '<b>loaded</b>', _detailViewLoaded: true }));
      expect(items[0]).toBe(loaded);
      expect(asyncEnd).toHaveBeenCalledWith(loaded);
    });

    it('keeps the preTemplate when a Promise-based process rejects', async () => {
      const failure = Promise.reject(new Error('server down'));
      failure.catch(() => { /* handled by the caller's own code */ });
      const asyncEnd = vi.fn();
      plugin = new SlickRowDetailView({ ...options, process: vi.fn(() => failure), preTemplate: () => 'Loading' });
      init();
      plugin.onAsyncEndUpdate.subscribe(asyncEnd);

      expect(() => plugin.expandDetailView(item)).not.toThrow();
      await expect(failure).rejects.toThrow('server down');

      expect(item._detailContent).toBe('Loading');
      expect(item._detailViewLoaded).toBe(false);
      expect(plugin.getExpandedRows()).toEqual([item]);
      expect(asyncEnd).not.toHaveBeenCalled();
    });

    it('accepts the response as itemDetail and throws when the response has no item', () => {
      plugin = new SlickRowDetailView({ ...options, postTemplate: (row: DetailItem) => `<i>${row.name}</i>` });
      init();
      plugin.expandDetailView(item);
      const second = items[4];
      plugin.expandDetailView(second);

      plugin.onAsyncResponse.notify({ itemDetail: item, grid } as any);
      expect(item._detailContent).toBe('<i>First</i>');
      expect(plugin.getExpandedRows()).toEqual([item, second]);
      expect(second._detailViewLoaded).toBe(false);

      let thrown: unknown;
      try {
        plugin.onAsyncResponse.notify({ grid } as any);
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toMatch(/requires the onAsyncResponse\(\) to supply "args.item"/);
    });

    it('keeps only one row open when singleRowExpand is enabled', () => {
      plugin = new SlickRowDetailView({ ...options, singleRowExpand: true });
      init();
      const second = items[1];

      plugin.expandDetailView(item);
      plugin.expandDetailView(second);

      expect(plugin.getExpandedRows()).toEqual([second]);
      expect(item._collapsed).toBe(true);
      expect(items.map((row) => row.id)).toEqual([1, 2, '2.1', '2.2', '2.3']);
    });

    it('collapses every expanded row in a single data view update', () => {
      init();
      plugin.expandDetailView(item);
      plugin.expandDetailView(items[4]);
      vi.mocked(dataView.beginUpdate).mockClear();
      vi.mocked(dataView.endUpdate).mockClear();

      plugin.collapseAll();

      expect(plugin.getExpandedRows()).toEqual([]);
      expect(items.map((row) => row.id)).toEqual([1, 2]);
      expect(dataView.beginUpdate).toHaveBeenCalledOnce();
      expect(dataView.endUpdate).toHaveBeenCalledOnce();
    });

    it('does not collapse anything when setOptions leaves singleRowExpand off', () => {
      init();
      plugin.expandDetailView(item);

      plugin.setOptions({ panelRows: 4 });

      expect(plugin.getOptions().panelRows).toBe(4);
      expect(plugin.getExpandedRows()).toEqual([item]);
    });

    it('reloads the detail when it was marked loaded but has no content', () => {
      plugin = new SlickRowDetailView({ ...options, loadOnce: true, preTemplate: () => 'Loading' });
      init();
      item._detailViewLoaded = true;

      plugin.expandDetailView(item);

      expect(item._detailViewLoaded).toBe(false);
      expect(item._detailContent).toBe('Loading');
      expect(options.process).toHaveBeenCalledOnce();
    });

    it('reuses the saved detail view on re-expand when loadOnce is enabled', () => {
      plugin = new SlickRowDetailView({ ...options, loadOnce: true, preTemplate: () => 'Loading', postTemplate: (row: DetailItem) => `<p>${row.name}</p>` });
      init();
      plugin.expandDetailView(item);
      plugin.onAsyncResponse.notify({ item, grid });
      mountPanels();
      panelOf(1)!.querySelector('p')!.textContent = 'Edited';

      plugin.collapseDetailView(item);
      expect(item._detailContent).toBe('<p>Edited</p>');
      expect(panelOf(1)).toBeNull();

      const asyncResponse = vi.fn();
      plugin.onAsyncResponse.subscribe((_e, args) => asyncResponse(args.detailView));
      plugin.expandDetailView(item);

      expect(options.process).toHaveBeenCalledOnce();
      expect(asyncResponse).toHaveBeenCalledWith('<p>Edited</p>');
      expect(item._detailContent).toBe('<p>Edited</p>');
      expect(items.map((row) => row.id)).toEqual([1, '1.1', '1.2', '1.3', 2]);
    });

    it('stores all plugin metadata under a custom keyPrefix', () => {
      plugin = new SlickRowDetailView({ ...options, keyPrefix: '__' });
      init();

      plugin.expandDetailView(item);

      expect(item).toEqual(expect.objectContaining({ __collapsed: false, __sizePadding: 3, __height: 75 }));
      expect(item._collapsed).toBeUndefined();
      expect(items[1]).toEqual(expect.objectContaining({ __isPadding: true, __parent: item, __offset: 1 }));
      expect(plugin.getFilterItem(items[1])).toBe(item);

      plugin.collapseDetailView(item);
      expect(item.__collapsed).toBe(true);
      expect(items).toHaveLength(2);
    });

    it('uses the data view id property name once items are set', () => {
      init();
      vi.mocked(dataView.getIdPropertyName).mockReturnValue('uid');
      dataView.onSetItemsCalled.notify({ idProperty: 'uid', itemCount: 2 } as any);
      item.uid = 'u1';

      plugin.expandDetailView(item);
      expect(dataView.insertItem).toHaveBeenCalledWith(expect.any(Number), expect.objectContaining({ uid: 'u1.1' }));

      plugin.collapseDetailView(item);
      expect(dataView.deleteItem).toHaveBeenCalledWith('u1.1');
      expect(plugin.getExpandedRows()).toEqual([]);
    });
  });

  describe('overlay panels', () => {
    it('renders an HTMLElement detail content as a child of the panel', () => {
      init();
      plugin.expandDetailView(item);
      const content = document.createElement('section');
      item._detailContent = content;

      mountPanels();

      expect(panelOf(1)!.firstChild).toBe(content);
    });

    it('re-renders the panel content only when the detail content changes', () => {
      init();
      plugin.expandDetailView(item);
      item._detailContent = 'first';
      mountPanels();
      const panel = panelOf(1)!;
      const input = panel.appendChild(document.createElement('input'));

      mountPanels();
      expect(panel.contains(input)).toBe(true);

      item._detailContent = 'second';
      mountPanels();
      expect(panelOf(1)).toBe(panel);
      expect(panel.innerHTML).toBe('second');
      expect(grid.sanitizeHtmlString).toHaveBeenLastCalledWith('second');
    });

    it('removes the panel when its padding rows leave the rendered range and remounts it when they return', () => {
      init();
      plugin.expandDetailView(item);
      mountPanels();
      expect(panelOf(1)).not.toBeNull();

      vi.mocked(grid.getRenderedRange).mockReturnValue({ top: 10, bottom: 30, leftPx: 0, rightPx: 600 });
      mountPanels();
      expect(panelOf(1)).toBeNull();

      vi.mocked(grid.getRenderedRange).mockReturnValue({ top: 3, bottom: 30, leftPx: 0, rightPx: 600 });
      mountPanels();
      expect(panelOf(1)).not.toBeNull();
    });

    it('removes the panel of an expanded row that is no longer in the data view', () => {
      init();
      plugin.expandDetailView(item);
      mountPanels();

      items.splice(0, 4);
      mountPanels();

      expect(panelOf(1)).toBeNull();
    });

    it('skips rendering when the grid has no canvas', () => {
      init();
      plugin.expandDetailView(item);
      vi.mocked(grid.getCanvases).mockReturnValueOnce([] as any);

      mountPanels();

      expect(panelOf(1)).toBeNull();
    });

    it('falls back to the row top when the first padding cell has no node box', () => {
      init();
      plugin.expandDetailView(item);
      vi.mocked(grid.getCellNodeBox).mockReturnValueOnce(null);
      vi.mocked(grid.getRowTop).mockReturnValueOnce(40);

      mountPanels();

      expect(panelOf(1)!.style.top).toBe('40px');
    });

    it('anchors the panel to the visible part of the canvas', () => {
      init();
      plugin.expandDetailView(item);
      const viewportRect = vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue({ left: 100 } as DOMRect);
      const canvasRect = vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: -50 } as DOMRect);

      try {
        mountPanels();
        expect(panelOf(1)!.style.left).toBe('150px');
        expect(panelOf(1)!.style.width).toBe('500px');
      } finally {
        viewportRect.mockRestore();
        canvasRect.mockRestore();
      }
    });

    it('re-renders the panels on a horizontal scroll only', () => {
      init();
      plugin.expandDetailView(item);
      mountPanels();
      grid.onScroll.notify({ scrollLeft: 0, scrollTop: 0, grid } as any);
      const panel = panelOf(1)!;

      panel.remove();
      grid.onScroll.notify({ scrollLeft: 0, scrollTop: 50, grid } as any);
      expect(panel.isConnected).toBe(false);

      grid.onScroll.notify({ scrollLeft: 120, scrollTop: 50, grid } as any);
      expect(panel.parentElement).toBe(canvas);

      panel.remove();
      grid.onScroll.notify({ scrollLeft: 120, scrollTop: 80, grid } as any);
      expect(panel.isConnected).toBe(false);
    });
  });

  describe('saveDetailView and resizeDetailView', () => {
    it('saves the mounted panel HTML into the item without re-rendering the live panel', () => {
      init();
      plugin.expandDetailView(item);
      item._detailContent = '<input>';
      mountPanels();
      const input = panelOf(1)!.querySelector('input')!;
      input.setAttribute('value', 'typed');

      plugin.saveDetailView(item);
      mountPanels();

      expect(item._detailContent).toBe('<input value="typed">');
      expect(panelOf(1)!.querySelector('input')).toBe(input);
    });

    it('leaves the item untouched when its panel is not mounted', () => {
      init();
      plugin.expandDetailView(item);
      item._detailContent = 'original';

      plugin.saveDetailView(item);

      expect(item._detailContent).toBe('original');
    });

    it('ignores resize requests without an item or a mounted panel', () => {
      init();
      plugin.expandDetailView(item);
      vi.mocked(dataView.deleteItem).mockClear();

      plugin.resizeDetailView(undefined);
      plugin.resizeDetailView(item);

      expect(dataView.deleteItem).not.toHaveBeenCalled();
      expect(item._sizePadding).toBe(3);
    });

    it('recomputes padding rows from the panel content height and grows the row buffer', () => {
      init();
      plugin.expandDetailView(item);
      item._detailContent = '<div>Tall</div>';
      mountPanels();
      const panel = panelOf(1)!;
      panel.scrollTop = 0;
      Object.defineProperty(panel, 'scrollHeight', { configurable: true, value: 200 });

      plugin.resizeDetailView(item);

      // 200px / 25px = 8 rows -> ceil(8 * 2 * 13 / 25) = 9 padding rows
      expect(item._sizePadding).toBe(9);
      expect(item._height).toBe(200);
      expect(items).toHaveLength(11);
      expect(items[9]).toEqual(expect.objectContaining({ id: '1.9', _parent: item }));
      expect(gridOptions.minRowBuffer).toBe(12);
      expect(panel.style.top).toBe('25px');
      expect(panel.style.height).toBe('225px');
      expect(item._detailContent).toBe('<div>Tall</div>');
    });

    it('caps resized padding with maxRows and keeps the row buffer when it is large enough', () => {
      plugin = new SlickRowDetailView({ ...options, maxRows: 2 });
      init();
      plugin.expandDetailView(item);
      mountPanels();
      Object.defineProperty(panelOf(1)!, 'scrollHeight', { configurable: true, value: 500 });

      plugin.resizeDetailView(item);

      expect(item._sizePadding).toBe(2);
      expect(items.map((row) => row.id)).toEqual([1, '1.1', '1.2', 2]);
      expect(gridOptions.minRowBuffer).toBe(5);
      expect(panelOf(1)!.style.height).toBe('50px');
    });
  });

  describe('viewport range notifications', () => {
    const scrollTo = (top: number, bottom: number) => {
      vi.mocked(grid.getRenderedRange).mockReturnValue({ top, bottom, leftPx: 0, rightPx: 600 });
      grid.onScroll.notify({ scrollLeft: 0, scrollTop: top * 25, grid } as any);
    };

    it('notifies when a row scrolls out of the top and comes back when scrolling up', () => {
      vi.useFakeTimers();
      init();
      plugin.expandDetailView(item);
      mountPanels();
      const out = vi.fn();
      const back = vi.fn();
      plugin.onRowOutOfViewportRange.subscribe((_e, args) => out({ rowId: args.rowId, rowIndex: args.rowIndex, ids: [...args.rowIdsOutOfViewport] }));
      plugin.onRowBackToViewportRange.subscribe((_e, args) => back({ rowId: args.rowId, ids: [...args.rowIdsOutOfViewport] }));

      scrollTo(10, 30);
      expect(out).toHaveBeenCalledWith({ rowId: 1, rowIndex: 0, ids: [1] });

      scrollTo(10, 30);
      expect(out).toHaveBeenCalledOnce();

      scrollTo(0, 20);
      mountPanels(); // the grid renders after the scroll and remounts the panel
      expect(back).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(back).toHaveBeenCalledWith({ rowId: 1, ids: [] });
    });

    it('does not report a row back in range until its panel exists in the DOM', () => {
      vi.useFakeTimers();
      init();
      plugin.expandDetailView(item);
      const back = vi.fn();
      plugin.onRowBackToViewportRange.subscribe(back);

      scrollTo(10, 30);
      scrollTo(0, 20);
      vi.advanceTimersByTime(100);

      expect(back).not.toHaveBeenCalled();
    });

    it('notifies when a row scrolls out of the bottom while scrolling up and back in while scrolling down', () => {
      vi.useFakeTimers();
      init();
      const second = items[1];
      plugin.expandDetailView(second);
      const out = vi.fn();
      const back = vi.fn();
      plugin.onRowOutOfViewportRange.subscribe((_e, args) => out(args.rowId));
      plugin.onRowBackToViewportRange.subscribe((_e, args) => back(args.rowId));

      scrollTo(0, 20);
      expect(out).not.toHaveBeenCalled();

      scrollTo(0, 3);
      expect(out).toHaveBeenCalledWith(2);

      scrollTo(1, 8);
      mountPanels();
      vi.advanceTimersByTime(100);
      expect(back).toHaveBeenCalledWith(2);
    });

    it('saves the detail view of rows near the buffer edge when saveDetailViewOnScroll is on', () => {
      init();
      plugin.expandDetailView(item);
      item._detailContent = 'initial';
      mountPanels();
      panelOf(1)!.innerHTML = 'edited';

      scrollTo(2, 22);

      expect(item._detailContent).toBe('edited');
    });

    it('does not save the detail view on scroll when saveDetailViewOnScroll is off', () => {
      plugin = new SlickRowDetailView({ ...options, saveDetailViewOnScroll: false });
      init();
      plugin.expandDetailView(item);
      item._detailContent = 'initial';
      mountPanels();
      panelOf(1)!.innerHTML = 'edited';

      scrollTo(2, 22);
      scrollTo(0, 2);

      expect(item._detailContent).toBe('initial');
    });

    it('uses the rendered row count with useSimpleViewportCalc', () => {
      vi.useFakeTimers();
      plugin = new SlickRowDetailView({ ...options, useSimpleViewportCalc: true });
      init();
      plugin.expandDetailView(item);
      grid.onRendered.notify({ startRow: 0, endRow: 10, grid });
      const out = vi.fn();
      const back = vi.fn();
      plugin.onRowOutOfViewportRange.subscribe((_e, args) => out([...args.rowIdsOutOfViewport]));
      plugin.onRowBackToViewportRange.subscribe((_e, args) => back([...args.rowIdsOutOfViewport]));

      // |bottom - rowBuffer(4) - rowIndex(0)| must exceed twice the 10 rendered rows
      scrollTo(5, 24);
      expect(out).not.toHaveBeenCalled();

      scrollTo(30, 50);
      expect(out).toHaveBeenCalledWith([1]);

      scrollTo(0, 20);
      mountPanels();
      vi.advanceTimersByTime(100);
      expect(back).toHaveBeenCalledWith([]);
    });

    it('ignores rendered events without an end row for the simple viewport calculation', () => {
      plugin = new SlickRowDetailView({ ...options, useSimpleViewportCalc: true });
      init();
      plugin.expandDetailView(item);
      grid.onRendered.notify({ startRow: 0, endRow: 0, grid });
      const out = vi.fn();
      plugin.onRowOutOfViewportRange.subscribe(out);

      // with no rendered row count every row away from the bottom edge is out of range
      scrollTo(0, 5);

      expect(out).toHaveBeenCalledOnce();
    });
  });

  it('stops reacting to grid and data view events once destroyed', () => {
    init();
    plugin.getColumnDefinition().formatter!(0, 0, null, columns[0], item, grid);

    plugin.destroy();
    grid.onClick.notify({ row: 0, cell: 0, grid }, clickEvent(toggleTarget()));
    dataView.onRowCountChanged.notify({ previous: 2, current: 2, itemCount: 2, dataView, callingOnRowsChanged: false });

    expect(plugin.getExpandedRows()).toEqual([]);
    expect(grid.updateRowCount).not.toHaveBeenCalled();
  });
});
