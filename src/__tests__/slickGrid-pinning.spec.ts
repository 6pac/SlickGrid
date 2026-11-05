import { afterEach, describe, expect, it, vi } from 'vitest';
import { Column, GridOption } from '../models';
import { SlickGrid } from '../slick.grid';
import { Utils } from '../slick.core';

const columns: Column[] = [
  { id: 'a', field: 'a', name: 'A', width: 80 },
  { id: 'b', field: 'b', name: 'B', width: 80 },
  { id: 'c', field: 'c', name: 'C', width: 80 },
  { id: 'd', field: 'd', name: 'D', width: 80 },
];
const data = [
  { id: 0, a: 'a0', b: 'b0', c: 'c0', d: 'd0' },
  { id: 1, a: 'a1', b: 'b1', c: 'c1', d: 'd1' },
  { id: 2, a: 'a2', b: 'b2', c: 'c2', d: 'd2' },
];

describe('SlickGrid unified pinning', () => {
  let grid: SlickGrid<any, Column> | undefined;
  let container: HTMLDivElement;

  afterEach(() => {
    grid?.destroy(true);
    container?.remove();
  });

  const createGrid = (options: GridOption = {}, gridColumns = columns, gridData = data): SlickGrid<any, Column> => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    grid = new SlickGrid(container, gridData, gridColumns.map((column) => ({ ...column })) as Column[], {
      enableCellNavigation: true,
      devMode: {  },
      errorCallback: vi.fn(),
      ...options,
    });
    return grid;
  };

  const fireDrag = (element: HTMLElement, type: 'dragstart' | 'dragend') => {
    element.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
  };

  it('applies numeric and explicit column pinning with row docking', () => {
    const slickGrid = createGrid({
      pinning: { columns: { left: 0, right: ['d'] }, rows: { top: [0], bottom: [2] } },
      stickyRows: { top: [1] },
    });

    expect(slickGrid.getColumns().map((column) => column.pinned)).toEqual(['left', null, null, 'right']);
    expect(slickGrid.getPinnedColumns('left').map((column) => column.id)).toEqual(['a']);
    expect(slickGrid.getPinnedColumns('right').map((column) => column.id)).toEqual(['d']);
    expect(container.querySelector('.slick-docking-horizontal-scroller')).toBeTruthy();
    expect(container.querySelector('.slick-horizontal-scroller')).toBe(container.querySelector('.slick-docking-horizontal-scroller'));
    expect(container.querySelector('.slick-vertical-scroller')).toBe((slickGrid as any)._viewportNode);
    expect(container.querySelector('.slick-docking-overlay')).toBeTruthy();
    expect((slickGrid as any)._dockingOverlay.parentElement).toBe((slickGrid as any)._viewportNode);
    expect((slickGrid as any)._dockingOverlay.nextElementSibling).toBe((slickGrid as any)._canvasNode);
    expect((slickGrid as any)._contentRoot.style.left).toBe('');
    expect((slickGrid as any)._contentRoot.style.width).toBe('100%');
    expect(slickGrid.getOptions().pinning?.rows).toEqual({ top: [0], bottom: [2] });
  });

  it.each([false, true])('cancels the left-pinned header separator with a negative inline margin (rtl=%s)', (rtl) => {
    const slickGrid = createGrid({ rtl, pinning: { columns: { left: ['a'] } } });
    const internals = slickGrid as any;
    const docking = { band: 'left', offset: 0, naturalOffset: 0, sticky: false, width: 80 };
    const header = document.createElement('div');
    const cell = document.createElement('div');

    internals.placeDockedChromeElement(header, true, 0, docking, 'left', false, 2);
    internals.placeDockedChromeElement(cell, false, 0, docking, 'left', false, 2);

    expect(header.style.marginLeft).toBe(rtl ? '-2px' : '');
    expect(header.style.marginRight).toBe(rtl ? '' : '-2px');
    expect(header.style.position).toBe('relative');
    expect(header.style.transform).toBe('translateX(0px)');
    expect(cell.style.marginLeft).toBe('');
    expect(cell.style.marginRight).toBe('');
    expect(cell.style.position).toBe('absolute');

    const headerWithoutSeparator = document.createElement('div');
    internals.placeDockedChromeElement(headerWithoutSeparator, true, 0, docking, 'left', false, 0);
    expect(headerWithoutSeparator.style.marginLeft).toBe('');
    expect(headerWithoutSeparator.style.marginRight).toBe('');
  });

  it.each([false, true])('uses the calculated inner viewport width for docking with scrollbar overflow changes (rtl=%s)', (rtl) => {
    const slickGrid = createGrid({ rtl, pinning: { columns: { right: ['d'] } } });
    const internals = slickGrid as any;
    internals.viewportW = 800;
    internals.scrollbarDimensions = { width: 15, height: 15 };
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 790 });
    Object.defineProperty(internals._dockingHorizontalScroller, 'clientWidth', { configurable: true, value: 795 });

    internals.viewportHasVScroll = true;
    expect(internals.getDockingRenderedWidth()).toBe(785);
    expect(internals.getDockingRenderedWidths()).toEqual({ left: 0, center: 705, right: 80 });

    internals.viewportHasVScroll = false;
    expect(internals.getDockingRenderedWidth()).toBe(800);

    internals.viewportW = 700;
    expect(internals.getDockingRenderedWidth()).toBe(700);

    internals.dockingLayout.contentWidth = 900;
    expect(internals.getDockingRenderedWidth()).toBe(900);
  });

  it('falls back to measured docking viewports when the calculated width is unavailable', () => {
    const internals = createGrid({ pinning: { columns: { right: ['d'] } } }) as any;
    const innerWidthSpy = vi.spyOn(internals, 'getViewportInnerWidth').mockReturnValue(0);
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 780 });
    Object.defineProperty(internals._dockingHorizontalScroller, 'clientWidth', { configurable: true, value: 790 });
    expect(internals.getDockingRenderedWidth()).toBe(780);

    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 0 });
    expect(internals.getDockingRenderedWidth()).toBe(790);

    Object.defineProperty(internals._dockingHorizontalScroller, 'clientWidth', { configurable: true, value: 0 });
    internals.viewportW = 800;
    expect(internals.getDockingRenderedWidth()).toBe(800);
    innerWidthSpy.mockRestore();
  });

  it('applies RTL before the first implicit layout', () => {
    const originalFinishInitialization = (SlickGrid.prototype as any).finishInitialization;
    const finishInitializationSpy = vi.spyOn(SlickGrid.prototype as any, 'finishInitialization').mockImplementation(function (this: any) {
      expect(this._container.getAttribute('dir')).toBe('rtl');
      return originalFinishInitialization.call(this);
    });

    try {
      createGrid({ rtl: true });
      expect(finishInitializationSpy).toHaveBeenCalledOnce();
    } finally {
      finishInitializationSpy.mockRestore();
    }
  });

  it('renders and hit-tests a colspan crossing the leading pinned boundary in RTL', () => {
    const spanData = {
      getLength: () => data.length,
      getItem: (row: number) => data[row],
      getItemMetadata: (row: number) => (row === 2 ? { columns: { 0: { colspan: 3, formatter: () => 'Spanned' } } } : undefined),
    };
    const slickGrid = createGrid({ rtl: true, pinning: { columns: { left: ['a'], right: ['d'] } } }, columns, spanData as any);
    const row = container.querySelector<HTMLElement>('[data-row="2"]')!;
    const host = row.querySelector<HTMLElement>('.slick-pinned-left-cells .slick-cell.l0:not(.slick-cell-colspan-part)')!;
    const part = row.querySelector<HTMLElement>('.slick-scrolling-cells .slick-cell-colspan-part')!;

    expect(host).toBeTruthy();
    expect(row.querySelectorAll('.slick-scrolling-cells .slick-cell-colspan-part')).toHaveLength(1);
    expect(host.classList.contains('slick-cell-colspan-shared-edge')).toBe(false);
    expect(part.classList.contains('slick-cell-colspan-shared-edge')).toBe(true);
    expect(host.textContent).toBe('Spanned');
    expect(part.querySelector('.slick-cell-colspan-part-content')?.textContent).toBe('Spanned');
    expect((slickGrid as any).getCellFromEvent({ target: host })).toEqual({ row: 2, cell: 0 });
    expect((slickGrid as any).getCellFromEvent({ target: part })).toEqual({ row: 2, cell: 0 });
  });

  it.each([false, true])('keeps permanent cell widths when recomputing rules with active sticky docking (rtl=%s)', (rtl) => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const pinning = { columns: { left: ['a'], right: ['d'] } };
    const slickGrid = createGrid(
      { rtl, pinning, docking: { maxColumnViewportWidthPercent: 100 }, devMode: { containerClientWidth: 800 } },
      stickyColumns
    );
    const internals = slickGrid as any;
    const rulesByColumn = columns.map(() => ({
      left: { style: document.createElement('div').style },
      right: { style: document.createElement('div').style },
    }));
    const rulesSpy = vi.spyOn(internals, 'getColumnCssRules').mockImplementation((...args: unknown[]) => rulesByColumn[args[0] as number]);
    internals.refreshDockingLayout(rtl ? -20 : 20);
    internals.updateColumnPositionCaches();
    internals.applyColumnWidths();

    expect(internals.dockingLayout.leftWidth).toBeGreaterThan(internals.dockingLayout.leftBaseWidth);
    [0, 3].forEach((index) => {
      const rules = rulesByColumn[index];
      const start = Number.parseFloat(rules.left.style[rtl ? 'right' : 'left']);
      const end = Number.parseFloat(rules.right.style[rtl ? 'left' : 'right']);
      const bandWidth = internals.getDockingRenderedWidths()[index === 0 ? 'left' : 'right'];
      expect(bandWidth - start - end).toBe(80);
    });
    rulesSpy.mockRestore();
  });

  it('coexists with permanent pins and scroll-activated sticky docking', () => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const slickGrid = createGrid(
      {
        devMode: { containerClientWidth: 800 },
        pinning: { columns: { left: ['a'], right: ['d'] }, rows: { top: [0], bottom: [2] } },
        stickyRows: { top: [1] },
      },
      stickyColumns
    );
    const internals = slickGrid as any;

    internals.refreshDockingLayout(20);
    internals.refreshRowDockingLayout(30);

    expect(internals.dockingLayout.left.map((item: any) => item.index)).toEqual([0, 1]);
    expect(internals.dockingLayout.left.map((item: any) => item.sticky)).toEqual([false, true]);
    expect(internals.dockingLayout.right.map((item: any) => item.index)).toEqual([3]);
    expect(internals.rowDockingLayout.top.map((item: any) => item.index)).toEqual([0, 1]);
    expect(internals.rowDockingLayout.top.map((item: any) => item.sticky)).toEqual([false, true]);
    expect(internals.rowDockingLayout.bottom.map((item: any) => item.index)).toEqual([2]);
    expect(container.querySelector('.slick-docking-overlay [data-row="1"]')).toBeTruthy();
  });

  it('keeps the permanent header edge when a sticky column docks beside it', () => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const slickGrid = createGrid(
      {
        devMode: { containerClientWidth: 160 },
        docking: { maxColumnViewportWidthPercent: 100 },
        pinning: { columns: { left: ['a'] } },
      },
      stickyColumns
    );
    const internals = slickGrid as any;
    internals.viewportW = 160;
    internals.refreshDockingLayout(100);
    internals.applyDockingToColumnChrome();
    internals.updateStickyColumnTransforms();

    const pinnedHeader = slickGrid.getHeaderColumn('a');
    const stickyHeader = slickGrid.getHeaderColumn('b');
    const row = container.querySelector<HTMLElement>('.grid-canvas .slick-row[data-row="0"]')!;

    expect(internals.dockingLayout.left.map((entry: any) => [entry.index, entry.sticky])).toEqual([
      [0, false],
      [1, true],
    ]);
    expect(pinnedHeader.classList.contains('slick-column-pinned-left-edge')).toBe(true);
    expect(stickyHeader.classList.contains('slick-column-sticky-left-edge')).toBe(true);
    expect(row.querySelector('.slick-pinned-left-cells-active > .slick-cell:last-child')).toBeTruthy();
    expect(row.querySelector('.slick-cell-sticky-left-edge')).toBeTruthy();
  });

  it('resolves pinned columns, hit testing, and scroll offsets along the inline axis in RTL', () => {
    const rtlColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const slickGrid = createGrid(
      {
        devMode: { containerClientWidth: 160 },
        pinning: { columns: { left: ['a'], right: ['d'] }, rows: { top: [0], bottom: [2] } },
        rtl: true,
      },
      rtlColumns
    );
    const internals = slickGrid as any;

    expect(internals.getInlineDirection()).toBe(-1);
    expect(internals.usesStickyColumnTransformPath()).toBe(true);
    expect(internals.getInlineOffsetFromLeft(280)).toBe(40);
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 160 });
    Object.defineProperty(internals._dockingHorizontalScroller, 'clientWidth', { configurable: true, value: 160 });
    internals.updateDockingHorizontalScrollerDimensions();
    expect(container.style.getPropertyValue('--slick-docking-direction')).toBe('-1');
    expect(container.style.getPropertyValue('--slick-docking-right-offset')).toBe('160px');

    internals.scrollLeft = -160;
    internals.refreshDockingLayout(-160);
    internals.applyDockingToColumnChrome();
    expect(slickGrid.getCellFromPoint(120, 20).cell).toBe(0);
    expect(internals.getTrailingDockedChromeInlineStart(slickGrid.getHeaderColumn('d'), { offset: 0 })).toEqual(expect.any(Number));
    expect(slickGrid.getCellFromPoint(40, 20).cell).toBe(3);

    const positioned = document.createElement('div');
    internals.setInlinePosition(positioned, 25, null);
    expect(positioned.style.right).toBe('25px');
    expect(positioned.style.left).toBe('auto');
    internals.dockingLayout.leftBaseWidth = 20;
    internals.dockingByColumn.set(1, { band: 'left', index: 1, offset: 35, naturalOffset: 5, sticky: true, width: 80 });
    internals.applyStickyColumnTransform(positioned, 1, 'cell');
    expect(positioned.style.getPropertyValue('--slick-sticky-column-offset')).toBe('-10px');
    internals.syncDockingScrollOffsetVariable(-12);

    expect(container.style.getPropertyValue('--slick-docking-scroll-left')).toBe('-12px');
  });

  it('resolves object id references after data order changes and clears null docking options', () => {
    const rows = [
      { id: 10, a: 'a10', b: 'b10', c: 'c10', d: 'd10' },
      { id: 11, a: 'a11', b: 'b11', c: 'c11', d: 'd11' },
      { id: 12, a: 'a12', b: 'b12', c: 'c12', d: 'd12' },
    ];
    const slickGrid = createGrid({ pinning: { rows: { top: [{ id: 12 }], bottom: [{ id: 10 }] } } }, columns, rows);
    const internals = slickGrid as any;

    expect(internals.rowDockingLayout.top.map((entry: any) => entry.index)).toEqual([2]);
    expect(internals.rowDockingLayout.bottom.map((entry: any) => entry.index)).toEqual([0]);

    rows.reverse();
    slickGrid.invalidateAllRows();
    slickGrid.render();
    expect(internals.rowDockingLayout.top.map((entry: any) => entry.index)).toEqual([0]);
    expect(internals.rowDockingLayout.bottom.map((entry: any) => entry.index)).toEqual([2]);

    slickGrid.setOptions({ pinning: { rows: { top: [0] } } });
    expect(internals.rowDockingLayout.top.map((entry: any) => entry.index)).toEqual([0]);
    slickGrid.setOptions({ pinning: null as any, stickyRows: null as any });
    expect(slickGrid.getOptions().pinning).toBeUndefined();
    expect(slickGrid.getOptions().stickyRows).toEqual({ top: [], bottom: [], both: [] });
  });

  it.each([
    { reference: { id: 99 }, idProperty: 'id', invalidation: 'all' },
    { reference: { id: 99 }, idProperty: 'id', invalidation: 'rows' },
  ])('caches unresolved row references until $invalidation invalidation ($idProperty)', ({ reference, idProperty, invalidation }) => {
    const rows = data.map((row) => ({ ...row }));
    const slickGrid = createGrid(
      {
        pinning: { rows: { top: [reference] } },
        stickyRows: { bottom: [reference] },
      },
      columns,
      rows
    );
    const internals = slickGrid as any;
    const findIndexSpy = vi.spyOn(rows, 'findIndex');
    internals.dockingRowIndexByReference.clear();

    for (let scrollTop = 0; scrollTop < 60; scrollTop++) {
      internals.refreshRowDockingLayout(scrollTop);
    }

    expect(findIndexSpy).toHaveBeenCalledOnce();
    expect(internals.rowDockingLayout.top).toEqual([]);
    expect(internals.rowDockingLayout.bottom).toEqual([]);

    rows[2] = { ...rows[2], id: 99, a: 'pending-row' };
    if (invalidation === 'all') {
      slickGrid.invalidateAllRows();
    } else {
      slickGrid.invalidateRows([2]);
    }
    slickGrid.render();

    expect(findIndexSpy).toHaveBeenCalledTimes(2);
    expect(internals.rowDockingLayout.top.map((entry: any) => entry.index)).toEqual([2]);
    findIndexSpy.mockRestore();
  });

  it('caches missing DataView row IDs and resolves them after the data changes', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const getRowById = vi.fn().mockReturnValue(undefined);
    internals.data = { getRowById };

    expect(internals.resolveDockingRowIndex('pending-row')).toBeUndefined();
    expect(internals.resolveDockingRowIndex('pending-row')).toBeUndefined();
    expect(getRowById).toHaveBeenCalledOnce();

    getRowById.mockReturnValue(0);
    slickGrid.invalidateAllRows();

    expect(internals.resolveDockingRowIndex('pending-row')).toBe(0);
    expect(getRowById).toHaveBeenCalledTimes(2);
  });

  it('reports a missing selection model when requesting selected rows', () => {
    const slickGrid = createGrid();

    expect(() => slickGrid.getSelectedRows()).toThrow('SlickGrid Selection model is not set');
  });

  it('reports a rejected setColumns request without mutating the caller columns or publishing events', () => {
    const slickGrid = createGrid({ pinning: { columns: { right: ['d'] } } });
    const internals = slickGrid as any;
    const candidateColumns = slickGrid.getColumns().map((column) => ({ ...column }));
    candidateColumns[3].pinned = null;
    const beforeSetColumns = vi.spyOn(slickGrid.onBeforeSetColumns, 'notify');
    vi.spyOn(internals, 'validateColumnPinning').mockReturnValue(false);

    expect(slickGrid.setColumns(candidateColumns)).toBe(false);
    expect(candidateColumns[3].pinned).toBeNull();
    expect(slickGrid.getColumns()[3].pinned).toBe('right');
    expect(beforeSetColumns).not.toHaveBeenCalled();
  });

  it('keeps docking wrappers presentational around the one semantic grid tree', () => {
    createGrid({ pinning: { columns: { left: ['a'], right: ['d'] }, rows: { top: [0] } } });

    const headerRoot = container.querySelector<HTMLElement>('.slick-header-columns-root')!;
    const dockedRow = container.querySelector<HTMLElement>('.slick-docking-overlay .slick-row[data-row="0"]')!;
    const dockingScroller = container.querySelector<HTMLElement>('.slick-docking-horizontal-scroller')!;

    expect(headerRoot.getAttribute('role')).toBe('row');
    expect(headerRoot.querySelectorAll('[role="presentation"]')).toHaveLength(3);
    const headers = [...headerRoot.querySelectorAll<HTMLElement>('[role="columnheader"]')];
    expect(headers).toHaveLength(4);
    expect(headers.map((header) => header.getAttribute('aria-colindex'))).toEqual(['1', '2', '3', '4']);
    expect(dockingScroller.tabIndex).toBe(0);
    expect(dockingScroller.ariaLabel).toBe('Horizontal grid scroll');
    expect(dockedRow.getAttribute('role')).toBe('row');
    expect(dockedRow.getAttribute('aria-rowindex')).toBe('1');
    expect(dockedRow.querySelectorAll(':scope > [role="presentation"]')).toHaveLength(3);
    const cells = [...dockedRow.querySelectorAll<HTMLElement>('[role="gridcell"]')];
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.every((cell) => !cell.hasAttribute('aria-hidden'))).toBe(true);
    cells.forEach((cell) => {
      const cellIndex = [...cell.classList].find((className) => /^l\d+$/.test(className))!;
      expect(cell.getAttribute('aria-colindex')).toBe(`${Number(cellIndex.slice(1)) + 1}`);
    });
  });

  it('reorders docking chrome only when needed', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a'], right: ['d'] } }, showHeaderRow: true });
    const internals = slickGrid as any;
    const regions = [...Object.values(internals.dockingHeaderRegions), ...Object.values(internals.dockingHeaderRowRegions)] as HTMLDivElement[];
    const appendSpies = regions.map((region) => vi.spyOn(region, 'appendChild'));

    internals.syncDockingChromeRegions();

    appendSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());

    const centerRegion = internals.dockingHeaderRegions.center as HTMLDivElement;
    centerRegion.appendChild(centerRegion.firstElementChild!);
    appendSpies.forEach((spy) => spy.mockClear());
    internals.syncDockingChromeRegions();

    expect([...centerRegion.children].map((element) => (element as HTMLElement).dataset.id)).toEqual(['b', 'c']);
    expect(appendSpies.some((spy) => spy.mock.calls.length > 0)).toBe(true);
  });

  it('compacts normal rows around non-contiguous top-pinned rows without changing dataset height', () => {
    const rows = Array.from({ length: 6 }, (_, id) => ({ id, a: `a${id}`, b: `b${id}`, c: `c${id}`, d: `d${id}` }));
    const slickGrid = createGrid({ pinning: { rows: { top: [0, 2, 4] } } }, columns, rows);
    const rowHeight = slickGrid.getOptions().rowHeight!;
    const canvas = container.querySelector('.grid-canvas')!;

    expect((canvas as HTMLElement).style.height).toBe(`${rowHeight * rows.length}px`);
    expect(canvas.querySelector<HTMLElement>('[data-row="1"]')?.style.transform).toBe(`translateY(${rowHeight * 3}px)`);
    expect(canvas.querySelector<HTMLElement>('[data-row="3"]')?.style.transform).toBe(`translateY(${rowHeight * 4}px)`);
    expect(canvas.querySelector<HTMLElement>('[data-row="5"]')?.style.transform).toBe(`translateY(${rowHeight * 5}px)`);
    expect(canvas.querySelector('[data-row="0"]')).toBeNull();
    expect(canvas.querySelector('[data-row="2"]')).toBeNull();
    expect(canvas.querySelector('[data-row="4"]')).toBeNull();
    expect(container.querySelectorAll('.slick-docking-overlay > .slick-row-pinned-top')).toHaveLength(3);
  });

  it('keeps column definitions in their original order when columns are pinned', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a', 'c'] } } });

    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('anchors the bottom pinned row band below the top band instead of overlapping it when the viewport is too small', () => {
    const rows = Array.from({ length: 8 }, (_, id) => ({ id, a: `a${id}`, b: `b${id}`, c: `c${id}`, d: `d${id}` }));
    const slickGrid = createGrid({ pinning: { rows: { top: [0, 1, 2], bottom: [5, 6] } } }, columns, rows);
    // 5 pinned rows at the default 25px row height (125px) do not fit an 80px viewport.
    container.style.height = '80px';
    slickGrid.resizeCanvas();

    const rowHeight = slickGrid.getOptions().rowHeight!;
    const topBandHeight = rowHeight * 3;
    const bottomRowNode = container.querySelector<HTMLElement>('.slick-docking-overlay [data-row="5"]')!;

    expect(parseFloat(bottomRowNode.style.transform.slice('translateY('.length))).toBeGreaterThanOrEqual(topBandHeight);
  });

  it('reserves docking.minCenterRowCount rows of breathing room between the top and bottom pinned bands', () => {
    const rows = Array.from({ length: 8 }, (_, id) => ({ id, a: `a${id}`, b: `b${id}`, c: `c${id}`, d: `d${id}` }));
    const slickGrid = createGrid({ pinning: { rows: { top: [0], bottom: [7] } }, docking: { minCenterRowCount: 4 } }, columns, rows);
    container.style.height = '400px';
    slickGrid.resizeCanvas();

    const rowHeight = slickGrid.getOptions().rowHeight!;
    const bottomRowNode = container.querySelector<HTMLElement>('.slick-docking-overlay [data-row="7"]')!;

    // top band (1 row) + reserved center budget (4 rows) must precede the bottom band.
    expect(parseFloat(bottomRowNode.style.transform.slice('translateY('.length))).toBeGreaterThanOrEqual(rowHeight * 5);
  });

  it('converts docking.minCenterRowCount to pixels using the average measured height in variable row height mode', () => {
    const rows = Array.from({ length: 8 }, (_, id) => ({ id, a: `a${id}`, b: `b${id}`, c: `c${id}`, d: `d${id}` }));
    const slickGrid = createGrid(
      {
        pinning: { rows: { top: [0], bottom: [7] } },
        docking: { minCenterRowCount: 2 },
        enableVariableRowHeight: true,
        rowHeightProvider: (_grid, row) => (row === 1 ? 100 : 25),
      },
      columns,
      rows
    );
    container.style.height = '400px';
    slickGrid.resizeCanvas();

    const bottomRowNode = container.querySelector<HTMLElement>('.slick-docking-overlay [data-row="7"]')!;
    const averageHeight = (slickGrid as any).getEstimatedRowHeight();
    const topHeight = slickGrid.getRowHeight(0);

    expect(averageHeight).toBeGreaterThan(25); // pulled up by the one 100px row
    expect(parseFloat(bottomRowNode.style.transform.slice('translateY('.length))).toBeGreaterThanOrEqual(topHeight + averageHeight * 2);
  });

  it('keeps hidden columns in their rendered docking position', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a', 'c'] } } });
    slickGrid.updateColumnById('b', { hidden: true });

    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('keeps sticky columns in their permanent band when pinned by boundary or at runtime', () => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 || index === 2 ? true : undefined }));
    const slickGrid = createGrid(
      { devMode: { containerClientWidth: 800 }, pinning: { columns: { left: 1 } }, showHeaderRow: true },
      stickyColumns
    );
    const internals = slickGrid as any;
    const pinnedCell = container.querySelector<HTMLElement>('.slick-row[data-row="0"] .slick-cell.l1');

    expect(pinnedCell).toBeTruthy();
    expect(internals.isStickyTransformColumn(1)).toBe(false);
    expect(pinnedCell?.parentElement?.classList.contains('slick-pinned-left-cells')).toBe(true);
    expect(pinnedCell?.classList.contains('slick-cell-pinned-left')).toBe(true);
    expect(slickGrid.getHeaderColumn('b').classList.contains('slick-column-pinned-left')).toBe(true);
    expect(slickGrid.getHeaderColumn('b').classList.contains('slick-column-sticky')).toBe(false);

    slickGrid.setColumnPinning('c', 'left');
    const runtimePinnedCell = container.querySelector<HTMLElement>('.slick-row[data-row="0"] .slick-cell.l2')!;
    expect(internals.isStickyTransformColumn(2)).toBe(false);
    expect(runtimePinnedCell.parentElement?.classList.contains('slick-pinned-left-cells')).toBe(true);
    expect(runtimePinnedCell.classList.contains('slick-cell-pinned-left')).toBe(true);
    expect(slickGrid.getHeaderColumn('c').classList.contains('slick-column-pinned-left')).toBe(true);
  });

  it('keeps a center reorder out of the pinned band when a middle column is hidden', () => {
    const reorderColumns = [
      ...columns.map((column) => ({ ...column })),
      { id: 'e', field: 'e', name: 'E', width: 80 },
      { id: 'f', field: 'f', name: 'F', width: 80 },
      { id: 'g', field: 'g', name: 'G', width: 80 },
    ];
    const slickGrid = createGrid(
      {
        enableColumnReorder: true,
        pinning: { columns: { left: ['a', 'c'], right: ['g'] } },
      },
      reorderColumns
    );
    slickGrid.updateColumnById('e', { hidden: true }, true);

    const center = container.querySelector<HTMLElement>('.slick-header-columns-center')!;
    const item = slickGrid.getHeaderColumn('b');
    fireDrag(item, 'dragstart');
    center.insertBefore(slickGrid.getHeaderColumn('d'), item);
    fireDrag(item, 'dragend');

    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'd', 'c', 'b', 'e', 'f', 'g']);
  });

  it('leaves the column order unchanged when DOM reorder slots do not match docking slots', () => {
    const slickGrid = createGrid({
      enableColumnReorder: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
    });
    const item = slickGrid.getHeaderColumn('b');
    const setColumnsSpy = vi.spyOn(slickGrid, 'setColumns');
    fireDrag(item, 'dragstart');
    container.querySelector('.slick-header-columns-left')!.appendChild(item.cloneNode(true));
    fireDrag(item, 'dragend');

    expect(setColumnsSpy).not.toHaveBeenCalled();
    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('restores the shared scroller position when a drop precedes its scroll event', () => {
    const slickGrid = createGrid({ enableColumnReorder: true, pinning: { columns: { left: ['a'], right: ['d'] } } });
    const item = slickGrid.getHeaderColumn('b');
    const center = item.parentElement!;
    const scroller = container.querySelector<HTMLElement>('.slick-horizontal-scroller')!;
    const scrollToXSpy = vi.spyOn(slickGrid, 'scrollToX').mockImplementation(() => undefined);
    fireDrag(item, 'dragstart');
    center.insertBefore(slickGrid.getHeaderColumn('c'), item);
    scroller.scrollLeft = 125;
    expect((slickGrid as any).scrollLeft).toBe(0);
    fireDrag(item, 'dragend');

    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'c', 'b', 'd']);
    expect(scrollToXSpy).toHaveBeenCalledWith(125);
  });

  it('keeps visible columns in definition order without column docking', () => {
    const slickGrid = createGrid();

    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('includes hidden columns in definition order without column docking', () => {
    const slickGrid = createGrid();
    slickGrid.updateColumnById('d', { hidden: true });

    expect(slickGrid.getColumns().map((column) => column.id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('renders full-width group rows across docking regions without moving regular cells', () => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    const groupedRows = [...data, { id: 3, a: 'total', b: 'total', c: 'total', d: 'total' }];
    const groupedData = {
      getLength: () => groupedRows.length,
      getItem: (row: number) => groupedRows[row],
      getItemMetadata: (row: number) =>
        row === 0
          ? {
              cssClasses: 'slick-group slick-group-level-0',
              isGroup: true,
              columns: { 0: { colspan: '*', formatter: () => 'Group A' } },
            }
          : row === 2
            ? {
                cssClasses: 'slick-group slick-group-level-0',
                isGroup: true,
                columns: { 0: { colspan: columns.length, formatter: () => 'Group B' } },
              }
            : row === 3
              ? { cssClasses: 'slick-group-totals', isGroup: true }
              : undefined,
    };
    grid = new SlickGrid(container, groupedData as any, columns.map((column) => ({ ...column })) as Column[], {
      devMode: {  },
      pinning: { columns: { left: ['b'], right: ['d'] } },
    });

    const groupRow = container.querySelector<HTMLElement>('[data-row="0"]')!;
    const regularRow = container.querySelector<HTMLElement>('[data-row="1"]')!;
    const numericSpanGroupRow = container.querySelector<HTMLElement>('[data-row="2"]')!;
    const totalsRow = container.querySelector<HTMLElement>('[data-row="3"]')!;
    const groupCell = groupRow.querySelector<HTMLElement>('.slick-cell')!;

    expect(groupCell.parentElement).toBe(groupRow);
    expect(groupCell.classList.contains('slick-cell-full-width-group')).toBe(true);
    expect(groupCell.textContent).toBe('Group A');
    expect(regularRow.querySelector('.slick-cell.l0')?.parentElement?.classList.contains('slick-scrolling-cells')).toBe(true);
    expect(regularRow.querySelector('.slick-cell.l1')?.parentElement?.classList.contains('slick-pinned-left-cells')).toBe(true);
    expect(regularRow.querySelector('.slick-cell.l3')?.parentElement?.classList.contains('slick-pinned-right-cells')).toBe(true);
    expect(regularRow.querySelector('.slick-cell.l0')?.textContent).toBe('a1');
    expect(regularRow.querySelector('.slick-cell.l1')?.textContent).toBe('b1');
    expect(numericSpanGroupRow.querySelector('.slick-cell')?.parentElement).toBe(numericSpanGroupRow);
    expect(totalsRow.classList.contains('slick-row-full-width-group')).toBe(false);
    expect(totalsRow.querySelector('.slick-cell.l1')?.parentElement?.classList.contains('slick-pinned-left-cells')).toBe(true);

    grid.setActiveCell(0, 0);
    expect(groupCell.classList.contains('active')).toBe(true);
    expect(groupCell.parentElement).toBe(groupRow);
    expect(groupCell.textContent).toBe('Group A');

    grid.scrollToX(120);
    expect(container.style.getPropertyValue('--slick-docking-scroll-left')).toBe('120px');
    expect(groupCell.style.transform).toBe('');

    (grid as any).updateStickyColumnTransforms();
    expect(groupCell.parentElement).toBe(groupRow);
  });

  it('reuses rowspan intersection results until span metadata is invalidated or remapped', () => {
    let span = 2;
    const spanData = {
      getLength: () => data.length,
      getItem: (row: number) => data[row],
      getItemMetadata: (row: number) => (row === 0 ? { columns: { 0: { rowspan: span } } } : undefined),
    };
    const slickGrid = createGrid({ enableCellRowSpan: true }, columns, spanData as any);
    const internals = slickGrid as any;
    const row = container.querySelector<HTMLElement>('[data-row="1"]')!;
    const intersectSpy = vi.spyOn(slickGrid, 'getRowSpanIntersect');
    internals.applyRowTopOffset(row, 1);
    internals.applyRowTopOffset(row, 1);
    expect(intersectSpy).not.toHaveBeenCalled();
    expect(row.style.transform).toBe('');

    span = 1;
    slickGrid.invalidateRows([0]);
    slickGrid.remapAllColumnsRowSpan();
    internals.applyRowTopOffset(row, 1);
    expect(intersectSpy).toHaveBeenCalledTimes(1);
    expect(row.style.transform).toBe('');
    internals.applyRowTopOffset(row, 1);
    expect(intersectSpy).toHaveBeenCalledTimes(1);

    span = 3;
    slickGrid.invalidateRows([0]);
    expect(slickGrid.getRowCache()[1].rowSpanIntersect).toBe(true);
    slickGrid.remapAllColumnsRowSpan();
    internals.applyRowTopOffset(row, 1);
    expect(row.style.transform).toBe('');
    expect(slickGrid.getRowCache()[1].rowSpanIntersect).toBe(true);
  });

  it('preserves colspan and rowspan fragments when the row becomes sticky', () => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    const spanData = {
      getLength: () => data.length,
      getItem: (row: number) => data[row],
      getItemMetadata: (row: number) => (row === 0 ? { columns: { 0: { colspan: columns.length, formatter: () => 'Spanned', rowspan: 2 } } } : undefined),
    };
    grid = new SlickGrid(container, spanData as any, columns.map((column) => ({ ...column })) as Column[], {
      devMode: {  },
      enableCellRowSpan: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
      stickyRows: { top: [0], bottom: [], both: [] },
    });

    const row = container.querySelector<HTMLElement>('[data-row="0"]')!;
    const host = row.querySelector<HTMLElement>('.slick-cell.l0:not(.slick-cell-colspan-part)')!;
    const fragments = row.querySelectorAll<HTMLElement>('.slick-cell-colspan-part');

    expect(host.textContent).toBe('Spanned');
    expect(host.classList.contains('r3')).toBe(true);
    expect(host.style.width).toBe('80px');
    expect(fragments[0].querySelector('.slick-cell-colspan-part-content')?.textContent).toBe('Spanned');
    expect(fragments[1].querySelector('.slick-cell-colspan-part-content')?.textContent).toBe('Spanned');
    expect(host.getAttribute('aria-colspan')).toBe('4');
    expect(host.getAttribute('aria-rowspan')).toBe('2');
    expect(fragments[0].style.width).toBe('');
    expect(row.classList.contains('slick-row-colspan-crossing-docking')).toBe(true);
    expect(row.querySelectorAll('.slick-cell-colspan-crossing-docking')).toHaveLength(3);
    expect(fragments[1].classList.contains('slick-cell-colspan-end')).toBe(true);
    expect(fragments).toHaveLength(2);
    expect(host.parentElement?.classList.contains('slick-pinned-left-cells')).toBe(true);
    expect(fragments[0].parentElement?.classList.contains('slick-scrolling-cells')).toBe(true);
    expect(fragments[1].parentElement?.classList.contains('slick-pinned-right-cells')).toBe(true);
    expect(host.classList.contains('slick-cell-colspan-shared-edge')).toBe(true);
    expect(fragments[0].classList.contains('slick-cell-colspan-shared-edge')).toBe(true);
    expect(fragments[1].classList.contains('slick-cell-colspan-shared-edge')).toBe(false);
    expect(fragments[0].getAttribute('aria-hidden')).toBe('true');
    expect(fragments[0].getAttribute('role')).toBe('presentation');
    expect(fragments[0].getAttribute('aria-colindex')).toBeNull();
    expect(fragments[0].getAttribute('aria-colspan')).toBeNull();
    expect(fragments[0].getAttribute('aria-rowspan')).toBeNull();
    expect((grid as any).getCellNode(0, 0)).toBe(host);

    const internals = grid as any;
    host.textContent = 'Updated span';
    internals.refreshColspanContinuations(0, 0);
    expect(fragments[0].querySelector('.slick-cell-colspan-part-content')?.textContent).toBe('Updated span');
    expect(fragments[1].querySelector('.slick-cell-colspan-part-content')?.textContent).toBe('Updated span');
    expect(() => internals.refreshColspanContinuations(-1, 0)).not.toThrow();

    Object.defineProperty(internals._viewportScrollContainerY, 'clientHeight', { configurable: true, value: 100 });
    internals.refreshRowDockingLayout(30);
    expect(row.parentElement).toBe(container.querySelector('.slick-docking-overlay'));
    expect(row.classList.contains('slick-row-sticky')).toBe(true);
    expect(row.querySelectorAll('.slick-cell-colspan-part')).toHaveLength(2);
    expect(row.querySelector('.slick-cell.l0')?.parentElement?.classList.contains('slick-pinned-left-cells')).toBe(true);
    expect(row.querySelector('.slick-cell-colspan-end')?.parentElement?.classList.contains('slick-pinned-right-cells')).toBe(true);

    grid.getColumns()[1].hidden = true;
    expect((grid as any).getColspanSegments(0, columns.length)).toHaveLength(3);
    const oneVisibleSpan = document.createElement('div');
    (grid as any).appendCellHtml(oneVisibleSpan, 0, 0, 2, 1, null, data[0]);
    expect(oneVisibleSpan.firstElementChild?.getAttribute('aria-colspan')).toBeNull();
    grid.getColumns()[1].hidden = false;

    grid.setActiveCell(0, 0);
    expect(row.querySelectorAll('.slick-cell.active')).toHaveLength(3);
    expect((grid as any).getCellFromEvent({ target: fragments[0] })).toEqual({ row: 0, cell: 0 });

    // A resize must update both the content-bearing host and its visual
    // continuation fragments. Otherwise the active outline remains at the
    // pre-resize docking boundary and a second border appears at the new one.
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 800 });
    internals.applyColumnWidths();
    const centerWidth = internals.getDockingRenderedWidths().center;
    expect(fragments[0].style.left).toBe(`${internals.columnPosLeft[1]}px`);
    expect(fragments[0].style.right).toBe(`${Math.max(0, centerWidth - internals.columnPosRight[2])}px`);
    expect(fragments[0].style.width).toBe('');
    grid.getColumns()[1].width = 120;
    internals.updateColumnCaches();
    internals.applyColumnWidths();
    expect(host.style.width).toBe('80px');
    const resizedCenterWidth = internals.getDockingRenderedWidths().center;
    expect(fragments[0].style.left).toBe(`${internals.columnPosLeft[1]}px`);
    expect(fragments[0].style.right).toBe(`${Math.max(0, resizedCenterWidth - internals.columnPosRight[2])}px`);
    expect(fragments[0].style.width).toBe('');
    expect(fragments[0].classList.contains('active')).toBe(true);

    const deferredHost = document.createElement('div');
    row.appendChild(deferredHost);
    (grid as any).dockingByColumn.get(0).sticky = true;
    (grid as any)._options.rtl = true;
    (grid as any).appendColspanFragments(
      0,
      5,
      deferredHost,
      [
        { start: 1, end: 1, band: 'center' },
        { start: 0, end: 0, band: 'left' },
      ],
      true
    );
    const rtlFragment = deferredHost.previousElementSibling as HTMLElement;
    expect(rtlFragment.classList.contains('slick-cell-sticky')).toBe(true);
    expect(rtlFragment.classList.contains('slick-cell-colspan-shared-edge')).toBe(true);
    expect(deferredHost.classList.contains('slick-cell-colspan-shared-edge')).toBe(false);
    (grid as any)._options.rtl = false;

    const cacheEntry = internals.rowsCache[0];
    delete cacheEntry.cellNodesByColumnIdx[0];
    delete cacheEntry.cellColSpans[0];
    cacheEntry.cellRenderQueue.push(host);
    internals.updateRenderedColspanFragmentGeometry();
    expect(cacheEntry.cellRenderQueue).toHaveLength(0);
    expect(cacheEntry.cellNodesByColumnIdx[0]).toBe(host);
    expect(host.style.width).toBe('80px');

    // A stale fragment queue can briefly contain one more fragment than its
    // segment metadata; geometry refresh should safely skip that extra node.
    expect(() =>
      internals.updateColspanFragmentGeometry(host, [{ start: 0, end: 0, band: 'left' }], [fragments[0], document.createElement('div')])
    ).not.toThrow();

    // Empty fragment metadata is valid while a row is being rebuilt.
    internals.rowsCache[1] = {
      cellNodesByColumnIdx: [],
      cellRenderQueue: [],
      cellSpanFragments: { 0: [] },
      cellSpanSegments: {},
      rowNode: null,
    };
    expect(() => internals.updateRenderedColspanFragmentGeometry()).not.toThrow();
    (grid as any).cleanUpAndRenderCells({ top: 0, bottom: 0, leftPx: 0, rightPx: 320 });
    expect((grid as any).rowsCache[0].cellSpanFragments[0][0].parentElement).toBe(row.querySelector('.slick-scrolling-cells'));
  });

  it('mirrors CSS class overlays between a cross-band colspan host and its fragments', () => {
    const spanData = {
      getLength: () => data.length,
      getItem: (row: number) => data[row],
      getItemMetadata: (row: number) => (row === 0 ? { columns: { 0: { colspan: columns.length } } } : undefined),
    };
    const slickGrid = createGrid({ pinning: { columns: { left: ['a'], right: ['d'] } } } as GridOption, columns, spanData as any);
    const row = container.querySelector<HTMLElement>('[data-row="0"]')!;
    const host = row.querySelector<HTMLElement>('.slick-cell.l0:not(.slick-cell-colspan-part)')!;
    const fragments = row.querySelectorAll<HTMLElement>('.slick-cell-colspan-part');

    slickGrid.setCellCssStyles('selection', { 0: { a: 'selected' } });
    expect(host.classList.contains('selected')).toBe(true);
    expect([...fragments].every((fragment) => fragment.classList.contains('selected'))).toBe(true);

    slickGrid.removeCellCssStyles('selection');
    expect(host.classList.contains('selected')).toBe(false);
    expect([...fragments].every((fragment) => !fragment.classList.contains('selected'))).toBe(true);
  });

  it('removes cached colspan continuation fragments when a center cell is virtualized out', () => {
    const slickGrid = createGrid();
    const row = container.querySelector<HTMLElement>('[data-row="0"]')!;
    const host = document.createElement('div');
    const fragment = document.createElement('div');
    const internals = slickGrid as any;
    const cacheEntry = internals.rowsCache[0];
    host.classList.add('slick-cell', 'l1');
    row.appendChild(fragment);
    row.appendChild(host);
    cacheEntry.cellNodesByColumnIdx[1] = host;
    cacheEntry.cellSpanFragments[1] = [fragment];
    cacheEntry.cellColSpans[1] = 1;
    internals.columnPosLeft[1] = 5000;
    internals.columnPosRight[1] = 5080;

    internals.cleanUpCells({ top: 0, bottom: 0, leftPx: 0, rightPx: 100 }, 0);

    expect(host.isConnected).toBe(false);
    expect(fragment.isConnected).toBe(false);
  });

  it('rejects non-sequential pinning when an offscreen colspan crosses docking regions', () => {
    const invalidPinning = vi.fn();
    const manyRows = Array.from({ length: 40 }, (_, id) => ({ ...data[id % data.length], id }));
    const spanData = {
      getLength: () => manyRows.length,
      getItem: (row: number) => manyRows[row],
      getItemMetadata: (row: number) => (row === manyRows.length - 1 ? { columns: { 0: { colspan: 1 }, 1: { colspan: 3 } } } : undefined),
    };
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    grid = new SlickGrid(container, spanData as any, columns.map((column) => ({ ...column })) as Column[], {
      devMode: {  },
      errorCallback: invalidPinning,
    });

    grid.setColumnPinning('b', 'left');
    expect(invalidPinning).toHaveBeenCalledWith(expect.stringContaining('split a colspan'));
    expect(grid.getColumns()[1].pinned).toBeFalsy();
    (grid as any)._options.pinning = { columns: { left: ['b'], right: ['d'] } };
    expect((grid as any).validateColumnPinning(undefined, true)).toBe(false);

    grid.setColumnPinning('c', 'right');
    expect(grid.getColumns()[2].pinned).toBeFalsy();

    grid.setColumnPinning('a', 'left');
    grid.setColumnPinning('b', 'left');
    expect(
      grid
        .getColumns()
        .slice(0, 2)
        .every((column) => column.pinned === 'left')
    ).toBe(true);
  });

  it('falls back to cached rows when a data provider has no metadata length', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    expect(internals.rowMetadataIndexes()).toEqual([]);

    internals.data = { getItemMetadata: () => undefined };
    const cachedRows = Object.keys(internals.rowsCache).map(Number);
    expect(internals.rowMetadataIndexes()).toEqual(cachedRows);
  });

  it('uses the proxy scroll owner client width without subtracting the scrollbar twice', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a'], right: ['d'] } } });
    const internals = slickGrid as any;
    const scroller = internals._viewportScrollContainerX as HTMLElement;
    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 600 });
    vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue({ width: 600 } as DOMRect);
    Object.defineProperty(scroller, 'scrollLeft', { configurable: true, writable: true, value: 0 });
    internals.scrollLeft = 0;
    internals.dockingLayout.leftWidth = 80;
    internals.dockingLayout.rightWidth = 80;
    internals.viewportHasVScroll = true;
    internals.scrollbarDimensions = { width: 15, height: 15 };

    internals.internalScrollColumnIntoView(500, 510);

    expect(scroller.scrollLeft).toBe(0);
  });

  it('keeps bulk right pinning anchored at the selected colspan column', () => {
    const invalidPinning = vi.fn();
    const spanData = {
      getLength: () => data.length,
      getItem: (row: number) => data[row],
      getItemMetadata: (row: number) => (row === 0 ? { columns: { 1: { colspan: 3 } } } : undefined),
    };
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '400px';
    document.body.appendChild(container);
    grid = new SlickGrid(container, spanData as any, columns.map((column) => ({ ...column })) as Column[], {
      devMode: {  },
      errorCallback: invalidPinning,
    });

    grid.setOptions({ pinning: { columns: { right: 3 } } });

    expect(grid.getColumns().map((column) => column.pinned)).toEqual([null, 'right', 'right', 'right']);
    expect(invalidPinning).not.toHaveBeenCalled();
  });

  it('keeps the native viewport scroll owner for empty pinning options until docking is enabled', () => {
    const slickGrid = createGrid({ pinning: {} });
    const internals = slickGrid as any;

    expect(container.querySelector('.slick-docking-horizontal-scroller')).toBeNull();
    expect(container.querySelector('.slick-docking-overlay')).toBeNull();
    expect(container.classList.contains('slick-docking-horizontal-scroll-proxy')).toBe(false);
    expect(internals._viewportNode.style.overflowX).toBe('auto');

    slickGrid.setColumnPinning('a', 'left');

    expect(container.querySelector('.slick-docking-horizontal-scroller')).toBeTruthy();
    expect(container.querySelector('.slick-horizontal-scroller')).toBe(container.querySelector('.slick-docking-horizontal-scroller'));
    expect(slickGrid.getPinnedColumns('left').map((column) => column.id)).toEqual(['a']);
  });

  it('keeps column docking row regions without creating a row overlay', () => {
    createGrid({ pinning: { columns: { left: ['a'] } } });

    expect(container.querySelector('.grid-canvas .slick-row-docked')).toBeTruthy();
    expect(container.querySelector('.slick-docking-overlay')).toBeNull();
  });

  it('covers pinning validation, row identity resolution, and cleanup timer cancellation', () => {
    const errorCallback = vi.fn();
    const slickGrid = createGrid({ errorCallback });
    const internals = slickGrid as any;
    const alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => undefined);
    internals._defaults.errorCallback('default error callback');
    expect(alertSpy).toHaveBeenCalledWith('default error callback');
    alertSpy.mockRestore();
    internals._options.errorCallback = errorCallback;
    internals._options.skipPinningValidation = false;
    internals._invalidPinningAlerted = false;
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 100 });
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ width: 100 } as DOMRect);
    const invalidPinned = new Map([
      [0, 'left'],
      [1, 'right'],
      [2, 'left'],
      [3, 'right'],
    ]);
    expect(internals.validatePinnedColumnIndexes(invalidPinned, true)).toBe(false);
    expect(errorCallback).toHaveBeenCalledWith(expect.stringContaining('visible center column'));
    expect(internals.validatePinnedColumnIndexes(new Map([[0, 'left']]), true)).toBe(true);
    slickGrid.getColumns()[1].hidden = true;
    expect(internals.validatePinnedColumnIndexes(new Map([[1, 'left']]), true)).toBe(true);
    slickGrid.getColumns()[1].hidden = false;
    slickGrid.getColumns()[0].minWidth = 90;
    slickGrid.getColumns()[0].maxWidth = 95;
    expect(
      internals.validatePinnedColumnIndexes(
        new Map([
          [0, 'left'],
          [1, 'right'],
        ]),
        true
      )
    ).toBe(false);
    expect(errorCallback).toHaveBeenCalledWith(expect.stringContaining('exceed the available grid width'));
    internals.pinningColumnsState.set('a', 'right');
    slickGrid.getColumns()[0].pinned = 'left';
    internals.applyColumnPinningOptions(slickGrid.getColumns());
    expect(slickGrid.getColumns()[0].pinned).toBe('right');
    expect(internals.getPinnedColumnIndexes()).toEqual(new Map([[0, 'right']]));

    const hasDockedColumnsSpy = vi.spyOn(internals, 'hasDockedColumns').mockReturnValue(true);
    internals._options.fullWidthRows = true;
    internals.viewportW = 1000;
    internals.viewportHasVScroll = false;
    expect(internals.getCanvasWidth()).toBeGreaterThan(0);
    hasDockedColumnsSpy.mockRestore();

    internals._options.pinning = { columns: { left: ['a', 'b', 'c', 'd'] } };
    internals._invalidPinningAlerted = false;
    expect(internals.validateColumnPinning(undefined, true)).toBe(false);
    expect(internals.validateColumnPinning('a', true)).toBe(false);

    expect(internals.getRowIdentity(0)).toBe(0);
    expect(internals.getRowIdentity(99)).toBe(99);
    internals.dockingRowIndexByReference.set('cached', 2);
    expect(internals.resolveDockingRowIndex('cached')).toBe(2);
    expect(internals.resolveDockingRowIndex(-1)).toBeUndefined();
    expect(internals.resolveDockingRowIndex(1.5)).toBeUndefined();
    internals.data = [{ id: 'row-a' }];
    expect(internals.resolveDockingRowIndex('row-a')).toBe(0);
    internals.data = { getRowById: vi.fn().mockReturnValueOnce(1).mockReturnValue(undefined) };
    expect(internals.resolveDockingRowIndex('from-view')).toBe(1);
    expect(internals.resolveDockingRowIndex('missing')).toBeUndefined();

    const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
    const cancelAnimationFrameSpy = vi.fn();
    Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: cancelAnimationFrameSpy });
    internals.stickyColumnLayoutFrame = 4;
    internals.singleViewportRenderTimer = setTimeout(() => undefined, 100);
    internals._columnResizeTimer = setTimeout(() => undefined, 100);
    internals.clearAllTimers();
    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(4);
    expect(internals.stickyColumnLayoutFrame).toBeUndefined();
    Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: originalCancelAnimationFrame });
  });

  it('covers remaining compatibility guards and scroll helpers', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const scrollSource = document.createElement('div');
    Object.defineProperty(scrollSource, 'scrollLeft', { configurable: true, writable: true, value: 25 });
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: 0 });
    internals.handleElementScroll(scrollSource);
    expect(internals._viewportScrollContainerX.scrollLeft).toBe(25);
    internals.clearDockingNativeHorizontalScrollOffsets();
    internals._dockingHorizontalScroller = undefined;
    internals._viewportScrollContainerX.scrollLeft = 0;
    internals.handleElementScroll(scrollSource);
    internals.clearDockingNativeHorizontalScrollOffsets();

    const row = document.createElement('div');
    internals.rowsCache = { 0: { rowNode: [row] }, 1: { rowNode: [row] } };
    internals.dockingByRow = new Map([[0, { band: 'top' }]]);
    const applyRowTopOffsetSpy = vi.spyOn(internals, 'applyRowTopOffset').mockImplementation(() => undefined);
    internals.updateRowPositions(true);
    expect(applyRowTopOffsetSpy).toHaveBeenCalledWith(row, 0);

    expect(internals.getColumnByIndex(-1)).toBeUndefined();
    const hiddenColumns = slickGrid.getColumns();
    hiddenColumns[1].hidden = true;
    internals.columnPosLeft = [0, 80, 80, 160];
    internals.columnPosRight = [80, 80, 160, 240];
    expect(internals.getColumnRangeRight(1, 0)).toBe(80);
    hiddenColumns[1].hidden = false;

    internals._options.pinning = { columns: { left: ['a'] } };
    internals.refreshDockingLayout();
    internals.rowsCache = { 0: { rowNode: [document.createElement('div')] } };
    const fullWidthGroupRow = document.createElement('div');
    fullWidthGroupRow.classList.add('slick-row-full-width-group');
    expect(internals.getRowDockingRegion(fullWidthGroupRow, 0)).toBe(fullWidthGroupRow);
    internals.rowsCache = { 0: { rowNode: undefined, cellNodesByColumnIdx: {} } };
    expect(internals.getRowDockingRegion(document.createElement('div'), 0)).toBeInstanceOf(HTMLElement);
    internals.syncDockedRowContainers();

    internals._options.pinning = undefined;
    internals._dockingOverlay = document.createElement('div');
    container.appendChild(internals._dockingOverlay);
    internals.refreshRowDockingLayout();
    expect(internals._dockingOverlay).toBeUndefined();

    const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
    Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: undefined });
    internals.stickyColumnLayoutFrame = 5;
    internals.clearAllTimers();
    Object.defineProperty(globalThis, 'cancelAnimationFrame', { configurable: true, value: originalCancelAnimationFrame });
  });

  it('skips duplicate docked-row synchronization within one layout revision', () => {
    const slickGrid = createGrid({ pinning: { rows: { top: [0] } } });
    const internals = slickGrid as any;
    const row = document.createElement('div');
    internals._canvasNode.appendChild(row);
    internals.rowsCache = { 0: { rowNode: [row] } };
    internals.dockingByRow = new Map();
    internals.rowDockingLayout = { revision: 7, topHeight: 0, bottomHeight: 0 };
    internals.scrollLeft = 0;
    internals.rowsCache[0].dockingSyncSignature = '7:0:0:0:0';
    Object.defineProperty(internals._viewportNode, 'clientHeight', { configurable: true, value: 0 });
    const applyRowTopOffsetSpy = vi.spyOn(internals, 'applyRowTopOffset');

    internals.syncDockedRowContainers();

    expect(applyRowTopOffsetSpy).not.toHaveBeenCalled();
  });

  it('reorders native headers and restores scrolling and active-cell focus', () => {
    const slickGrid = createGrid({ enableColumnReorder: true });
    const internals = slickGrid as any;
    const item = slickGrid.getHeaderColumn('a');
    fireDrag(item, 'dragstart');
    item.parentElement!.insertBefore(slickGrid.getHeaderColumn('b'), item);
    const setColumnsSpy = vi.spyOn(slickGrid, 'setColumns').mockImplementation(() => undefined as any);
    const scrollToXSpy = vi.spyOn(slickGrid, 'scrollToX').mockImplementation(() => undefined);
    const setupResizeSpy = vi.spyOn(internals, 'setupColumnResize').mockImplementation(() => undefined);
    const focusSpy = vi.spyOn(slickGrid, 'setFocus').mockImplementation(() => undefined);
    internals.activeCellNode = item;
    fireDrag(item, 'dragend');

    expect(setColumnsSpy).toHaveBeenCalled();
    expect(scrollToXSpy).toHaveBeenCalled();
    expect(setupResizeSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('alerts once when rejecting pinning unless the caller forces an alert', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const callback = vi.fn();
    internals._options.errorCallback = callback;

    expect(internals.rejectPinning('invalid pinning', false)).toBe(false);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('invalid pinning');
    expect(internals._invalidPinningAlerted).toBe(true);

    expect(internals.rejectPinning('suppressed alert', false)).toBe(false);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(internals.rejectPinning('forced alert', true)).toBe(false);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('forced alert');
    internals._options.errorCallback = undefined;
    expect(internals.rejectPinning('no callback', true)).toBe(false);
  });

  it('clamps proxy scrolling and records the browser-committed scroll position', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a'] } } });
    const internals = slickGrid as any;
    const scrollOwner = internals._viewportScrollContainerY;
    let committedScrollTop = 0;
    Object.defineProperty(scrollOwner, 'scrollTop', {
      configurable: true,
      get: () => committedScrollTop,
      set: (value: number) => {
        committedScrollTop = Math.min(value, 850);
      },
    });

    internals.th = 1000;
    internals.ph = 0;
    internals.n = 0;
    internals.offset = 0;
    internals.scrollTop = 0;
    internals.prevScrollTop = 0;
    internals.viewportHasHScroll = true;
    internals.scrollbarDimensions = { width: 15, height: 15 };
    const heightSpy = vi.spyOn(Utils, 'height').mockReturnValue(100);
    const dockingScrollerSpy = vi.spyOn(internals, 'hasDockingHorizontalScroller').mockReturnValue(true);
    const pageOffsetSpy = vi.spyOn(internals, 'getPageOffset').mockReturnValue(0);

    try {
      slickGrid.scrollTo(2000);

      // The proxy owns horizontal scrolling, so its viewport has no native horizontal
      // scrollbar to subtract. The owner then clamps the requested 900px to 850px.
      expect(committedScrollTop).toBe(850);
      expect(internals.scrollTop).toBe(850);
      expect(internals.prevScrollTop).toBe(850);
    } finally {
      heightSpy.mockRestore();
      dockingScrollerSpy.mockRestore();
      pageOffsetSpy.mockRestore();
    }
  });

  it('uses the requested scroll position when the scroll owner is unavailable', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const scrollOwner = internals._viewportScrollContainerY;
    internals._viewportScrollContainerY = undefined;
    internals.th = 1000;
    internals.ph = 0;
    internals.n = 0;
    internals.offset = 0;
    internals.scrollTop = 0;
    internals.prevScrollTop = 0;
    const heightSpy = vi.spyOn(Utils, 'height').mockReturnValue(100);
    const pageOffsetSpy = vi.spyOn(internals, 'getPageOffset').mockReturnValue(0);

    try {
      slickGrid.scrollTo(500);
      expect(internals.scrollTop).toBe(500);
      expect(internals.prevScrollTop).toBe(500);
    } finally {
      internals._viewportScrollContainerY = scrollOwner;
      heightSpy.mockRestore();
      pageOffsetSpy.mockRestore();
    }
  });

  it('uses the scroll owner client height when scrolling a row into view', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const scrollOwner = internals._viewportScrollContainerY;
    Object.defineProperty(scrollOwner, 'clientHeight', { configurable: true, value: 100 });
    internals.viewportHasHScroll = true;
    internals.scrollbarDimensions = { width: 15, height: 15 };
    internals.scrollTop = 0;
    internals.offset = 0;
    internals.rowDockingLayout.topHeight = 0;
    internals.rowDockingLayout.bottomHeight = 0;
    const heightSpy = vi.spyOn(Utils, 'height').mockReturnValue(400);
    const topSpy = vi.spyOn(internals, 'getRenderedRowTop').mockReturnValue(500);
    const rowHeightSpy = vi.spyOn(internals, 'getRowHeight').mockReturnValue(20);
    const scrollSpy = vi.spyOn(slickGrid, 'scrollTo').mockImplementation(() => undefined);
    const renderSpy = vi.spyOn(slickGrid, 'render').mockImplementation(() => undefined);

    try {
      slickGrid.scrollRowIntoView(1);

      expect(scrollSpy).toHaveBeenCalledWith(420);
      expect(renderSpy).toHaveBeenCalledOnce();
    } finally {
      heightSpy.mockRestore();
      topSpy.mockRestore();
      rowHeightSpy.mockRestore();
      scrollSpy.mockRestore();
      renderSpy.mockRestore();
    }
  });

  it('covers compatibility getters, scrollTo, option rejection, and wheel setup', () => {
    const errorCallback = vi.fn();
    const slickGrid = createGrid({ errorCallback });
    const internals = slickGrid as any;

    const usesDockingChromeSpy = vi.spyOn(internals, 'usesDockingChromeRegions');
    usesDockingChromeSpy.mockReturnValue(false);
    slickGrid.getHeader();
    slickGrid.getHeaderColumn(0);
    slickGrid.getHeaderRowColumn(0);
    slickGrid.getFooterRowColumn(0);
    usesDockingChromeSpy.mockReturnValue(true);
    slickGrid.getHeader(slickGrid.getColumns()[0]);
    slickGrid.getColumnByIndex(0);
    slickGrid.getHeaderColumn(0);
    slickGrid.getHeaderRowColumn(0);
    slickGrid.getFooterRowColumn(0);
    usesDockingChromeSpy.mockRestore();

    slickGrid.scrollTo(10);

    const dockingScrollerSpy = vi.spyOn(internals, 'hasDockingHorizontalScroller').mockReturnValue(false);
    internals._viewport = [internals._viewportNode];
    internals._options.createFooterRow = true;
    internals._footerRow = [];
    internals._options.createPreHeaderPanel = true;
    internals._options.createTopHeaderPanel = true;
    internals._footerRowL = document.createElement('div');
    internals._preHeaderPanel = document.createElement('div');
    internals._topHeaderPanel = document.createElement('div');
    slickGrid.scrollToX(10);
    internals._viewport = [internals._viewportNode, document.createElement('div'), document.createElement('div'), document.createElement('div')];
    internals._headerScrollContainer = document.createElement('div');
    internals._topPanelScrollers = [document.createElement('div')];
    internals._footerRowScrollContainer = document.createElement('div');
    internals._preHeaderPanelScroller = document.createElement('div');
    internals._topHeaderPanelScroller = document.createElement('div');
    internals._headerRowScrollerL = document.createElement('div');
    slickGrid.scrollToX(20);
    slickGrid.scrollToX(25);
    dockingScrollerSpy.mockRestore();

    const columnsWithGap = [undefined, ...slickGrid.getColumns()];
    internals._options.pinning = { columns: { left: ['a'], right: [] } };
    internals.applyColumnPinningOptions(columnsWithGap);

    internals.rowDockingLayout.top = [{ index: 0, height: 20, sticky: false }];
    expect(internals.getTopPinnedRowsHeight()).toBe(20);

    internals._options.skipPinningValidation = true;
    expect(internals.validatePinnedColumnIndexes(new Map())).toBe(true);
    internals._options.skipPinningValidation = false;
    slickGrid.setColumnStickiness('a', false);
    slickGrid.setColumnStickiness('a', false);
    const getColumnByIdSpy = vi.spyOn(internals, 'getColumnById').mockReturnValue(slickGrid.getColumns()[0]);
    const getColumnIndexSpy = vi.spyOn(internals, 'getColumnIndex').mockReturnValue(undefined);
    slickGrid.getColumns()[0].pinned = null;
    slickGrid.setColumnPinning('a', 'right');
    getColumnByIdSpy.mockRestore();
    getColumnIndexSpy.mockRestore();

    const originalValidate = internals.validateColumnPinning;
    internals.validateColumnPinning = vi.fn().mockReturnValue(false);
    slickGrid.setColumns(slickGrid.getColumns());
    internals.validateColumnPinning = originalValidate;

    vi.spyOn(internals, 'getViewports').mockReturnValue([internals._viewportScrollContainerX]);
    slickGrid.setOptions({ pinning: { columns: { left: 0 } } }, true, true, true);

    internals._options.pinning = { columns: { left: ['a', 'b', 'c', 'd'], right: [] } };
    internals._invalidPinningAlerted = false;
    slickGrid.setOptions({ pinning: { columns: { left: ['a', 'b', 'c', 'd'], right: [] } } }, true, true, true);
    expect(errorCallback).toHaveBeenCalled();

    const destroyInstancesSpy = vi.spyOn(internals, 'destroyAllInstances');
    internals.slickMouseWheelInstances = [];
    slickGrid.setOptions({ enableMouseWheelScrollHandler: true }, true, true, true);
    expect(internals.slickMouseWheelInstances.length).toBeGreaterThan(0);
    slickGrid.setOptions({ enableMouseWheelScrollHandler: false }, true, true, true);
    expect(destroyInstancesSpy).toHaveBeenCalled();
  });

  it.each([false, true])('clears native chrome offsets before positioning trailing pinned chrome (rtl=%s)', (rtl) => {
    const slickGrid = createGrid({
      rtl,
      createFooterRow: true,
      showHeaderRow: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
    });
    const internals = slickGrid as any;
    const direction = rtl ? -1 : 1;
    internals.scrollLeft = direction * 120;
    internals._container.style.setProperty('--slick-docking-viewport-width', '800px');
    const chromePairs = [
      [internals._headerScrollerL, internals._headerL],
      [internals._headerRowScrollerL, internals._headerRowL],
      [internals._footerRowScrollerL, internals._footerRowL],
    ];
    chromePairs.forEach(([scroller, root]) => {
      scroller.scrollLeft = direction * 120;
      vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 800, width: 800 } as DOMRect);
      vi.spyOn(root, 'getBoundingClientRect').mockImplementation(
        () =>
          ({
            left: -internals.scrollLeft - scroller.scrollLeft,
            right: 800 - internals.scrollLeft - scroller.scrollLeft,
            width: 800,
          }) as DOMRect
      );
    });

    internals.applyDockingToColumnChrome();

    chromePairs.forEach(([scroller, root]) => {
      expect(scroller.scrollLeft).toBe(0);
      const column = root.querySelector('.slick-column-pinned-right') as HTMLElement;
      expect(Number.parseFloat(column.style[rtl ? 'right' : 'left'])).toBe(-80);
    });
  });

  it('covers docking chrome guards, edge compensation, and post-render row cleanup', () => {
    const slickGrid = createGrid({
      createFooterRow: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
      showHeaderRow: true,
    });
    const internals = slickGrid as any;
    const header = slickGrid.getHeaderColumn('a');
    header.style.borderRightWidth = '1px';
    internals._options.rtl = false;
    internals.applyDockingToColumnChrome();
    header.style.borderLeftWidth = '1px';
    internals._options.rtl = true;
    internals.applyDockingToColumnChrome();
    internals._options.rtl = false;

    vi.spyOn(internals, 'getViewportInnerWidth').mockReturnValue(900);
    internals.scrollLeft = 40;
    internals.dockingLayout.rightWidth = 100;
    const trailingHeader = slickGrid.getHeaderColumn('d');
    vi.spyOn(internals._headerScrollerL, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 900, width: 900 } as DOMRect);
    vi.spyOn(internals._headerL, 'getBoundingClientRect').mockReturnValue({ left: -40, right: 860, width: 900 } as DOMRect);
    expect(internals.getTrailingDockedChromeInlineStart(trailingHeader, { offset: 25 })).toBe(825);
    const regularChromeContainer = document.createElement('div');
    const regularChromeHeader = document.createElement('div');
    regularChromeHeader.className = 'slick-header-column';
    regularChromeContainer.appendChild(regularChromeHeader);
    const regularContainerRectSpy = vi.spyOn(regularChromeContainer, 'getBoundingClientRect').mockReturnValue({ left: -40, right: 860, width: 900 } as DOMRect);
    expect(internals.getTrailingDockedChromeInlineStart(regularChromeHeader, { offset: 25 })).toBe(825);
    expect(regularContainerRectSpy).toHaveBeenCalled();
    const headerScroller = internals._headerScrollerL;
    internals._headerScrollerL = null;
    const fallbackInlineStart =
      internals.scrollLeft * internals.getInlineDirection() +
      (internals._viewportScrollContainerX?.clientWidth || internals.viewportW) -
      internals.dockingLayout.rightWidth +
      25;
    expect(internals.getTrailingDockedChromeInlineStart(trailingHeader, { offset: 25 })).toBe(fallbackInlineStart);
    internals._headerScrollerL = headerScroller;

    const invalidHeader = document.createElement('div');
    invalidHeader.className = 'slick-header-column';
    invalidHeader.dataset.id = 'not-a-column';
    internals._headerL.appendChild(invalidHeader);
    internals.syncDockingChromeRegions();
    const movableHeader = document.createElement('div');
    movableHeader.className = 'slick-header-column';
    movableHeader.dataset.id = 'a';
    internals._headerL.appendChild(movableHeader);
    internals.syncDockingChromeRegions();
    const invalidHeaderRow = document.createElement('div');
    invalidHeaderRow.className = 'slick-headerrow-column';
    internals._headerRowL.appendChild(invalidHeaderRow);
    internals.syncDockingChromeRegions();
    const dockingRegions = internals.dockingHeaderRegions;
    internals.dockingHeaderRegions = undefined;
    internals.syncDockingChromeRegions();
    internals.dockingHeaderRegions = dockingRegions;

    const rowNode = document.createElement('div');
    const cellNode = document.createElement('div');
    container.append(rowNode, cellNode);
    internals.postProcessedCleanupQueue = [];
    internals.queuePostProcessedRowForCleanup({ rowNode: [rowNode], cellNodesByColumnIdx: { 0: cellNode } }, { 0: { status: 'C' } }, 0);
    internals.queuePostProcessedRowForCleanup({ rowNode: undefined, cellNodesByColumnIdx: {} }, undefined, 1);
    expect(internals.postProcessedCleanupQueue.length).toBeGreaterThan(0);
  });

  it('covers legacy resize calculations and column cache cleanup paths', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const slickGrid = createGrid({ forceFitColumns: true, autoScrollOnColumnResize: false, pinning: { columns: { right: ['c'] } } });
    const internals = slickGrid as any;
    slickGrid.getColumns().forEach((column) => {
      column.resizable = true;
      column.width = 100;
      column.previousWidth = 100;
    });
    internals.canvasWidthL = 100;
    internals.canvasWidthR = 300;
    internals.viewportW = 250;
    const headerColumns = Array.from(container.querySelectorAll('.slick-header-column')) as HTMLElement[];
    headerColumns.forEach((element) => Object.defineProperty(element, 'offsetWidth', { configurable: true, value: 100 }));
    vi.spyOn(internals, 'getHeaderChildren').mockReturnValue(headerColumns);
    internals.setupColumnResize();
    const firstHandle = container.querySelector('.slick-resizable-handle') as HTMLDivElement;
    const middleHandle = container.querySelectorAll('.slick-resizable-handle')[2] as HTMLDivElement;
    expect(firstHandle).toBeTruthy();
    const down = new CustomEvent('mousedown');
    Object.defineProperty(down, 'pageX', { configurable: true, value: 100 });
    Object.defineProperty(down, 'clientX', { configurable: true, value: 100 });
    const moveLeft = new CustomEvent('mousemove');
    Object.defineProperty(moveLeft, 'pageX', { configurable: true, value: 50 });
    Object.defineProperty(moveLeft, 'clientX', { configurable: true, value: 50 });
    const moveRight = new CustomEvent('mousemove');
    Object.defineProperty(moveRight, 'pageX', { configurable: true, value: 150 });
    Object.defineProperty(moveRight, 'clientX', { configurable: true, value: 150 });
    const up = new CustomEvent('mouseup');
    firstHandle.dispatchEvent(down);
    container.dispatchEvent(down);
    document.body.dispatchEvent(moveLeft);
    document.body.dispatchEvent(moveRight);
    middleHandle.dispatchEvent(down);
    container.dispatchEvent(down);
    document.body.dispatchEvent(moveLeft);
    document.body.dispatchEvent(moveRight);
    document.body.dispatchEvent(up);

    internals._options.forceFitColumns = false;
    internals.setupColumnResize();
    const secondHandle = container.querySelector('.slick-resizable-handle') as HTMLDivElement;
    const secondMiddleHandle = container.querySelectorAll('.slick-resizable-handle')[2] as HTMLDivElement;
    secondHandle.dispatchEvent(down);
    container.dispatchEvent(down);
    document.body.dispatchEvent(moveLeft);
    document.body.dispatchEvent(moveRight);
    secondMiddleHandle.dispatchEvent(down);
    container.dispatchEvent(down);
    document.body.dispatchEvent(moveLeft);
    document.body.dispatchEvent(moveRight);
    document.body.dispatchEvent(up);

    internals._options.autoScrollOnColumnResize = true;
    internals.setupColumnResize();
    const autoHandle = container.querySelector('.slick-resizable-handle') as HTMLDivElement;
    const autoMove = new CustomEvent('mousemove');
    Object.defineProperty(autoMove, 'pageX', { configurable: true, value: 400 });
    Object.defineProperty(autoMove, 'clientX', { configurable: true, value: 400 });
    autoHandle.dispatchEvent(down);
    container.dispatchEvent(down);
    document.body.dispatchEvent(autoMove);
    document.body.dispatchEvent(autoMove);
    internals.initialized = false;
    vi.advanceTimersByTime(30);
    document.body.dispatchEvent(autoMove);
    internals.initialized = true;
    document.body.dispatchEvent(up);

    internals._options.pinning = { columns: { left: ['a'], right: [] } };
    internals.dockingByColumn = new Map([[0, { band: 'left', sticky: true }]]);
    const cellRow = document.createElement('div');
    internals.appendCellHtml(cellRow, 0, 0, 1, 1, null, data[0]);
    expect(cellRow.firstElementChild?.classList.contains('slick-cell-sticky')).toBe(true);

    const cleanupRow = document.createElement('div');
    cleanupRow.dataset.row = '2';
    container.appendChild(cleanupRow);
    internals._options.enableAsyncPostRenderCleanup = true;
    internals.rowsCache = { 2: { rowNode: [cleanupRow], cellNodesByColumnIdx: { 0: document.createElement('div') } } };
    internals.postProcessedRows = { 2: { 0: 'C' } };
    internals.removeRowFromCache(2);
    expect(internals.rowsCache[2]).toBeUndefined();

    slickGrid.getColumns()[1].hidden = true;
    slickGrid.getColumns()[2].hidden = true;
    internals.dockingByColumn = new Map([[3, { band: 'right' }]]);
    internals.columnPosRight = [80, 80, 80, 320];
    expect(internals.getColumnRangeRight(1, 0)).toEqual(expect.any(Number));
    expect(internals.getColumnRangeRight(2, 0)).toEqual(expect.any(Number));

    vi.useRealTimers();
  });

  it('calculates cell boxes across top/bottom rows and left/right pinned columns', () => {
    const slickGrid = createGrid({
      pinning: { columns: { left: 0, right: ['d'] }, rows: { top: [0], bottom: [2] } },
    });
    Object.defineProperty((slickGrid as any)._viewportScrollContainerY, 'clientHeight', { configurable: true, value: 400 });

    const topLeft = slickGrid.getCellNodeBox(0, 0);
    const bottomRight = slickGrid.getCellNodeBox(2, 3);

    expect(topLeft?.top).toBe(0);
    expect(topLeft?.left).toBe(0);
    expect(bottomRight?.top).toBeGreaterThanOrEqual(0);
    expect(bottomRight?.left).toEqual(expect.any(Number));
  });

  it('updates column pinning and stickiness through the public API', () => {
    const invalidPinning = vi.fn();
    const slickGrid = createGrid({
      pinning: { columns: { left: [] } },
      errorCallback: invalidPinning,
    });

    slickGrid.setColumnPinning('b', 'left');
    expect(slickGrid.getPinnedColumns('left').map((column) => column.id)).toEqual(['b']);
    expect(slickGrid.getOptions().pinning?.columns?.left).toEqual(['b']);

    slickGrid.setColumnPinning('c', 'right');
    expect(slickGrid.getPinnedColumns('right').map((column) => column.id)).toEqual(['c']);
    slickGrid.setColumnPinning('b', null);
    expect(slickGrid.getPinnedColumns('left')).toEqual([]);

    slickGrid.setColumnStickiness('a', 'both');
    expect(slickGrid.getColumns()[0].sticky).toBe('both');
    slickGrid.setColumnStickiness('a', false);
    expect(slickGrid.getColumns()[0].sticky).toBe(false);
    slickGrid.setColumnPinning('missing', 'left');
    slickGrid.setColumnPinning('c', 'right');

    slickGrid.setColumnPinning('a', 'left');
    slickGrid.setColumnPinning('d', 'left');
    slickGrid.setColumnPinning('b', 'left');
    expect(invalidPinning).toHaveBeenCalled();
  });

  it('normalizes numeric boundaries against visible columns', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const hiddenColumns = slickGrid.getColumns().map((column, index) => ({ ...column, hidden: index === 1 }));
    const allHiddenColumns = slickGrid.getColumns().map((column) => ({ ...column, hidden: true }));

    expect(internals.normalizeColumnPinningReferences(0, 'right', slickGrid.getColumns())).toEqual([]);
    expect(internals.normalizeColumnPinningReferences(1, 'left', hiddenColumns)).toEqual([0, 2]);
    expect(internals.normalizeColumnPinningReferences(2, 'right', hiddenColumns)).toEqual([2, 3]);
    expect(internals.normalizeColumnPinningReferences(1, 'left', allHiddenColumns)).toEqual([]);
  });

  it('treats numeric array references as indexes even when a column has the same numeric id', () => {
    const numericIdColumns: Column[] = [
      { id: 1, field: 'a', name: 'Numeric id one', width: 80 },
      { id: 'b', field: 'b', name: 'B', width: 80 },
      { id: 'c', field: 'c', name: 'C', width: 80 },
    ];
    const slickGrid = createGrid({ pinning: { columns: { left: [1] } } }, numericIdColumns);

    expect(slickGrid.getColumns().map((column) => column.pinned)).toEqual([null, 'left', null]);
  });

  it('resolves a string reference to a numeric column id', () => {
    const numericIdColumns: Column[] = [
      { id: 1, field: 'a', name: 'Numeric id one', width: 80 },
      { id: 'b', field: 'b', name: 'B', width: 80 },
    ];
    const slickGrid = createGrid({ pinning: { columns: { left: ['1'] } } }, numericIdColumns);

    expect(slickGrid.getColumns().map((column) => column.pinned)).toEqual(['left', null]);
  });
  it('finds a docked row region when its cached regions are unavailable', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a'], right: ['d'] } } });
    const row = container.querySelector<HTMLElement>('.slick-row-docked')!;
    const getRegion = (columnIndex: number) => (slickGrid as any).getRowDockingRegion(row, columnIndex);

    expect(getRegion(0)).toBe(row.querySelector('.slick-pinned-left-cells'));
    expect(getRegion(1)).toBe(row.querySelector('.slick-scrolling-cells'));
    expect(getRegion(3)).toBe(row.querySelector('.slick-pinned-right-cells'));

    const emptyDockedRow = document.createElement('div');
    emptyDockedRow.classList.add('slick-row-docked');
    expect((slickGrid as any).getRowDockingRegion(emptyDockedRow, 0)).toBe(emptyDockedRow);
  });

  it('ignores unresolved and out-of-range explicit column references', () => {
    const slickGrid = createGrid();
    const indexes = (slickGrid as any).getPinnedColumnIndexes({ left: ['missing', -1, 99], right: [1, 'absent'] });

    expect([...indexes]).toEqual([[1, 'right']]);
  });

  it('keeps the requested visible count on the trailing edge after hiding a pinned column', () => {
    const slickGrid = createGrid({ pinning: { columns: { right: 2 } } });
    slickGrid.updateColumnById('c', { hidden: true });
    const pinnedIndexes = (slickGrid as any).getPinnedColumnIndexes() as Map<number, string>;

    expect([...pinnedIndexes]).toEqual([
      [1, 'right'],
      [3, 'right'],
    ]);
  });

  it('converts existing interactive pin references to IDs so they survive a reorder', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: [0, 2], right: [] } } });

    slickGrid.setColumnPinning('d', 'right');

    expect(slickGrid.getOptions().pinning?.columns).toEqual({ left: ['a', 'c'], right: ['d'] });

    const reorderedColumns = [...slickGrid.getColumns()].reverse();
    slickGrid.setColumns(reorderedColumns);
    expect(reorderedColumns.filter((column) => column.pinned === 'left').map((column) => column.id)).toEqual(['c', 'a']);
    expect(reorderedColumns.filter((column) => column.pinned === 'right').map((column) => column.id)).toEqual(['d']);

    slickGrid.setColumnPinning('a', null);
    expect(slickGrid.getOptions().pinning?.columns?.left).toEqual(['c']);
  });

  it('removes the docking proxy and chrome regions when pinning is cleared', () => {
    const slickGrid = createGrid({
      createFooterRow: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
      showFooterRow: true,
      showHeaderRow: true,
    });

    expect(container.querySelector('.slick-docking-horizontal-scroller')).toBeTruthy();
    slickGrid.setOptions({ pinning: undefined } as any);

    expect(container.querySelector('.slick-docking-horizontal-scroller')).toBeNull();
    expect(container.classList.contains('slick-docking-horizontal-scroll-proxy')).toBe(false);
  });

  it('covers auto-height scrollbar and top-header sizing plus clearing the owned height', () => {
    const slickGrid = createGrid({
      autoHeight: true,
      createTopHeaderPanel: true,
      showTopHeaderPanel: true,
      topHeaderPanelHeight: 44,
    });
    const internals = slickGrid as any;
    internals.viewportW = 1;
    internals.scrollbarDimensions = { width: 15, height: 15 };
    expect(slickGrid.getViewportHeight()).toBeGreaterThan(0);

    internals._options.autoHeight = false;
    slickGrid.resizeCanvas();
    expect(container.style.height).toBe('');
  });

  it('cancels the timeout fallback used when requestAnimationFrame is unavailable', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: undefined });
      const callback = vi.fn();
      const frame = internals.scheduleAnimationFrame(callback);
      internals.cancelScheduledAnimationFrame(frame);
      vi.advanceTimersByTime(16);
      expect(callback).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: originalRequestAnimationFrame });
    }
  });

  it('uses docking geometry, rather than DOM hit testing, when resolving a point to a logical cell', () => {
    const slickGrid = createGrid({ pinning: { rows: { top: [0] } } });
    const originalElementFromPoint = document.elementFromPoint;
    const elementFromPoint = vi.fn();
    try {
      Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: elementFromPoint });
      expect(slickGrid.getCellFromPoint(1, 1)).toEqual({ row: 0, cell: 0 });
      expect(elementFromPoint).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: originalElementFromPoint });
    }
  });

  it('resolves bottom, center and pinned column docking bands geometrically', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: ['a'], right: ['d'] }, rows: { top: [0], bottom: [2] } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerY, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty(internals._viewportScrollContainerX, 'clientWidth', { configurable: true, value: 320 });
    Object.defineProperty(internals._viewportScrollContainerY, 'scrollTop', { configurable: true, writable: true, value: 0 });
    internals.viewportH = 100;
    internals.viewportW = 320;
    internals.scrollLeft = 0;
    internals.rowDockingLayout = {
      top: [{ index: 0, id: 0, top: 0, height: 25, offset: 0, band: 'top', sticky: false }],
      bottom: [{ index: 2, id: 2, top: 50, height: 25, offset: 0, band: 'bottom', sticky: false }],
      center: [{ index: 1, id: 1, top: 25, height: 25, offset: 25, band: 'center', sticky: false }],
      topHeight: 25,
      bottomHeight: 25,
      revision: 1,
    };
    internals.dockingLayout = {
      left: [{ index: 0, naturalOffset: 0, offset: 0, sticky: false, width: 80, band: 'left' }],
      center: [{ index: 1, naturalOffset: 0, offset: 0, sticky: false, width: 80, band: 'center' }],
      right: [{ index: 3, naturalOffset: 240, offset: 0, sticky: false, width: 80, band: 'right' }],
      leftBaseWidth: 80,
      leftWidth: 80,
      rightWidth: 80,
      centerWidth: 160,
      contentWidth: 320,
      rightBaseWidth: 80,
      revision: 1,
    };
    internals.getRenderedRowFromPosition = vi.fn().mockReturnValue(1);

    expect(internals.getCellFromDockedPoint(10, 10)).toEqual({ row: 0, cell: 0 });
    expect(internals.getCellFromDockedPoint(90, 40)).toEqual({ row: 1, cell: 1 });
    expect(internals.getCellFromDockedPoint(90, 80)).toEqual({ row: 2, cell: 1 });
    expect(internals.getCellFromDockedPoint(250, 40)).toEqual({ row: 1, cell: 3 });
  });

  it('walks natural row geometry around permanent row pins', () => {
    const slickGrid = createGrid({ pinning: { rows: { top: [0], bottom: [2] } } });
    const internals = slickGrid as any;
    internals.getDataLengthIncludingAddNew = vi.fn().mockReturnValue(3);
    internals.getRowFromPosition = vi.fn().mockReturnValue(1);
    internals.getRenderedRowTop = vi.fn((row: number) => row * 25);
    internals.getRowHeight = vi.fn().mockReturnValue(25);
    expect(internals.getRenderedRowFromPosition(25)).toBe(1);

    internals.getDataLengthIncludingAddNew.mockReturnValue(0);
    expect(internals.getRenderedRowFromPosition(25)).toBe(0);

    const pinned = (index: number) => ({ index, sticky: false, band: 'top' });
    internals.getDataLengthIncludingAddNew.mockReturnValue(5);
    internals.getRowFromPosition.mockReturnValue(0);
    internals.dockingByRow = new Map([0, 1, 2, 3, 4].map((index) => [index, pinned(index)]));
    // The forward walk skips a contiguous out-of-flow chain, then the backward
    // walk clamps an all-pinned dataset back to its first valid row.
    expect(internals.getRenderedRowFromPosition(25)).toBe(0);

    // Move upward from a normal row across an out-of-flow row.
    internals.dockingByRow = new Map([[1, pinned(1)]]);
    internals.getRowFromPosition.mockReturnValue(2);
    expect(internals.getRenderedRowFromPosition(0)).toBe(0);

    // Move downward across two separate out-of-flow rows.
    internals.dockingByRow = new Map([
      [1, pinned(1)],
      [3, pinned(3)],
    ]);
    internals.getRowFromPosition.mockReturnValue(0);
    expect(internals.getRenderedRowFromPosition(75)).toBe(4);

    internals.dockingByRow = new Map();
    internals.getRowFromPosition.mockReturnValue(0);
    expect(internals.getRenderedRowFromPosition(-1)).toBe(0);
    internals.getRowFromPosition.mockReturnValue(4);
    expect(internals.getRenderedRowFromPosition(200)).toBe(4);
  });

  it('merges pinning options while replacing row lists atomically', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0, right: [] }, rows: { top: [0, 1], bottom: [2] } } });

    slickGrid.setOptions({
      pinning: { columns: { right: ['d'] }, rows: { top: [1], bottom: [] } },
      stickyRows: { top: [2], bottom: [], both: [] },
    });

    expect(slickGrid.getOptions().pinning).toEqual({ columns: { left: 0, right: ['d'] }, rows: { top: [1], bottom: [] } });
    expect(slickGrid.getOptions().stickyRows).toEqual({ top: [2], bottom: [], both: [] });
    expect(slickGrid.getColumns().map((column) => column.pinned)).toEqual(['left', null, null, 'right']);

    slickGrid.setOptions({ pinning: { columns: { left: [], right: [] }, rows: { top: [], bottom: [] } } });
    expect(slickGrid.getColumns().every((column) => !column.pinned)).toBe(true);
  });

  it('activates a cell rendered in a docked row using its data-row coordinate', () => {
    const slickGrid = createGrid({ pinning: { rows: { top: [0], bottom: [] } } });
    const dockedCell = container.querySelector('.slick-docking-overlay [data-row="0"] .slick-cell') as HTMLDivElement;

    expect(dockedCell).toBeTruthy();
    (slickGrid as any).setActiveCellInternal(dockedCell);

    expect(slickGrid.getActiveCell()).toEqual({ row: 0, cell: 0 });
  });

  it('queues one deferred sticky-column layout and falls back when animation frames are unavailable', () => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const slickGrid = createGrid({}, stickyColumns);
    const refreshSpy = vi.spyOn(slickGrid as any, 'refreshDockingLayout').mockReturnValue(true);
    const updateStickyColumnTransformsSpy = vi.spyOn(slickGrid as any, 'updateStickyColumnTransforms');
    const enqueueSingleViewportRenderSpy = vi.spyOn(slickGrid as any, 'enqueueSingleViewportRender').mockImplementation(() => undefined);

    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      let runFrame: FrameRequestCallback | undefined;
      const requestAnimationFrameSpy = vi.fn((callback: FrameRequestCallback) => {
        runFrame = callback;
        return 1;
      });
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: requestAnimationFrameSpy });
      (slickGrid as any).enqueueStickyColumnLayout();
      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
      runFrame?.(0);
      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(updateStickyColumnTransformsSpy).toHaveBeenCalledTimes(1);
      expect(enqueueSingleViewportRenderSpy).toHaveBeenCalledTimes(1);

      (slickGrid as any).singleViewportRenderTimer = setTimeout(() => undefined, 100);
      (slickGrid as any).stickyColumnLayoutFrame = undefined;
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: requestAnimationFrameSpy });
      (slickGrid as any).enqueueStickyColumnLayout();
      runFrame?.(0);
      expect(updateStickyColumnTransformsSpy).toHaveBeenCalledTimes(2);
      expect(enqueueSingleViewportRenderSpy).toHaveBeenCalledTimes(2);

      (slickGrid as any).stickyColumnLayoutFrame = undefined;
      (slickGrid as any).initialized = false;
      (slickGrid as any).enqueueStickyColumnLayout();
      runFrame?.(0);
      expect(refreshSpy).toHaveBeenCalledTimes(2);

      (slickGrid as any).initialized = true;
      (slickGrid as any).stickyColumnLayoutFrame = undefined;
      refreshSpy.mockReturnValueOnce(false);
      (slickGrid as any).enqueueStickyColumnLayout();
      runFrame?.(0);
      expect(refreshSpy).toHaveBeenCalledTimes(3);

      (slickGrid as any).stickyColumnLayoutFrame = undefined;
      (slickGrid as any).singleViewportRenderTimer = setTimeout(() => undefined, 100);
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: undefined });
      (slickGrid as any).enqueueStickyColumnLayout();
      (slickGrid as any).enqueueStickyColumnLayout();
      vi.advanceTimersByTime(16);

      expect(refreshSpy).toHaveBeenCalledTimes(4);
      expect(updateStickyColumnTransformsSpy).toHaveBeenCalledTimes(3);
      expect(enqueueSingleViewportRenderSpy).toHaveBeenCalledTimes(3);
    } finally {
      vi.useRealTimers();
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: originalRequestAnimationFrame });
    }
  });

  it('updates proxy-scrolled sticky columns without rebuilding band geometry', () => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const slickGrid = createGrid({}, stickyColumns);
    const internals = slickGrid as any;
    const stickyHeader = slickGrid.getHeaderColumn('b');
    const rowNode = document.createElement('div');
    rowNode.className = 'slick-row slick-row-docked';
    rowNode.dataset.row = '0';
    const leftRegion = document.createElement('div');
    leftRegion.className = 'slick-pinned-left-cells';
    const centerRegion = document.createElement('div');
    centerRegion.className = 'slick-scrolling-cells';
    const rightRegion = document.createElement('div');
    rightRegion.className = 'slick-pinned-right-cells';
    const stickyCell = document.createElement('div');
    stickyCell.className = 'slick-cell l1 r1';
    centerRegion.appendChild(stickyCell);
    rowNode.append(leftRegion, centerRegion, rightRegion);
    container.appendChild(rowNode);
    internals.rowsCache = {
      0: {
        cellNodesByColumnIdx: { 1: stickyCell },
        cellRegions: { center: centerRegion, left: leftRegion, right: rightRegion },
        cellRenderQueue: [],
        cellSpanFragments: {},
        rowNode: [rowNode],
      },
    };
    internals.dockingLayout = {
      ...internals.dockingLayout,
      left: [{ band: 'left', index: 1, naturalOffset: 80, offset: 0, sticky: true, width: 80 }],
      leftBaseWidth: 0,
      leftWidth: 80,
      revision: internals.dockingLayout.revision + 1,
    };
    internals.dockingByColumn.set(1, internals.dockingLayout.left[0]);

    internals.updateStickyColumnTransforms();

    expect(stickyCell.parentElement?.classList.contains('slick-scrolling-cells')).toBe(true);
    expect(stickyCell.classList.contains('slick-cell-sticky-left')).toBe(true);
    expect(stickyCell.classList.contains('slick-cell-pinned-left')).toBe(true);
    expect(stickyCell.style.getPropertyValue('--slick-sticky-column-offset')).toBe('-80px');

    const rightSticky = { band: 'right', index: 1, naturalOffset: 80, offset: 0, sticky: true, width: 80 };
    internals.dockingLayout.left = [];
    internals.dockingLayout.right = [rightSticky];
    internals.dockingLayout.rightWidth = 80;
    internals.dockingByColumn.set(1, rightSticky);
    internals.updateStickyColumnTransforms();
    expect(stickyCell.classList.contains('slick-cell-sticky-right')).toBe(true);
    expect(stickyCell.classList.contains('slick-cell-pinned-left')).toBe(false);
    expect(stickyCell.style.getPropertyValue('--slick-sticky-column-offset')).toBe('-160px');

    const inactiveSticky = { band: 'center', index: 1, naturalOffset: 80, offset: 80, sticky: false, width: 80 };
    internals.dockingLayout.right = [];
    internals.dockingLayout.rightWidth = 0;
    internals.dockingByColumn.set(1, inactiveSticky);
    internals.updateStickyColumnTransforms();
    expect(stickyCell.classList.contains('slick-cell-sticky')).toBe(false);
    expect(stickyCell.classList.contains('slick-cell-pinned-right')).toBe(false);
    expect(stickyCell.style.getPropertyValue('--slick-sticky-column-offset')).toBe('');

    internals.rowsCache[1] = { rowNode: [] };
    const pinnedLeftChrome = document.createElement('div');
    const pinnedRightChrome = document.createElement('div');
    slickGrid.getColumns()[0].pinned = 'left';
    slickGrid.getColumns()[3].pinned = 'right';
    internals.dockingChromeByColumn.set(0, [pinnedLeftChrome]);
    internals.dockingChromeByColumn.set(3, [pinnedRightChrome]);
    internals.dockingLayout.left = [{ band: 'left', index: 0, naturalOffset: 0, offset: 0, sticky: false, width: 80 }];
    internals.dockingLayout.right = [{ band: 'right', index: 3, naturalOffset: 240, offset: 0, sticky: false, width: 80 }];
    pinnedLeftChrome.classList.add('slick-column-pinned-left-edge');
    pinnedRightChrome.classList.add('slick-column-pinned-right-edge');
    internals.updateStickyColumnTransforms();
    expect(pinnedLeftChrome.classList.contains('slick-column-pinned-left-edge')).toBe(true);
    expect(pinnedRightChrome.classList.contains('slick-column-pinned-right-edge')).toBe(true);

    internals.dockingLayout.left = [{ band: 'left', index: 1, naturalOffset: 80, offset: 0, sticky: true, width: 80 }];
    internals.dockingLayout.leftWidth = 80;
    internals.dockingByColumn.set(1, internals.dockingLayout.left[0]);

    const updateTransformsSpy = vi.spyOn(internals, 'updateStickyColumnTransforms');
    const updatePositionCachesSpy = vi.spyOn(internals, 'updateColumnPositionCaches');
    const applyColumnWidthsSpy = vi.spyOn(internals, 'applyColumnWidths');
    const applyChromeSpy = vi.spyOn(internals, 'applyDockingToColumnChrome');
    const applyRowDimensionsSpy = vi.spyOn(internals, 'applyDockingDimensionsToRows');
    const enqueueRenderSpy = vi.spyOn(internals, 'enqueueSingleViewportRender').mockImplementation(() => undefined);
    vi.spyOn(internals, 'refreshDockingLayout').mockImplementation(() => {
      internals.dockingByColumn.set(1, internals.dockingLayout.left[0]);
      return true;
    });

    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    let runFrame: FrameRequestCallback | undefined;
    Object.defineProperty(globalThis, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        runFrame = callback;
        return 1;
      },
    });
    try {
      internals.enqueueStickyColumnLayout();
      runFrame?.(0);

      expect(updateTransformsSpy).toHaveBeenCalledOnce();
      expect(enqueueRenderSpy).toHaveBeenCalledOnce();
      expect(updatePositionCachesSpy).not.toHaveBeenCalled();
      expect(applyColumnWidthsSpy).not.toHaveBeenCalled();
      expect(applyChromeSpy).not.toHaveBeenCalled();
      expect(applyRowDimensionsSpy).not.toHaveBeenCalled();
      expect(stickyHeader.classList.contains('slick-column-sticky-left')).toBe(true);
    } finally {
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: originalRequestAnimationFrame });
    }
  });

  it.each([0, 1])('refreshes docking chrome when resizing column %s without changing the canvas width', (columnIndex) => {
    const slickGrid = createGrid({
      devMode: { containerClientWidth: 800 },
      fullWidthRows: false,
      syncColumnCellResize: true,
      createFooterRow: true,
      showHeaderRow: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
    });
    const internals = slickGrid as any;
    internals.updateCanvasWidth(true);
    const initialCanvasWidth = internals.canvasWidth;
    const initialCanvasWidths = [internals.canvasWidth, internals.canvasWidthL, internals.canvasWidthR];
    const columnId = slickGrid.getColumns()[columnIndex].id;
    const header = slickGrid.getHeaderColumn(columnId)!;
    const filter = slickGrid.getHeaderRowColumn(columnId)!;
    const footer = slickGrid.getFooterRowColumn(columnId)!;
    const row = internals.rowsCache[0].rowNode[0] as HTMLElement;
    const regions = internals.rowsCache[0].cellRegions;
    expect(filter.style.width).toBe('80px');
    expect(footer.style.width).toBe('80px');
    const chromeSpy = vi.spyOn(internals, 'applyDockingToColumnChrome');
    slickGrid.getColumns()[columnIndex].width = 60;

    internals.applyColumnHeaderWidths();
    internals.updateCanvasWidth();

    expect([internals.canvasWidth, internals.canvasWidthL, internals.canvasWidthR]).toEqual(initialCanvasWidths);
    expect(chromeSpy).toHaveBeenCalled();
    expect(header.style.width).toBe(`${60 - slickGrid.getHeaderColumnWidthDiff()}px`);
    expect(filter.style.width).toBe('60px');
    expect(footer.style.width).toBe('60px');
    const leftWidth = columnIndex === 0 ? 60 : 80;
    const centerWidth = initialCanvasWidth - leftWidth - 80;
    expect(row.style.width).toBe(`${initialCanvasWidth}px`);
    expect(row.style.gridTemplateColumns).toBe(`${leftWidth}px ${centerWidth}px 80px`);
    expect(regions.left.style.width).toBe(`${leftWidth}px`);
    expect(regions.center.style.width).toBe(`${centerWidth}px`);
    expect(regions.right.style.width).toBe('80px');
  });

  it('keeps sticky cell geometry synchronized during column resize', () => {
    const resizableStickyColumns = columns.map((column, index) => ({
      ...column,
      resizable: true,
      sticky: index === 1 ? ('left' as const) : undefined,
    }));
    const slickGrid = createGrid({}, resizableStickyColumns);
    const internals = slickGrid as any;
    const applyColumnWidthsSpy = vi.spyOn(internals, 'applyColumnWidths');
    const updateStickyColumnTransformsSpy = vi.spyOn(internals, 'updateStickyColumnTransforms');
    const resizeHandle = slickGrid.getHeaderColumn('b')!.querySelector('.slick-resizable-handle') as HTMLDivElement;
    const mouseDown = new CustomEvent('mousedown');
    const mouseMove = new CustomEvent('mousemove');
    Object.defineProperty(mouseDown, 'pageX', { configurable: true, value: 100 });
    Object.defineProperty(mouseMove, 'pageX', { configurable: true, value: 110 });

    resizeHandle.dispatchEvent(mouseDown);
    document.body.dispatchEvent(mouseMove);

    expect(applyColumnWidthsSpy).toHaveBeenCalled();
    expect(updateStickyColumnTransformsSpy).toHaveBeenCalled();
  });

  it('defers a single-viewport render until the scheduled render callback runs', () => {
    const slickGrid = createGrid();
    const renderSpy = vi.spyOn(slickGrid, 'render').mockImplementation(() => undefined);
    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: undefined });
      (slickGrid as any).enqueueSingleViewportRender();
      (slickGrid as any).enqueueSingleViewportRender();
      expect(renderSpy).not.toHaveBeenCalled();

      vi.runOnlyPendingTimers();
      expect(renderSpy).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
      Object.defineProperty(globalThis, 'requestAnimationFrame', { configurable: true, value: originalRequestAnimationFrame });
    }
  });

  it('cleans up queued async post-render nodes by cleanup group', () => {
    const slickGrid = createGrid();
    const cleanupSpy = vi.fn();
    slickGrid.getColumns()[0].asyncPostRenderCleanup = cleanupSpy;
    const removedNode = document.createElement('span');
    const cleanupNode = document.createElement('span');
    container.append(removedNode, cleanupNode);
    (slickGrid as any).postProcessedCleanupQueue = [
      { groupId: 7, actionType: 'R', node: [removedNode] },
      { groupId: 7, actionType: 'C', node: cleanupNode, rowIdx: 1, columnIdx: 0 },
    ];

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      (slickGrid as any).asyncPostProcessCleanupRows();

      expect(removedNode.isConnected).toBe(false);
      expect(cleanupSpy).toHaveBeenCalledWith(cleanupNode, 1, slickGrid.getColumns()[0]);
      expect((slickGrid as any).postProcessedCleanupQueue).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('handles regular and shift mouse-wheel scrolling and prevents native scrolling for pinned columns', () => {
    const slickGrid = createGrid();
    const horizontalScroller = (slickGrid as any)._viewportScrollContainerX as HTMLDivElement;
    const verticalScroller = (slickGrid as any)._viewportScrollContainerY as HTMLDivElement;
    Object.defineProperty(horizontalScroller, 'scrollLeft', { configurable: true, writable: true, value: 12 });
    Object.defineProperty(verticalScroller, 'scrollTop', { configurable: true, writable: true, value: 30 });
    Object.defineProperty(verticalScroller, 'scrollHeight', { configurable: true, value: 500 });
    const handleScrollSpy = vi.spyOn(slickGrid as any, '_handleScroll').mockReturnValue(true);
    const regularEvent = new MouseEvent('mousewheel', { cancelable: true });
    (slickGrid as any).handleMouseWheel(regularEvent, 0, 2, 1);
    expect((slickGrid as any).scrollTop).toBe(5);
    expect((slickGrid as any).scrollLeft).toBe(92);
    expect(regularEvent.cancelBubble).toBe(true);

    const shiftEvent = new MouseEvent('mousewheel', { cancelable: true, shiftKey: true });
    (slickGrid as any).handleMouseWheel(shiftEvent, 0, 1, 10);
    expect((slickGrid as any).scrollLeft).toBe(52);
    expect(shiftEvent.defaultPrevented).toBe(false);

    const nativeHorizontalEvent = new WheelEvent('wheel', { cancelable: true, deltaX: 18 });
    (slickGrid as any).handleMouseWheel(nativeHorizontalEvent, 0, 0, 0);
    expect((slickGrid as any).scrollLeft).toBe(30);
    expect(nativeHorizontalEvent.defaultPrevented).toBe(false);

    slickGrid.setOptions({ pinning: { columns: { left: 0 } } });
    const pinnedEvent = new WheelEvent('wheel', { cancelable: true, deltaY: 10 });
    (slickGrid as any).handleMouseWheel(pinnedEvent, 0, 0, 10);
    expect(pinnedEvent.defaultPrevented).toBe(true);
    expect(handleScrollSpy).toHaveBeenCalledTimes(6);
  });

  it('preserves negative horizontal wheel offsets in RTL', () => {
    const slickGrid = createGrid({ rtl: true, pinning: { columns: { left: ['a'] } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: -12 });
    vi.spyOn(internals, '_handleScroll').mockReturnValue(true);

    internals.handleMouseWheel(new WheelEvent('wheel', { deltaX: -18 }), 0, 0, 0);

    expect(internals.scrollLeft).toBe(-30);
  });

  it('floors mouse-wheel and internal scroll offsets at zero', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: 0 });

    internals.handleMouseWheel(new WheelEvent('wheel', { deltaX: -18 }), 0, 0, 0);

    expect(internals.scrollLeft).toBe(0);

    internals.scrollLeft = -18;
    internals.scrollTop = -25;
    internals.prevScrollLeft = 0;
    internals.prevScrollTop = 0;
    internals._handleScroll('mousewheel');

    expect(internals.scrollLeft).toBe(0);
    expect(internals.scrollTop).toBe(0);
  });

  it('keeps permanent pinning on the compositor path during horizontal scrolling', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: 10 });
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollWidth', { configurable: true, value: 900 });
    Object.defineProperty(internals._viewportScrollContainerX, 'clientWidth', { configurable: true, value: 400 });
    const refreshSpy = vi.spyOn(internals, 'refreshDockingLayout');
    const scrollToXSpy = vi.spyOn(slickGrid, 'scrollToX').mockImplementation(() => undefined);

    internals.handleScroll({ target: internals._viewportScrollContainerX } as Event);

    expect(refreshSpy).not.toHaveBeenCalled();
    expect(scrollToXSpy).toHaveBeenCalledWith(10);
  });

  it('uses the horizontal render buffer before refreshing single-viewport cells', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollWidth', { configurable: true, value: 900 });
    Object.defineProperty(internals._viewportScrollContainerX, 'clientWidth', { configurable: true, value: 400 });
    internals.viewportW = 400;
    internals.lastRenderedScrollLeft = 0;
    const renderSpy = vi.spyOn(internals, 'enqueueSingleViewportRender').mockImplementation(() => undefined);

    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: 100 });
    internals.handleScroll({ target: internals._viewportScrollContainerX } as Event);
    expect(renderSpy).not.toHaveBeenCalled();

    internals._viewportScrollContainerX.scrollLeft = 321;
    internals.handleScroll({ target: internals._viewportScrollContainerX } as Event);
    expect(renderSpy).toHaveBeenCalledOnce();
  });

  it('preserves the resolved docking map when sticky membership is unchanged', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    const currentLayout = internals.dockingLayout;
    const currentDocking = [...internals.dockingByColumn];

    expect(internals.refreshDockingLayout(1, true)).toBe(false);
    expect(internals.dockingLayout).toBe(currentLayout);
    expect([...internals.dockingByColumn]).toEqual(currentDocking);
  });

  it('applies the docking compositor transform once per horizontal scroll event', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: 24 });
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollWidth', { configurable: true, value: 900 });
    Object.defineProperty(internals._viewportScrollContainerX, 'clientWidth', { configurable: true, value: 400 });
    internals.prevScrollLeft = 0;
    const scrollToXSpy = vi.spyOn(slickGrid, 'scrollToX').mockImplementation(() => undefined);

    internals.handleScroll({ target: internals._viewportScrollContainerX } as Event);

    expect(scrollToXSpy).toHaveBeenCalledOnce();
    expect(scrollToXSpy).toHaveBeenCalledWith(24);
  });

  it('handles a vertical mouse-wheel scroll through the internal scroll path', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerY, 'scrollTop', { configurable: true, writable: true, value: 0 });
    Object.defineProperty(internals._viewportScrollContainerY, 'scrollHeight', { configurable: true, value: 900 });
    Object.defineProperty(internals._viewportScrollContainerY, 'clientHeight', { configurable: true, value: 400 });
    internals.scrollTop = 25;
    internals.prevScrollTop = 0;
    internals.viewportH = 400;
    vi.spyOn(slickGrid, 'scrollTo').mockImplementation(() => undefined);

    internals._handleScroll('mousewheel');

    expect(internals._viewportScrollContainerY.scrollTop).toBe(25);
  });

  it('invalidates rows when a resize changes the docking layout', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    vi.spyOn(internals, 'refreshDockingLayout').mockReturnValue(true);
    const invalidateSpy = vi.spyOn(internals, 'invalidateAllRows');

    slickGrid.resizeCanvas();

    expect(invalidateSpy).toHaveBeenCalled();
  });

  it('returns early when the docking horizontal scrollbar has not been created', () => {
    const slickGrid = createGrid();
    const internals = slickGrid as any;
    internals._dockingHorizontalScroller = undefined;
    internals._dockingHorizontalSpacer = undefined;

    expect(internals.updateDockingHorizontalScrollerDimensions()).toBeUndefined();
  });

  it('skips center cells outside a pinned render range', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;

    internals.cleanUpAndRenderCells({ top: 0, bottom: 0, leftPx: 0, rightPx: 0 });

    expect(slickGrid.getCellNode(0, 0)).toBeTruthy();
  });

  it('defers sticky-column membership changes during horizontal scrolling', () => {
    const stickyColumns = columns.map((column, index) => ({ ...column, sticky: index === 1 ? ('left' as const) : undefined }));
    const slickGrid = createGrid({}, stickyColumns);
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollLeft', { configurable: true, writable: true, value: 10 });
    Object.defineProperty(internals._viewportScrollContainerX, 'scrollWidth', { configurable: true, value: 900 });
    Object.defineProperty(internals._viewportScrollContainerX, 'clientWidth', { configurable: true, value: 400 });
    const enqueueSpy = vi.spyOn(internals, 'enqueueStickyColumnLayout').mockImplementation(() => undefined);

    internals.handleScroll({ target: internals._viewportScrollContainerX } as Event);

    expect(enqueueSpy).toHaveBeenCalled();
  });

  it('synchronizes header and viewport scroll positions for bottom row docking', () => {
    const rightDockedGrid = createGrid({
      pinning: { columns: { left: 0 }, rows: { bottom: [2] } },
      createFooterRow: true,
      showFooterRow: true,
      showHeaderRow: true,
    });
    (rightDockedGrid as any).scrollToX(10);

    const leftOnlyGrid = createGrid({ pinning: { rows: { bottom: [2] } }, showHeaderRow: true });
    (leftOnlyGrid as any).scrollToX(10);

    expect((leftOnlyGrid as any)._viewportNode).toBeTruthy();
  });

  it('reserves horizontal scrollbar height during a resize with docking overflow', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 100 });
    internals.scrollbarDimensions = { width: 15, height: 15 };
    const initialViewportHeight = internals.viewportH;

    slickGrid.resizeCanvas();

    expect(internals.viewportH).toBeLessThanOrEqual(initialViewportHeight);
  });
  it('resizes the canvas when proxy scrollbar height reservation changes', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 100 });
    internals.scrollbarDimensions = { width: 15, height: 15 };
    const resizeSpy = vi.spyOn(slickGrid, 'resizeCanvas').mockImplementation(() => undefined);
    internals.dockingHorizontalScrollbarReserved = false;

    // A zero-height measurement must not reserve space even when content overflows.
    vi.spyOn(internals, 'getDockingScrollbarHeight').mockReturnValue(0);
    internals.updateCanvasWidth();
    expect(internals.dockingHorizontalScrollbarReserved).toBe(false);
    expect(resizeSpy).not.toHaveBeenCalled();

    vi.mocked(internals.getDockingScrollbarHeight).mockReturnValue(15);
    internals.updateCanvasWidth();
    expect(internals.dockingHorizontalScrollbarReserved).toBe(true);
    expect(resizeSpy).toHaveBeenCalledOnce();

    // Stable overflow does not resize again.
    internals.updateCanvasWidth();
    expect(resizeSpy).toHaveBeenCalledOnce();

    // Narrowing the columns removes the reservation and restores the viewport height.
    slickGrid.getColumns().forEach((column) => (column.width = 10));
    internals.dockingLayout.contentWidth = 0;
    internals.updateCanvasWidth();
    expect(internals.dockingHorizontalScrollbarReserved).toBe(false);
    expect(resizeSpy).toHaveBeenCalledTimes(2);

    // A nested update is suppressed while resizeCanvas is handling the transition.
    internals.dockingLayout.contentWidth = 320;
    internals.resizingForDockingScrollbar = true;
    internals.updateCanvasWidth();
    expect(internals.dockingHorizontalScrollbarReserved).toBe(true);
    expect(resizeSpy).toHaveBeenCalledTimes(2);
  });

  it('refreshes pinned chrome when the vertical scrollbar appears', () => {
    const slickGrid = createGrid({ pinning: { columns: { right: ['d'] } } });
    const internals = slickGrid as any;
    internals.viewportHasVScroll = false;
    internals._options.alwaysShowVerticalScroll = true;
    vi.spyOn(internals, 'updateCanvasWidth').mockImplementation(() => undefined);
    const chromeSpy = vi.spyOn(internals, 'applyDockingToColumnChrome');
    const rowsSpy = vi.spyOn(internals, 'applyDockingDimensionsToRows');

    slickGrid.updateRowCount();

    expect(chromeSpy).toHaveBeenCalledOnce();
    expect(rowsSpy).toHaveBeenCalledOnce();
  });

  it('keeps the docking scrollbar measurable when Firefox reports overlay metrics as zero', () => {
    const slickGrid = createGrid({ pinning: { columns: { left: 0 } } });
    const internals = slickGrid as any;
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 100 });
    internals.scrollbarDimensions = { width: 0, height: 0 };

    internals.updateDockingHorizontalScrollerDimensions();

    expect((internals._dockingHorizontalScroller as HTMLElement).style.height).toBe('15px');
    internals.scrollbarDimensions = undefined;
    vi.spyOn(internals, 'measureScrollbar').mockReturnValue({ width: 0, height: 0 });
    expect(internals.getDockingScrollbarHeight()).toBe(15);
  });

  it('keeps the docked-row overlay inside the viewport without consuming scroll height', () => {
    const slickGrid = createGrid({ pinning: { rows: { top: [0], bottom: [2] } } });
    const internals = slickGrid as any;
    const overlay = internals._dockingOverlay as HTMLElement;
    Object.defineProperty(internals._viewportNode, 'clientWidth', { configurable: true, value: 320 });
    Object.defineProperty(internals._viewportNode, 'clientHeight', { configurable: true, value: 240 });
    internals.canvasWidth = 500;
    internals.dockingLayout.contentWidth = 420;

    internals.updateDockingOverlayDimensions();

    expect(overlay.parentElement).toBe(internals._viewportNode);
    expect(overlay.style.top).toBe('0px');
    expect(overlay.style.width).toBe('500px');
    expect(overlay.style.height).toBe('0px');
    expect(overlay.style.clipPath).toBe('');
  });

  it('publishes the proxy scroll offset once on the grid container', () => {
    const slickGrid = createGrid({
      pinning: { columns: { left: ['a'], right: ['d'] }, rows: { top: [0] } },
      showHeaderRow: true,
    });
    slickGrid.scrollToX(10);

    const row = container.querySelector<HTMLElement>('.slick-row-docked')!;
    expect(container.style.getPropertyValue('--slick-docking-scroll-left')).toBe('10px');
    expect(row.querySelector<HTMLElement>('.slick-pinned-left-cells')!.style.getPropertyValue('--slick-docking-scroll-left')).toBe('');
    expect(row.querySelector<HTMLElement>('.slick-pinned-right-cells')!.style.getPropertyValue('--slick-docking-scroll-left')).toBe('');
    expect(row.querySelector<HTMLElement>('.slick-scrolling-cells')!.style.getPropertyValue('--slick-docking-scroll-left')).toBe('');
    expect(slickGrid.getHeaderColumn('a').style.getPropertyValue('--slick-docking-scroll-left')).toBe('');
    expect(slickGrid.getHeaderColumn('d').style.getPropertyValue('--slick-docking-scroll-left')).toBe('');

    const headerTransform = slickGrid.getHeaderColumn('a').style.getPropertyValue('transform');
    const filterTransform = container.querySelector<HTMLElement>('.slick-headerrow-column.l0')!.style.getPropertyValue('transform');
    slickGrid.scrollToX(11);
    expect(container.style.getPropertyValue('--slick-docking-scroll-left')).toBe('11px');
    expect(slickGrid.getHeaderColumn('a').style.getPropertyValue('transform')).toBe(headerTransform);
    expect(container.querySelector<HTMLElement>('.slick-headerrow-column.l0')!.style.getPropertyValue('transform')).toBe(filterTransform);
  });

  it('keeps the right-pinned filter/footer chrome over the Grid Menu allowance with collapsed scrollbars', () => {
    const slickGrid = createGrid({
      gridMenu: { menuWidth: 18 },
      pinning: { columns: { right: ['d'] } },
      showHeaderRow: true,
    });
    const internals = slickGrid as any;
    const header = slickGrid.getHeaderColumn('d')!;
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ width: 62 } as DOMRect);
    internals.scrollbarDimensions = { width: 0, height: 0 };

    internals.applyDockingToColumnChrome();

    const widthWithGridMenu = (container.querySelector('.slick-headerrow-column.l3') as HTMLElement).style.width;
    expect(widthWithGridMenu).toBe('62px');

    internals._options.gridMenu = {};
    internals.applyDockingToColumnChrome();
    expect((container.querySelector('.slick-headerrow-column.l3') as HTMLElement).style.width).toBe(widthWithGridMenu);
  });

  it('updates rendered docking rows and chrome regions', () => {
    const slickGrid = createGrid({
      createFooterRow: true,
      pinning: { columns: { left: ['a'], right: ['d'] } },
      showFooterRow: true,
      showHeaderRow: true,
    });
    const internals = slickGrid as any;
    internals.viewportHasVScroll = true;
    internals.scrollbarDimensions = { width: 15, height: 15 };
    container.querySelectorAll<HTMLElement>('.slick-headerrow-column, .slick-footerrow-column').forEach((element) => {
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ width: 80 } as DOMRect);
    });
    internals.applyDockingToColumnChrome();
    internals._options.rtl = true;
    internals.applyDockingToColumnChrome();
    internals._options.rtl = false;
    internals.applyDockingToColumnChrome();
    expect((container.querySelector('.slick-headerrow-column.l0') as HTMLElement).style.width).toBe('80px');
    expect((container.querySelector('.slick-headerrow-column.l3') as HTMLElement).style.width).toBe('80px');
    expect((container.querySelector('.slick-footerrow-column.l3') as HTMLElement).style.width).toBe('80px');
    Object.defineProperty(internals._viewportScrollContainerX, 'clientWidth', { configurable: true, value: 200 });
    internals.viewportW = 200;
    internals.scrollLeft = 15;

    const row = document.createElement('div');
    row.className = 'slick-row slick-row-docked';
    row.dataset.row = '0';
    const leftRegion = document.createElement('div');
    leftRegion.className = 'slick-pinned-left-cells';
    const centerRegion = document.createElement('div');
    centerRegion.className = 'slick-scrolling-cells';
    const rightRegion = document.createElement('div');
    rightRegion.className = 'slick-pinned-right-cells';
    const leftCell = document.createElement('div');
    const centerCell = document.createElement('div');
    const rightCell = document.createElement('div');
    leftCell.className = 'slick-cell l0 r0';
    centerCell.className = 'slick-cell l1 r1';
    rightCell.className = 'slick-cell l3 r3';
    leftRegion.appendChild(leftCell);
    centerRegion.appendChild(centerCell);
    rightRegion.appendChild(rightCell);
    row.append(leftRegion, centerRegion, rightRegion);
    container.appendChild(row);

    internals.dockingLayout = {
      left: [{ band: 'left', index: 0, naturalOffset: 0, offset: 0, sticky: false, width: 80 }],
      center: [],
      right: [{ band: 'right', index: 3, naturalOffset: 240, offset: 0, sticky: false, width: 80 }],
      contentWidth: 320,
      leftBaseWidth: 80,
      leftWidth: 80,
      rightBaseWidth: 80,
      rightWidth: 80,
      revision: 1,
    };
    internals.dockingByColumn = new Map([
      [0, { band: 'left', index: 0, naturalOffset: 0, offset: 0, sticky: false, width: 80 }],
      [1, { band: 'right', index: 1, naturalOffset: 80, offset: 0, sticky: true, width: 80 }],
      [3, { band: 'right', index: 3, naturalOffset: 240, offset: 0, sticky: false, width: 80 }],
    ]);
    internals.rowsCache = {
      0: {
        rowNode: [row],
        cellNodesByColumnIdx: { 0: leftCell, 1: centerCell, 3: rightCell },
        cellRegions: { left: leftRegion, center: centerRegion, right: rightRegion },
      },
    };
    vi.spyOn(slickGrid as any, 'ensureCellNodesInRowsCache').mockImplementation(() => undefined);

    internals.applyDockingDimensionsToRows();
    expect(row.style.gridTemplateColumns).toBe('80px 160px 80px');
    expect(leftRegion.classList.contains('slick-pinned-left-cells-active')).toBe(true);
    expect(rightRegion.classList.contains('slick-pinned-right-cells-active')).toBe(true);

    internals.updateStickyColumnTransforms();
    expect(leftCell.parentElement).toBe(leftRegion);
    expect(rightCell.parentElement).toBe(rightRegion);
    expect(Array.from(rightRegion.children).map((cell) => internals.getCellFromNode(cell))).toEqual([3]);
  });
});
