import { describe, expect, it, vi } from 'vitest';
import { SlickEvent } from '../../slick.core';
import type { SlickDataView } from '../../slick.dataview';
import type { SlickGrid } from '../../slick.grid';
import { SlickGridPager } from '../slick.pager';

describe('SlickGridPager accessibility', () => {
  it('supports keyboard navigation and exposes paging and settings state', () => {
    const info = { pageSize: 25, pageNum: 0, totalPages: 3, totalRows: 60 };
    const dataView = {
      getPagingInfo: () => info,
      onPagingInfoChanged: new SlickEvent(),
      setPagingOptions: vi.fn(),
      setRefreshHints: vi.fn(),
    } as unknown as SlickDataView;
    const container = document.createElement('div');
    const pager = new SlickGridPager(dataView, { getViewport: () => ({ top: 0, bottom: 10 }) } as SlickGrid, container);
    const first = container.querySelector<HTMLElement>('.sgi-chevron-start')!;
    const next = container.querySelector<HTMLElement>('.sgi-chevron-right')!;
    const settings = container.querySelector<HTMLElement>('.sgi-lightbulb')!;

    expect(first.getAttribute('aria-disabled')).toBe('true');
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(dataView.setPagingOptions).not.toHaveBeenCalled();
    next.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(dataView.setPagingOptions).toHaveBeenCalledWith({ pageNum: 1 });
    settings.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(settings.getAttribute('aria-expanded')).toBe('true');
    const option = container.querySelector<HTMLElement>('[data-val="50"]')!;
    expect(option.tabIndex).toBe(0);
    option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(dataView.setPagingOptions).toHaveBeenCalledWith({ pageSize: 50 });
    expect(container.querySelector('.slick-pager-status')?.getAttribute('aria-live')).toBe('polite');
    pager.destroy();
  });
});
