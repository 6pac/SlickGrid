import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickState } from '../slick.state';
import type { CurrentState, SlickStateOption } from '../slick.state';

const columns: Column[] = [
  { id: 'firstName', field: 'firstName', name: 'First Name', width: 120 },
  { id: 'lastName', field: 'lastName', name: 'Last Name', width: 160 },
  { id: 'age', field: 'age', name: 'Age', width: 70 },
];

const defaultViewport = { top: 4, bottom: 18, leftPx: 0, rightPx: 900 };
const grid = {
  cid: 'customer-grid',
  getColumns: vi.fn(() => columns),
  getPubSubService: vi.fn(),
  getSortColumns: vi.fn(() => [{ columnId: 'age', sortAsc: false }]),
  getViewport: vi.fn(() => defaultViewport),
  scrollRowIntoView: vi.fn(),
  setColumns: vi.fn(),
  setSortColumns: vi.fn(),
  onColumnsResized: new SlickEvent(),
  onColumnsReordered: new SlickEvent(),
  onSort: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickState', () => {
  let plugin: SlickState;
  let storage: SlickStateOption['storage'];

  beforeEach(() => {
    vi.clearAllMocks();
    storage = {
      get: vi.fn(async () => ({} as CurrentState)),
      set: vi.fn(),
    } as unknown as SlickStateOption['storage'];
    plugin = new SlickState({ storage });
  });

  afterEach(() => {
    plugin.destroy();
  });

  it('exposes the State plugin name and initializes with the grid client id', () => {
    plugin.init(grid);

    expect(plugin.pluginName).toBe('State');
    expect(plugin.getUserData()).toBeNull();
  });

  it('saves the current sort, column layout, viewport, and user data', () => {
    plugin.init(grid);
    plugin.setUserData({ filter: 'active' });
    const stateChanged = vi.fn();
    plugin.onStateChanged.subscribe((_event: SlickEventData, state: CurrentState) => stateChanged(state));

    plugin.save();

    expect(storage.set).toHaveBeenCalledWith('slickgrid:customer-grid', {
      sortcols: [{ columnId: 'age', sortAsc: false }],
      viewport: defaultViewport,
      columns: [
        { id: 'firstName', width: 120, hidden: undefined },
        { id: 'lastName', width: 160, hidden: undefined },
        { id: 'age', width: 70, hidden: undefined },
      ],
      userData: { filter: 'active' },
    });
    expect(stateChanged).toHaveBeenCalledOnce();
    expect(plugin.getStateUserData()).toEqual({ filter: 'active' });
  });

  it('saves automatically when columns resize, reorder, or sort', () => {
    plugin.init(grid);

    grid.onColumnsResized.notify({ triggeredByColumn: 'firstName', grid });
    grid.onColumnsReordered.notify({ impactedColumns: columns, previousColumnOrder: ['firstName', 'lastName', 'age'], grid });
    grid.onSort.notify({ columnId: 'age', sortAsc: false });

    expect(storage.set).toHaveBeenCalledTimes(3);
  });

  it('restores sort, viewport position, and columns from saved state', async () => {
    const savedState: CurrentState = {
      sortcols: [{ columnId: 'lastName', sortAsc: true }],
      viewport: { top: 9, bottom: 25, leftPx: 10, rightPx: 700 },
      columns: [
        { id: 'age', width: 90, hidden: false, headerCssClass: 'age-header' } as CurrentState['columns'][number],
        { id: 'firstName', width: 140, hidden: true },
      ],
      userData: { selectedTeam: 'blue' },
    };
    vi.mocked(storage.get).mockResolvedValue(savedState);
    plugin = new SlickState({ storage, defaultColumns: columns });
    plugin.init(grid);

    await expect(plugin.restore()).resolves.toBe(savedState);

    expect(grid.setSortColumns).toHaveBeenCalledWith(savedState.sortcols);
    expect(grid.scrollRowIntoView).toHaveBeenCalledWith(9, true);
    expect(grid.setColumns).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'age', width: 90, hidden: false, headerCssClass: 'age-header', field: 'age' }),
      expect.objectContaining({ id: 'firstName', width: 140, hidden: true, field: 'firstName' }),
      expect.objectContaining({ id: 'lastName', hidden: true, field: 'lastName' }),
    ]);
    expect(plugin.getStateUserData()).toEqual({ selectedTeam: 'blue' });
    expect(plugin.getUserData()).toEqual({ selectedTeam: 'blue' });
  });

  it('does not scroll during restore when scrollRowIntoView is disabled', async () => {
    vi.mocked(storage.get).mockResolvedValue({
      sortcols: [],
      viewport: defaultViewport,
      columns: [],
      userData: null,
    });
    plugin = new SlickState({ storage, scrollRowIntoView: false, defaultColumns: columns });
    plugin.init(grid);

    await plugin.restore();

    expect(grid.scrollRowIntoView).not.toHaveBeenCalled();
  });

  it('resolves an empty state without applying grid changes', async () => {
    vi.mocked(storage.get).mockResolvedValue({} as CurrentState);
    plugin.init(grid);

    await expect(plugin.restore()).resolves.toEqual({});

    expect(grid.setSortColumns).not.toHaveBeenCalled();
    expect(grid.setColumns).not.toHaveBeenCalled();
  });

  it('rejects restore when the grid has no client id', async () => {
    const gridWithoutClientId = { ...grid, cid: undefined } as unknown as SlickGrid;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    plugin = new SlickState({ storage });
    plugin.init(gridWithoutClientId);

    await expect(plugin.restore()).rejects.toBe('missing client id');
    expect(storage.get).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith('grid has no client id. state persisting is disabled.');
    warn.mockRestore();
  });

  it('propagates storage read failures from restore', async () => {
    const error = new Error('storage unavailable');
    vi.mocked(storage.get).mockRejectedValue(error);
    plugin.init(grid);

    await expect(plugin.restore()).rejects.toBe(error);
  });

  it('resets persisted state and user data', () => {
    plugin.init(grid);
    plugin.setUserData({ page: 3 });

    plugin.reset();

    expect(storage.set).toHaveBeenCalledWith('slickgrid:customer-grid', {});
    expect(plugin.getUserData()).toBeNull();
    expect(plugin.getStateUserData()).toBeNull();
  });

  it('restores user data to its last saved value', () => {
    plugin.init(grid);
    plugin.setUserData({ mode: 'compact' });
    plugin.save();
    plugin.setUserData({ mode: 'expanded' });

    plugin.resetUserData();

    expect(plugin.getUserData()).toEqual({ mode: 'compact' });
  });

  it('saves on destroy when a client id is available', () => {
    plugin.init(grid);

    plugin.destroy();

    expect(storage.set).toHaveBeenCalledWith('slickgrid:customer-grid', expect.any(Object));
  });

  it('does not save when initialized without a client id', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const gridWithoutClientId = { ...grid, cid: undefined } as unknown as SlickGrid;
    plugin = new SlickState({ storage });
    plugin.init(gridWithoutClientId);

    expect(plugin.save()).toBeUndefined();
    expect(storage.set).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith('grid has no client id. state persisting is disabled.');
    warn.mockRestore();
  });
});
