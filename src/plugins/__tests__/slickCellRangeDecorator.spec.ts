import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SlickGrid } from '../../slick.grid';
import { SlickCellRangeDecorator } from '../slick.cellrangedecorator';
import { SlickRange } from '../../slick.core';

const gridStub = {
  getActiveCell: vi.fn(),
  getActiveCanvasNode: vi.fn(),
  getCellNodeBox: vi.fn(),
} as unknown as SlickGrid;

describe('CellRangeDecorator Plugin', () => {
  let plugin: SlickCellRangeDecorator;

  beforeEach(() => {
    plugin = new SlickCellRangeDecorator(gridStub);
  });

  afterEach(() => {
    plugin?.destroy();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should create the plugin', () => {
    expect(plugin).toBeTruthy();
    expect(plugin.options).toEqual({
      selectionCssClass: 'slick-range-decorator',
      selectionCss: {
        border: '2px dashed red',
        zIndex: '9999',
      },
      copyToSelectionCss: {
        border: '2px dashed blue',
        zIndex: '9999',
      },
      offset: { top: -1, left: -1, height: -2, width: -2 },
    });
  });

  it('should dispose of the addon', () => {
    plugin.init();
    const disposeSpy = vi.spyOn(plugin, 'destroy');
    const hideSpy = vi.spyOn(plugin, 'hide');

    plugin.destroy();
    expect(disposeSpy).toHaveBeenCalled();
    expect(hideSpy).toHaveBeenCalled();
  });

  it('leaves the position unchanged when getCellNodeBox returns null', () => {
    const divContainer = document.createElement('div');
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divContainer);
    vi.spyOn(gridStub, 'getCellNodeBox').mockReturnValue(null);

    plugin = new SlickCellRangeDecorator(gridStub, { offset: { top: 20, left: 5, width: 12, height: 33 } });
    plugin.show({ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4 } as SlickRange);

    expect(plugin.addonElement!.style.top).toEqual('');
    expect(plugin.addonElement!.style.left).toEqual('');
    expect(plugin.addonElement!.style.height).toEqual('');
    expect(plugin.addonElement!.style.width).toEqual('');
    expect(plugin.addonElement?.style.border).toBe('2px dashed red');
    expect(plugin.addonElement?.style.zIndex).toBe('9999');
  });

  it('should Show range when called and calculate new position when getCellNodeBox returns a cell position', () => {
    const divContainer = document.createElement('div');
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divContainer);
    vi.spyOn(gridStub, 'getCellNodeBox').mockReturnValue({ top: 25, left: 26, right: 27, bottom: 12 });

    plugin = new SlickCellRangeDecorator(gridStub, { offset: { top: 20, left: 5, width: 12, height: 33 } });
    plugin.show({ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4 } as SlickRange);

    expect(plugin.addonElement!.style.top).toEqual('45px'); // 25 + 20px
    expect(plugin.addonElement!.style.left).toEqual('31px'); // 26 + 5px
    expect(plugin.addonElement!.style.height).toEqual('20px'); // 12 - 25 + 33px
    expect(plugin.addonElement!.style.width).toEqual('13px'); // 27 - 26 + 12px
    expect(plugin.addonElement?.style.border).toBe('2px dashed red');
    expect(plugin.addonElement?.style.zIndex).toBe('9999');
  });

  it('should be able to set selection CSS', () => {
    const setSelectionCss = { border: '2px solid green', zIndex: '9998' } as CSSStyleDeclaration;
    plugin = new SlickCellRangeDecorator(gridStub, { offset: { top: 20, left: 5, width: 12, height: 33 } });
    plugin.setSelectionCss(setSelectionCss);

    expect(plugin.getSelectionCss()).toEqual({ border: '2px solid green', zIndex: '9998' } as CSSStyleDeclaration);
  });

  it('should be able to define different selection CSS and then override them with setSelectionCss()', () => {
    const ctorSelectionCss = { border: '3px solid purple', zIndex: '9997' };
    const setSelectionCss = { border: '2px solid green', zIndex: '9998' } as CSSStyleDeclaration;
    plugin = new SlickCellRangeDecorator(gridStub, {
      offset: { top: 20, left: 5, width: 12, height: 33 },
      selectionCss: ctorSelectionCss as CSSStyleDeclaration,
    });
    plugin.setSelectionCss(setSelectionCss);

    expect(plugin.getSelectionCss()).toEqual(setSelectionCss);
  });

  it('should be able to define different selection CSS', () => {
    const ctorSelectionCss = { border: '3px solid purple', zIndex: '9997' };
    plugin = new SlickCellRangeDecorator(gridStub, {
      offset: { top: 20, left: 5, width: 12, height: 33 },
      selectionCss: ctorSelectionCss as CSSStyleDeclaration,
    });
    plugin.show({ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4 } as SlickRange);

    expect(plugin.addonElement?.style.border).toBe(ctorSelectionCss.border);
    expect(plugin.addonElement?.style.zIndex).toBe(ctorSelectionCss.zIndex);
  });

  it('uses copy-to-selection styles when showing a copied range', () => {
    const divContainer = document.createElement('div');
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(divContainer);
    plugin = new SlickCellRangeDecorator(gridStub, {
      copyToSelectionCss: { border: '3px solid blue', zIndex: '100' } as CSSStyleDeclaration,
    });

    plugin.show({ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4 } as SlickRange, true);

    expect(plugin.addonElement?.style.border).toBe('3px solid blue');
    expect(plugin.addonElement?.style.zIndex).toBe('100');
  });

  it('appends the decorator to the active canvas and removes it on hide', () => {
    const canvas = document.createElement('div');
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(canvas);
    plugin.show({ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4 } as SlickRange);

    expect(canvas.querySelector('.slick-range-decorator')).toBe(plugin.addonElement);

    plugin.hide();

    expect(canvas.querySelector('.slick-range-decorator')).toBeNull();
    expect(plugin.addonElement).toBeNull();
  });

  it('returns the decorator element from show', () => {
    const canvas = document.createElement('div');
    vi.spyOn(gridStub, 'getActiveCanvasNode').mockReturnValue(canvas);

    const element = plugin.show({ fromCell: 1, fromRow: 2, toCell: 3, toRow: 4 } as SlickRange);

    expect(element).toBe(plugin.addonElement);
    expect(element.parentElement).toBe(canvas);
  });
});
