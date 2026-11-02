import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, Grouping } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickDraggableGrouping } from '../slick.draggablegrouping';

const gridUid = 'slickgrid12345';
const columns: Column[] = [
  { id: 'firstName', field: 'firstName', name: 'First Name', grouping: { getter: 'firstName' }, sortable: true },
  { id: 'age', field: 'age', name: 'Age', grouping: { getter: 'age' }, sortable: true },
  { id: 'city', field: 'city', name: 'City' },
];

const dataView = {
  collapseAllGroups: vi.fn(),
  expandAllGroups: vi.fn(),
  setGrouping: vi.fn(),
};

const grid = {
  getContainerNode: vi.fn(),
  getData: vi.fn(() => dataView),
  getEditorLock: vi.fn(() => ({ commitCurrentEdit: vi.fn(() => true) })),
  getHeaderColumn: vi.fn(),
  getPreHeaderPanel: vi.fn(),
  getTopHeaderPanel: vi.fn(() => null),
  getColumns: vi.fn(() => columns),
  getPubSubService: vi.fn(),
  getUID: () => gridUid,
  updateColumnHeader: vi.fn(),
  onHeaderCellRendered: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickDraggableGrouping', () => {
  let plugin: SlickDraggableGrouping;
  let gridContainer: HTMLDivElement;
  let dropzone: HTMLDivElement;
  let headerNodes: Map<string, HTMLDivElement>;

  const makeHeader = (column: Column) => {
    const header = document.createElement('div');
    header.dataset.id = `${gridUid}${column.id}`;
    const name = document.createElement('span');
    name.className = 'slick-column-name';
    name.textContent = typeof column.name === 'string' ? column.name : String(column.id);
    header.appendChild(name);
    return header;
  };

  const getPillNames = () => Array.from(dropzone.querySelectorAll('.slick-dropped-grouping-title')).map((node) => node.textContent);

  beforeEach(() => {
    vi.clearAllMocks();
    gridContainer = document.createElement('div');
    gridContainer.className = `slickgrid-container ${gridUid}`;
    dropzone = document.createElement('div');
    dropzone.className = 'slick-preheader-panel';
    gridContainer.appendChild(dropzone);
    document.body.appendChild(gridContainer);
    headerNodes = new Map(columns.map((column) => [String(column.id), makeHeader(column)]));

    vi.mocked(grid.getContainerNode).mockReturnValue(gridContainer);
    vi.mocked(grid.getPreHeaderPanel).mockReturnValue(dropzone);
    vi.mocked(grid.getTopHeaderPanel).mockReturnValue(null as unknown as HTMLDivElement);
    vi.mocked(grid.getHeaderColumn).mockImplementation((id) => headerNodes.get(String(id)) ?? (null as unknown as HTMLDivElement));
    plugin = new SlickDraggableGrouping({});
  });

  afterEach(() => {
    plugin.destroy();
    document.body.innerHTML = '';
  });

  it('initializes with the grid and adds the grouping dropzone elements', () => {
    plugin.init(grid);

    expect(dropzone.classList.contains('slick-dropzone')).toBe(true);
    expect(dropzone.querySelector('.slick-placeholder')?.textContent).toBe('Drop a column header here to group by the column');
    expect(dropzone.querySelector('.slick-group-toggle-all')).toBeTruthy();
    expect(grid.updateColumnHeader).toHaveBeenCalledWith('firstName');
    expect(grid.updateColumnHeader).toHaveBeenCalledWith('age');
    expect(grid.updateColumnHeader).toHaveBeenCalledWith('city');
  });

  it('requires a visible pre-header or top-header panel', () => {
    vi.mocked(grid.getPreHeaderPanel).mockReturnValue(null as unknown as HTMLDivElement);

    expect(() => plugin.init(grid)).toThrow(/requires the pre-header to be created and shown/);
  });

  it('uses the configured drop placeholder', () => {
    plugin = new SlickDraggableGrouping({ dropPlaceHolderText: 'Drag columns here' });
    plugin.init(grid);

    expect(dropzone.querySelector('.slick-placeholder')?.textContent).toBe('Drag columns here');
  });

  it('adds the configured grouping icon to groupable header cells', () => {
    plugin = new SlickDraggableGrouping({ groupIconCssClass: 'icon icon-drag' });
    plugin.init(grid);
    const header = document.createElement('div');
    grid.onHeaderCellRendered.notify({ column: columns[0], node: header, grid });

    expect(header.style.cursor).toBe('pointer');
    expect(header.querySelector('.slick-column-groupable')?.classList.contains('icon-drag')).toBe(true);
  });

  it('does not add a grouping icon to columns without grouping configuration', () => {
    plugin = new SlickDraggableGrouping({ groupIconCssClass: 'icon-drag' });
    plugin.init(grid);
    const header = document.createElement('div');
    grid.onHeaderCellRendered.notify({ column: columns[2], node: header, grid });

    expect(header.querySelector('.slick-column-groupable')).toBeNull();
    expect(header.style.cursor).toBe('');
  });

  it('adds a group from a column header and publishes the grouping change', () => {
    plugin.init(grid);
    const changed = vi.fn();
    plugin.onGroupChanged.subscribe((_event: SlickEventData, args: { caller?: string; groupColumns: Grouping[] }) => changed(args));

    plugin.setDroppedGroups('firstName');

    expect(getPillNames()).toEqual(['First Name']);
    expect(dataView.setGrouping).toHaveBeenCalledWith([columns[0].grouping]);
    expect(changed).toHaveBeenCalledWith({ caller: 'add-group', groupColumns: [columns[0].grouping] });
    expect(dropzone.querySelector('.slick-placeholder')?.getAttribute('style')).toContain('display: none');
  });

  it('ignores duplicate groups and columns that are not groupable', () => {
    plugin.init(grid);

    plugin.setDroppedGroups(['firstName', 'firstName', 'city']);

    expect(getPillNames()).toEqual(['First Name']);
    expect(dataView.setGrouping).toHaveBeenCalledTimes(1);
  });

  it('adds multiple groups in the requested order', () => {
    plugin.init(grid);

    plugin.setDroppedGroups(['age', 'firstName']);

    expect(getPillNames()).toEqual(['Age', 'First Name']);
    expect(dataView.setGrouping).toHaveBeenLastCalledWith([columns[1].grouping, columns[0].grouping]);
  });

  it('removes a group when its remove control is clicked', () => {
    plugin.init(grid);
    plugin.setDroppedGroups('firstName');

    dropzone.querySelector<HTMLElement>('.slick-groupby-remove')?.click();

    expect(getPillNames()).toEqual([]);
    expect(dataView.setGrouping).toHaveBeenLastCalledWith([]);
    expect(dropzone.querySelector('.slick-placeholder')?.getAttribute('style')).toContain('display: block');
  });

  it('clears all groups and restores the placeholder', () => {
    plugin.init(grid);
    plugin.setDroppedGroups(['firstName', 'age']);

    plugin.clearDroppedGroups();

    expect(getPillNames()).toEqual([]);
    expect(dataView.setGrouping).toHaveBeenLastCalledWith([]);
    expect(dropzone.querySelector('.slick-placeholder')?.getAttribute('style')).toContain('display: inline-block');
    expect(dropzone.querySelector('.slick-group-toggle-all')?.getAttribute('style')).toContain('display: none');
  });

  it('toggles all groups from the group toggle control', () => {
    plugin.init(grid);
    plugin.setDroppedGroups('firstName');
    const toggle = dropzone.querySelector<HTMLDivElement>('.slick-group-toggle-all')!;

    toggle.click();
    expect(toggle.classList.contains('collapsed')).toBe(true);
    expect(dataView.collapseAllGroups).toHaveBeenCalledOnce();

    toggle.click();
    expect(toggle.classList.contains('expanded')).toBe(true);
    expect(dataView.expandAllGroups).toHaveBeenCalledOnce();
  });

  it('removes listeners and grouping UI when destroyed', () => {
    plugin.init(grid);

    plugin.destroy();

    expect(dropzone.children).toHaveLength(0);
  });
});
