import { beforeEach, describe, expect, it, vi } from 'vitest';
import { keyCode, SlickEvent, SlickEventData, SlickGroup } from '../slick.core';
import { SlickGroupItemMetadataProvider } from '../slick.groupitemmetadataprovider';

describe('SlickGroupItemMetadataProvider', () => {
  let provider: SlickGroupItemMetadataProvider;
  let group: SlickGroup;
  let dataView: any;
  let grid: any;

  beforeEach(() => {
    group = Object.assign(new SlickGroup(), { level: 2, title: 'Group', groupingKey: 'category', collapsed: false, rows: [{ id: 1 }, { id: 2 }] });
    dataView = { expandGroup: vi.fn(), collapseGroup: vi.fn(), setRefreshHints: vi.fn(), getIdProperty: () => 'id', getAllSelectedIds: vi.fn(() => [2, 3]), setSelectedRowIds: vi.fn() };
    grid = { getData: () => dataView, getDataItem: () => group, getActiveCell: () => ({ row: 0, cell: 0 }), getRenderedRange: () => ({ top: 4, bottom: 8 }), applyHtmlCode: (el: HTMLElement, value: string) => { el.textContent = value; }, onClick: new SlickEvent(), onKeyDown: new SlickEvent() };
    provider = new SlickGroupItemMetadataProvider();
    provider.init(grid);
  });

  it('formats expanded and collapsed groups with configured indentation and title', () => {
    const formatter = provider.getOptions().groupFormatter!;
    const expanded = formatter(0, 0, null, {} as any, group, grid) as DocumentFragment;
    expect(expanded.querySelector('.slick-group-toggle')?.getAttribute('aria-expanded')).toBe('true');
    expect((expanded.firstElementChild as HTMLElement).style.marginLeft).toBe('30px');
    expect(expanded.querySelector('.slick-group-title')?.textContent).toBe('Group');
    group.collapsed = true;
    const collapsed = formatter(0, 0, null, {} as any, group, grid) as DocumentFragment;
    expect(collapsed.querySelector('.slick-group-toggle')?.getAttribute('aria-expanded')).toBe('false');
    provider.setOptions({ enableExpandCollapse: false });
    expect(formatter(0, 0, null, {} as any, group, grid)).toBe('Group');
  });

  it('formats group checkbox state and appends an HTMLElement title', () => {
    provider.setOptions({ checkboxSelect: true });
    group.selectChecked = true;
    const title = document.createElement('strong');
    title.textContent = 'HTML title';

    const checked = provider.getOptions().groupFormatter!(0, 0, null, {} as any, { ...group, title }, grid) as DocumentFragment;
    expect(checked.querySelector('.slick-group-select-checkbox')?.classList.contains('checked')).toBe(true);
    expect(checked.querySelector('.slick-group-title strong')).toBe(title);

    group.selectChecked = false;
    const unchecked = provider.getOptions().groupFormatter!(0, 0, null, {} as any, { ...group, title }, grid) as DocumentFragment;
    expect(unchecked.querySelector('.slick-group-select-checkbox')?.classList.contains('unchecked')).toBe(true);
  });

  it('unsubscribes grid events when destroyed and handles destroy before initialization', () => {
    const clickUnsubscribe = vi.spyOn(grid.onClick, 'unsubscribe');
    const keyDownUnsubscribe = vi.spyOn(grid.onKeyDown, 'unsubscribe');
    provider.destroy();
    expect(clickUnsubscribe).toHaveBeenCalledOnce();
    expect(keyDownUnsubscribe).toHaveBeenCalledOnce();

    const uninitializedProvider = new SlickGroupItemMetadataProvider();
    expect(() => uninitializedProvider.destroy()).not.toThrow();
  });

  it('provides group and totals metadata and delegates the totals formatter', () => {
    const metadata = provider.getGroupRowMetadata(group as any);
    expect(metadata).toMatchObject({ selectable: false, focusable: true, cssClasses: 'slick-group slick-group-level-2', columns: { 0: { colspan: '*' } } });
    expect(provider.getTotalsRowMetadata({ group: group as any })).toMatchObject({ focusable: false, cssClasses: 'slick-group-totals slick-group-level-2' });
    const totals = provider.getOptions().totalsFormatter!;
    const column = { groupTotalsFormatter: vi.fn(() => 'total') } as any;
    expect(totals(0, 0, null, column, group, grid)).toBe('total');
    expect(totals(0, 0, null, {} as any, group, grid)).toBe('');
    provider.setOptions({ includeHeaderTotals: true });
    expect(provider.getGroupRowMetadata(group as any).columns?.[0]?.colspan).toBe('1');
  });

  it('toggles groups by click and the configured key code and preserves the rendered range hint', () => {
    const target = document.createElement('span');
    target.className = 'slick-group-toggle';
    const click = Object.assign(new SlickEventData(), { target, preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });
    grid.onClick.notify({ row: 0, cell: 0, grid }, click);
    expect(dataView.setRefreshHints).toHaveBeenCalledWith({ ignoreDiffsBefore: 4, ignoreDiffsAfter: 9 });
    expect(dataView.collapseGroup).toHaveBeenCalledWith('category');
    group.collapsed = true;
    const key = Object.assign(new SlickEventData(), { which: keyCode.SPACE, preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });
    grid.onKeyDown.notify({ row: 0, cell: 0, grid }, key);
    expect(dataView.expandGroup).toHaveBeenCalledWith('category');
    expect(key.preventDefault).toHaveBeenCalled();
  });

  it('selects and deselects group members without losing other selected ids', () => {
    const target = document.createElement('span');
    target.className = 'slick-group-select-checkbox unchecked';
    const event = Object.assign(new SlickEventData(), { target });
    grid.onClick.notify({ row: 0, cell: 0, grid }, event);
    expect(dataView.setSelectedRowIds).toHaveBeenCalledWith([2, 3, 1]);
    dataView.getAllSelectedIds.mockReturnValue([1, 2, 3]);
    grid.onClick.notify({ row: 0, cell: 0, grid }, event);
    expect(dataView.setSelectedRowIds).toHaveBeenLastCalledWith([3]);
  });
});
