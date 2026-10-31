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
    item = items[0];
    options = { panelRows: 2, process: vi.fn().mockResolvedValue(undefined) };
    plugin = new SlickRowDetailView(options);
    canvas.replaceChildren();
  });

  afterEach(() => {
    plugin.destroy();
    canvas.replaceChildren();
  });

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
    expect(item._collapsed).toBe(true);
    expect(formatter(0, 0, null, columns[0], { ...item, _isPadding: true }, grid)).toBe('');

    plugin.destroy();
    plugin = new SlickRowDetailView({ ...options, expandableOverride: () => false });
    expect(plugin.getColumnDefinition().formatter!(0, 0, null, columns[0], item, grid)).toBe('');
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
});
