import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SlickEvent, SlickGlobalEditorLock } from '../../slick.core.js';
import { SlickGridPager } from '../slick.pager.js';

describe('SlickGridPager', () => {
  let container: HTMLDivElement;
  let dataView: any;
  let grid: any;
  let pagingInfo: any;
  let pager: SlickGridPager;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    pagingInfo = { pageSize: 10, pageNum: 1, totalRows: 45, totalPages: 5 };
    dataView = {
      getPagingInfo: vi.fn(() => pagingInfo),
      setPagingOptions: vi.fn(),
      setRefreshHints: vi.fn(),
      onPagingInfoChanged: new SlickEvent(),
    };
    grid = { getViewport: vi.fn(() => ({ top: 0, bottom: 20 })) };
  });

  afterEach(() => {
    pager?.destroy();
    container.remove();
    vi.restoreAllMocks();
  });

  const createPager = (options?: any, element: HTMLElement | string = container) => {
    pager = new SlickGridPager(dataView, grid, element, options);
    return pager;
  };

  it('builds the pager and renders page status and enabled navigation', () => {
    createPager();
    expect(container.querySelector('.slick-pager-status')?.textContent).toBe('Showing page 2 of 5');
    expect(container.querySelector('.sgi-chevron-start')?.classList.contains('sgi-state-disabled')).toBe(false);
    expect(container.querySelector('.sgi-chevron-left')?.classList.contains('sgi-state-disabled')).toBe(false);
    expect(container.querySelector('.sgi-chevron-right')?.classList.contains('sgi-state-disabled')).toBe(false);
    expect(container.querySelector('.sgi-chevron-end')?.classList.contains('sgi-state-disabled')).toBe(false);
    expect(container.querySelector('.slick-pager-settings-expanded')?.getAttribute('style')).toContain('display: none');
  });

  it('renders all rows and optional count range in the status text', () => {
    pagingInfo.pageSize = 0;
    createPager({ showCount: true });
    expect(container.querySelector('.slick-pager-status')?.textContent).toBe('Showing all 45 rows');

    pagingInfo.pageSize = 10;
    pagingInfo.pageNum = 4;
    dataView.onPagingInfoChanged.notify(pagingInfo);
    expect(container.querySelector('.slick-pager-status')?.textContent).toBe('Showing page 5 of 5 - From 41 to 45 of 45 rows');
    expect(container.querySelector('.sgi-chevron-right')?.classList.contains('sgi-state-disabled')).toBe(true);
    expect(container.querySelector('.sgi-chevron-end')?.classList.contains('sgi-state-disabled')).toBe(true);
  });

  it('navigates to first, previous, next, and last pages from the pager controls', () => {
    createPager();
    container.querySelector<HTMLElement>('.sgi-chevron-start')!.click();
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageNum: 0 });
    container.querySelector<HTMLElement>('.sgi-chevron-left')!.click();
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageNum: 0 });
    container.querySelector<HTMLElement>('.sgi-chevron-right')!.click();
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageNum: 2 });
    container.querySelector<HTMLElement>('.sgi-chevron-end')!.click();
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageNum: 4 });
  });

  it('disables boundary navigation and navigation while the editor cannot commit', () => {
    pagingInfo.pageNum = 0;
    createPager();
    container.querySelector<HTMLElement>('.sgi-chevron-start')!.click();
    container.querySelector<HTMLElement>('.sgi-chevron-left')!.click();
    expect(dataView.setPagingOptions).not.toHaveBeenCalledWith({ pageNum: -1 });
    expect(container.querySelector('.sgi-chevron-start')?.classList.contains('sgi-state-disabled')).toBe(true);

    vi.spyOn(SlickGlobalEditorLock, 'commitCurrentEdit').mockReturnValue(false);
    container.querySelector<HTMLElement>('.sgi-chevron-right')!.click();
    expect(dataView.setPagingOptions).not.toHaveBeenCalled();
  });

  it('changes page size, computes auto page size, and toggles page-size settings', () => {
    createPager({ showPageSizes: true });
    const links = [...container.querySelectorAll<HTMLAnchorElement>('.slick-pager-settings-expanded a')];
    links.find((link) => link.dataset.val === '50')!.click();
    expect(dataView.setRefreshHints).toHaveBeenCalledWith({ isFilterUnchanged: true });
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageSize: 50 });
    links.find((link) => link.dataset.val === '-1')!.click();
    expect(grid.getViewport).toHaveBeenCalledOnce();
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageSize: 20 });
    links.find((link) => link.dataset.val === '0')!.click();
    expect(dataView.setPagingOptions).toHaveBeenLastCalledWith({ pageSize: 0 });

    const settings = container.querySelector<HTMLElement>('.slick-pager-settings-expanded')!;
    const bulb = container.querySelector<HTMLElement>('.sgi-lightbulb')!;
    bulb.click();
    expect(settings.style.display).toBe('none');
    bulb.click();
    expect(settings.style.display).toBe('inline-flex');
  });

  it('accepts selector and array-like containers', () => {
    container.id = 'pager-by-id';
    createPager(undefined, '#pager-by-id');
    expect(container.querySelector('.slick-pager')).toBeTruthy();
    pager.destroy();

    createPager(undefined, { 0: container } as any);
    expect(container.querySelector('.slick-pager')).toBeTruthy();
  });

  it('clears its container and resets paging when destroyed', () => {
    createPager();
    pager.destroy();
    expect(dataView.setRefreshHints).toHaveBeenCalledWith({ isFilterUnchanged: true });
    expect(dataView.setPagingOptions).toHaveBeenCalledWith({ pageSize: 0 });
    expect(container.innerHTML).toBe('');
  });
});
