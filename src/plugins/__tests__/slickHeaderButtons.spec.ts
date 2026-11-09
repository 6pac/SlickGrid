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
  getColumnIndex: vi.fn(() => 0),
  getColumns: vi.fn(() => [column]),
  getHeaderColumn: vi.fn(),
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

  it('names and activates enabled buttons with the keyboard without activating disabled buttons', () => {
    const handler = vi.fn();
    const action = vi.fn();
    column.header!.buttons![1].handler = handler;
    column.header!.buttons![1].ariaLabel = 'Show details';
    column.header!.buttons![0].disabled = true;
    column.header!.buttons![0].action = action;
    plugin.init(grid);
    const { node } = renderHeader();
    const enabled = node.querySelector<HTMLElement>('.icon-second')!;
    const disabled = node.querySelector<HTMLElement>('.icon-first')!;

    expect(enabled.getAttribute('aria-label')).toBe('Show details');
    expect(enabled.tabIndex).toBe(0);
    enabled.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    expect(disabled.tabIndex).toBe(-1);
    disabled.click();
    expect(action).not.toHaveBeenCalled();
  });

  it('keeps the keyboard focus on a command button when the command renders its header cell again', () => {
    plugin.init(grid);
    const { node, args } = renderHeader();
    document.body.appendChild(node);
    // what `grid.updateColumnHeader()` does: the content of the header cell is destroyed, then rendered again
    vi.mocked(grid.updateColumnHeader).mockImplementationOnce(() => {
      grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
      grid.onHeaderCellRendered.notify(args, new SlickEventData());
    });
    const button = node.querySelector<HTMLElement>('.icon-second')!;
    button.focus();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const newButton = node.querySelector<HTMLElement>('.icon-second')!;

    expect(grid.updateColumnHeader).toHaveBeenCalledWith(column.id);
    expect(button.isConnected).toBe(false);
    expect(newButton).not.toBe(button);
    expect(document.activeElement).toBe(newButton);
    node.remove();
  });

  it('releases the listeners of a header cell when the cell is destroyed', () => {
    plugin.init(grid);
    const { args } = renderHeader();
    const boundListeners = () => (plugin as any)._bindingEventService.getBoundedEvents() as unknown[];
    const boundAfterFirstRender = boundListeners().length;

    for (let i = 0; i < 5; i++) {
      grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
      grid.onHeaderCellRendered.notify(args, new SlickEventData());
    }

    expect(boundListeners()).toHaveLength(boundAfterFirstRender);
  });

  it('scrolls the header cell back once the focus has left it', () => {
    plugin.init(grid);
    const { node } = renderHeader();
    const outside = document.createElement('button');
    const [firstButton, secondButton] = Array.from(node.querySelectorAll<HTMLElement>('.slick-header-button'));
    node.scrollTop = 120;

    firstButton.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: secondButton }));
    expect(node.scrollTop).toBe(120); // the focus is still inside the cell

    secondButton.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
    expect(node.scrollTop).toBe(0);
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
    const { node, args } = renderHeader({ id: 'field2', field: 'field2', name: 'Field 2' });
    expect(node.querySelector('.slick-header-button')).toBeNull();

    // nor remove anything from their header cell
    const otherElm = node.appendChild(document.createElement('span'));
    otherElm.className = 'slick-header-button';
    grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
    expect(node.contains(otherElm)).toBe(true);
  });

  it('removes rendered buttons before the header cell is destroyed', () => {
    plugin.init(grid);
    const { node, args } = renderHeader();
    grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());

    expect(node.querySelector('.slick-header-button')).toBeNull();
  });

  it('focuses the replacement button in the new header cell when the command replaced the whole header cell', () => {
    plugin.init(grid);
    const { node, args } = renderHeader();
    document.body.appendChild(node);
    const newNode = document.createElement('div');
    // what `grid.setColumns()` does: the old header cell is destroyed and the column is rendered in a new header cell
    vi.mocked(grid.updateColumnHeader).mockImplementationOnce(() => {
      grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
      node.replaceWith(newNode);
      grid.onHeaderCellRendered.notify({ ...args, node: newNode }, new SlickEventData());
    });
    vi.mocked(grid.getHeaderColumn).mockReturnValueOnce(newNode);
    const button = node.querySelector<HTMLElement>('.icon-first')!;
    button.focus();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(grid.getColumnIndex).toHaveBeenCalledWith(column.id);
    expect(grid.getHeaderColumn).toHaveBeenCalledWith(0);
    expect(document.activeElement).toBe(newNode.querySelector('.icon-first'));
    newNode.remove();
  });

  it('does not move the focus when the column of the replaced button is gone', () => {
    plugin.init(grid);
    const { node, args } = renderHeader();
    document.body.appendChild(node);
    vi.mocked(grid.updateColumnHeader).mockImplementationOnce(() => {
      grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
    });
    vi.mocked(grid.getColumnIndex).mockReturnValueOnce(undefined as any);
    const button = node.querySelector<HTMLElement>('.icon-first')!;
    button.focus();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(grid.getHeaderColumn).not.toHaveBeenCalled();
    expect(button.isConnected).toBe(false);
    expect(document.activeElement).toBe(document.body);
    node.remove();
  });

  it('keeps the focus on the button when its command left it in place', () => {
    plugin.init(grid);
    const { node } = renderHeader();
    document.body.appendChild(node);
    const button = node.querySelector<HTMLElement>('.icon-first')!;
    button.focus();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(grid.updateColumnHeader).not.toHaveBeenCalled();
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(grid.updateColumnHeader).toHaveBeenCalledWith(column.id);
    expect(grid.getHeaderColumn).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(button);
    node.remove();
  });

  it('renders an image button', () => {
    column.header!.buttons![0].image = 'first.png';
    plugin.init(grid);
    const { node } = renderHeader();

    expect(node.querySelector<HTMLElement>('.icon-first')!.style.backgroundImage).toBe('url("first.png")');
    expect(node.querySelector<HTMLElement>('.icon-second')!.style.backgroundImage).toBe('');
  });

  it('names a button from its tooltip, its command or a default label', () => {
    column.header!.buttons = [
      { cssClass: 'with-tooltip', tooltip: 'Sort', command: 'sort' },
      { cssClass: 'with-command', command: 'filter' },
      { cssClass: 'unnamed' },
      { tooltip: 'Without class' },
    ];
    plugin.init(grid);
    const { node } = renderHeader();

    expect(node.querySelector('.with-tooltip')!.getAttribute('aria-label')).toBe('Sort');
    expect(node.querySelector('.with-command')!.getAttribute('aria-label')).toBe('filter');
    expect(node.querySelector('.unnamed')!.getAttribute('aria-label')).toBe('Header Button');
    expect(node.querySelector('[title="Without class"]')!.className).toBe('slick-header-button');
  });

  it('enables a button whose usability override returns true and does not bind the handler of a disabled button', () => {
    const handler = vi.fn();
    column.header!.buttons![0].disabled = true;
    column.header!.buttons![0].itemUsabilityOverride = () => true;
    column.header!.buttons![1].disabled = true;
    column.header!.buttons![1].handler = handler;
    plugin.init(grid);
    const { node } = renderHeader();
    const enabled = node.querySelector<HTMLElement>('.icon-first')!;
    const disabled = node.querySelector<HTMLElement>('.icon-second')!;

    expect(enabled.tabIndex).toBe(0);
    expect(enabled.classList.contains('slick-header-button-disabled')).toBe(false);
    disabled.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('runs the action of a button without command but publishes nothing', () => {
    const action = vi.fn();
    const commandListener = vi.fn();
    column.header!.buttons = [{ cssClass: 'no-command', action }];
    plugin.init(grid);
    plugin.onCommand.subscribe(commandListener);
    const { node } = renderHeader();

    node.querySelector<HTMLElement>('.no-command')!.click();

    expect(action).toHaveBeenCalledWith(expect.anything(), { grid, column, button: column.header!.buttons![0] });
    expect(commandListener).not.toHaveBeenCalled();
    expect(grid.updateColumnHeader).not.toHaveBeenCalled();
  });

  it('finds its buttons by all the classes of a multi-class button CSS class', () => {
    plugin = new SlickHeaderButtons({ buttonCssClass: 'btn  header-btn' });
    plugin.init(grid);
    const { node, args } = renderHeader();
    expect(node.querySelectorAll('.btn.header-btn')).toHaveLength(2);

    grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());

    expect(node.querySelectorAll('.btn')).toHaveLength(0);
  });

  it('renders buttons without class and does not look for them when the button CSS class is empty', () => {
    plugin = new SlickHeaderButtons({ buttonCssClass: '' });
    plugin.init(grid);
    const { node, args } = renderHeader();
    document.body.appendChild(node);
    const button = node.querySelector<HTMLElement>('[role="button"]')!;
    expect(button.className).toBe('icon-second');
    button.focus();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(grid.updateColumnHeader).toHaveBeenCalledWith(column.id);
    expect(grid.getHeaderColumn).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(button);

    // without a selector, the buttons are left in the header cell
    grid.onBeforeHeaderCellDestroy.notify(args, new SlickEventData());
    expect(node.querySelectorAll('[role="button"]')).toHaveLength(2);
    node.remove();
  });

  it('removes event subscriptions when destroyed', () => {
    plugin.init(grid);
    plugin.destroy();
    const { node } = renderHeader();

    expect(node.querySelector('.slick-header-button')).toBeNull();
  });
});
