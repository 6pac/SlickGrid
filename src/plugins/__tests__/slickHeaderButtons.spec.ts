import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Column, HeaderButtonOnCommandArgs } from '../../models';
import { SlickEvent, SlickEventData } from '../../slick.core';
import type { SlickGrid } from '../../slick.grid';
import { SlickHeaderButtons } from '../slick.headerbuttons';

const column: Column = {
  id: 'field1',
  field: 'field1',
  name: 'Field 1',
  header: {
    buttons: [
      { cssClass: 'icon-first', command: 'first' },
      { cssClass: 'icon-second', command: 'second', tooltip: 'Second button' },
    ],
  },
};

const grid = {
  getColumns: vi.fn(() => [column]),
  getPubSubService: vi.fn(),
  setColumns: vi.fn(),
  updateColumnHeader: vi.fn(),
  onBeforeHeaderCellDestroy: new SlickEvent(),
  onHeaderCellRendered: new SlickEvent(),
} as unknown as SlickGrid;

describe('SlickHeaderButtons', () => {
  let plugin: SlickHeaderButtons;

  const renderHeader = (targetColumn = column) => {
    const node = document.createElement('div');
    const args = { column: targetColumn, node, grid };
    grid.onHeaderCellRendered.notify(args, new SlickEventData());
    return { node, args };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    column.header!.buttons = [
      { cssClass: 'icon-first', command: 'first' },
      { cssClass: 'icon-second', command: 'second', tooltip: 'Second button' },
    ];
    plugin = new SlickHeaderButtons({});
  });

  afterEach(() => {
    plugin.destroy();
  });

  it('subscribes to header events and asks the grid to rerender its columns', () => {
    plugin.init(grid);

    expect(grid.setColumns).toHaveBeenCalledWith([column]);
  });

  it('renders configured buttons in reverse order with their classes and tooltip', () => {
    plugin.init(grid);
    const { node } = renderHeader();
    const buttons = node.querySelectorAll('.slick-header-button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0].classList.contains('icon-second')).toBe(true);
    expect((buttons[0] as HTMLElement).title).toBe('Second button');
    expect(buttons[1].classList.contains('icon-first')).toBe(true);
    expect(buttons[0].getAttribute('role')).toBe('button');
  });

  it('uses a configured button CSS class', () => {
    plugin = new SlickHeaderButtons({ buttonCssClass: 'custom-header-button' });
    plugin.init(grid);
    const { node } = renderHeader();

    expect(node.querySelectorAll('.custom-header-button')).toHaveLength(2);
    expect(node.querySelector('.slick-header-button')).toBeNull();
  });

  it('does not render a button when its visibility override returns false', () => {
    column.header!.buttons![1].itemVisibilityOverride = () => false;
    plugin.init(grid);
    const { node } = renderHeader();

    expect(node.querySelectorAll('.slick-header-button')).toHaveLength(1);
    expect(node.querySelector('.icon-first')).toBeTruthy();
    expect(node.querySelector('.icon-second')).toBeNull();
  });

  it('marks a button disabled when its usability override returns false', () => {
    column.header!.buttons![1].itemUsabilityOverride = () => false;
    plugin.init(grid);
    const { node } = renderHeader();
    const button = node.querySelector<HTMLElement>('.icon-second')!;

    expect(button.classList.contains('slick-header-button-disabled')).toBe(true);
  });

  it('renders buttons with disabled and hover-only states from their options', () => {
    column.header!.buttons![0].disabled = true;
    column.header!.buttons![1].showOnHover = true;
    plugin.init(grid);
    const { node } = renderHeader();

    expect(node.querySelector('.icon-first')?.classList.contains('slick-header-button-disabled')).toBe(true);
    expect(node.querySelector('.icon-second')?.classList.contains('slick-header-button-hidden')).toBe(true);
  });

  it('runs a button handler when the button is clicked', () => {
    const handler = vi.fn();
    column.header!.buttons![1].handler = handler;
    plugin.init(grid);
    const { node } = renderHeader();

    node.querySelector<HTMLElement>('.icon-second')!.click();

    expect(handler).toHaveBeenCalledOnce();
  });

  it('runs an action and publishes the command when a command button is clicked', () => {
    const action = vi.fn();
    const commandListener = vi.fn();
    column.header!.buttons![1].action = action;
    plugin.init(grid);
    plugin.onCommand.subscribe((_event: SlickEventData, args: HeaderButtonOnCommandArgs) => commandListener(args));
    const { node } = renderHeader();

    node.querySelector<HTMLElement>('.icon-second')!.click();

    expect(action).toHaveBeenCalledOnce();
    expect(commandListener).toHaveBeenCalledWith({ grid, column, button: column.header!.buttons![1], command: 'second' });
    expect(grid.updateColumnHeader).toHaveBeenCalledWith(column.id);
  });

  it('does not publish a command for a disabled button', () => {
    column.header!.buttons![1].disabled = true;
    const commandListener = vi.fn();
    plugin.init(grid);
    plugin.onCommand.subscribe((_event: SlickEventData, args: HeaderButtonOnCommandArgs) => commandListener(args));
    const { node } = renderHeader();

    node.querySelector<HTMLElement>('.icon-second')!.click();

    expect(commandListener).not.toHaveBeenCalled();
    expect(grid.updateColumnHeader).not.toHaveBeenCalled();
  });

  it('does not add buttons to columns without header button definitions', () => {
    plugin.init(grid);
    const { node } = renderHeader({ id: 'field2', field: 'field2', name: 'Field 2' });

    expect(node.querySelector('.slick-header-button')).toBeNull();
  });

  it('removes rendered buttons before the header cell is destroyed', () => {
    plugin.init(grid);
    const { node, args } = renderHeader();
    grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());

    expect(node.querySelector('.slick-header-button')).toBeNull();
  });

  it('removes event subscriptions when destroyed', () => {
    plugin.init(grid);
    plugin.destroy();
    const { node } = renderHeader();

    expect(node.querySelector('.slick-header-button')).toBeNull();
  });
});
