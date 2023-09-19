import type {
  Column,
  DOMEvent,
  HeaderButtonItem,
  HeaderButtonOnCommandArgs,
  HeaderButtonOption,
  OnHeaderCellRenderedEventArgs,
  Plugin
} from '../models/index';
import { BindingEventService as BindingEventService_, Event as SlickEvent_, EventHandler as EventHandler_, Utils as Utils_ } from '../slick.core';
import type { SlickGrid } from '../slick.grid';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const EventHandler = IIFE_ONLY ? Slick.EventHandler : EventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;

/***
   * A plugin to add custom buttons to column headers.
   *
   * USAGE:
   *
   * Add the plugin .js & .css files and register it with the grid.
   *
   * To specify a custom button in a column header, extend the column definition like so:
   *
   *   let columns = [
   *     {
   *       id: 'myColumn',
   *       name: 'My column',
   *
   *       // This is the relevant part
   *       header: {
   *          buttons: [
   *              {
   *                // button options
   *              },
   *              {
   *                // button options
   *              }
   *          ]
   *       }
   *     }
   *   ];
   *
   * Available button options:
   *    cssClass:     CSS class to add to the button.
   *    image:        Relative button image path.
   *    disabled:     Whether the item is disabled.
   *    tooltip:      Button tooltip.
   *    showOnHover:  Only show the button on hover.
   *    handler:      Button click handler.
   *    command:      A command identifier to be passed to the onCommand event handlers.
   *
   * Available menu item options:
   *    action:                   Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event)
   *    command:                  A command identifier to be passed to the onCommand event handlers.
   *    cssClass:                 CSS class to add to the button.
   *    handler:                  Button click handler.
   *    image:                    Relative button image path.
   *    showOnHover:              Only show the button on hover.
   *    tooltip:                  Button tooltip.
   *    itemVisibilityOverride:   Callback method that user can override the default behavior of showing/hiding an item from the list
   *    itemUsabilityOverride:    Callback method that user can override the default behavior of enabling/disabling an item from the list
   *
   * The plugin exposes the following events:
   *    onCommand:    Fired on button click for buttons with 'command' specified.
   *        Event args:
   *            grid:     Reference to the grid.
   *            column:   Column definition.
   *            command:  Button command identified.
   *            button:   Button options.  Note that you can change the button options in your
   *                      event handler, and the column header will be automatically updated to
   *                      reflect them.  This is useful if you want to implement something like a
   *                      toggle button.
   *
   *
   * @param options {Object} Options:
   *    buttonCssClass:   a CSS class to use for buttons (default 'slick-header-button')
   * @class Slick.Plugins.HeaderButtons
   * @constructor
   */
export class SlickHeaderButtons implements Plugin {
  // --
  // public API
  pluginName = 'HeaderButtons' as const;
  onCommand = new SlickEvent<HeaderButtonOnCommandArgs>();

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _handler = new EventHandler();
  protected _bindingEventService = new BindingEventService();
  protected _defaults: HeaderButtonOption = {
    buttonCssClass: 'slick-header-button'
  };
  protected _options: HeaderButtonOption;

  constructor(options: Partial<HeaderButtonOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    this._handler
      .subscribe(this._grid.onHeaderCellRendered, this.handleHeaderCellRendered.bind(this))
      .subscribe(this._grid.onBeforeHeaderCellDestroy, this.handleBeforeHeaderCellDestroy.bind(this));

    // Force the grid to re-render the header now that the events are hooked up.
    this._grid.setColumns(this._grid.getColumns());
  }

  destroy() {
    this._handler.unsubscribeAll();
    this._bindingEventService.unbindAll();
  }

  protected handleHeaderCellRendered(_e: Event, args: OnHeaderCellRenderedEventArgs) {
    const column = args.column;

    if (column.header?.buttons) {
      // Append buttons in reverse order since they are floated to the right.
      let i = column.header.buttons.length;
      while (i--) {
        const button = column.header.buttons[i];

        // run each override functions to know if the item is visible and usable
        const isItemVisible = this.runOverrideFunctionWhenExists<typeof args>(button.itemVisibilityOverride, args);
        const isItemUsable = this.runOverrideFunctionWhenExists<typeof args>(button.itemUsabilityOverride, args);

        // if the result is not visible then there's no need to go further
        if (!isItemVisible) {
          continue;
        }

        // when the override is defined, we need to use its result to update the disabled property
        // so that "handleMenuItemCommandClick" has the correct flag and won't trigger a command clicked event
        if (Object.prototype.hasOwnProperty.call(button, 'itemUsabilityOverride')) {
          button.disabled = isItemUsable ? false : true;
        }

        const btn = document.createElement('div');
        btn.className = this._options.buttonCssClass || '';
        btn.ariaLabel = 'Header Button';
        btn.role = 'button';

        if (button.disabled) {
          btn.classList.add('slick-header-button-disabled');
        }

        if (button.showOnHover) {
          btn.classList.add('slick-header-button-hidden');
        }

        if (button.image) {
          btn.style.backgroundImage = `url(${button.image})`;
        }

        if (button.cssClass) {
          btn.classList.add(...button.cssClass.split(' '));
        }

        if (button.tooltip) {
          btn.title = button.tooltip;
        }

        if (button.handler && !button.disabled) {
          this._bindingEventService.bind(btn, 'click', button.handler);
        }

        this._bindingEventService.bind(btn, 'click', this.handleButtonClick.bind(this, button, args.column) as EventListener);
        args.node.appendChild(btn);
      }
    }
  }


  protected handleBeforeHeaderCellDestroy(_e: Event, args: { column: Column; node: HTMLElement; }) {
    const column = args.column;

    if (column.header?.buttons) {
      // Removing buttons via jQuery will also clean up any event handlers and data.
      // NOTE: If you attach event handlers directly or using a different framework,
      //       you must also clean them up here to avoid memory leaks.
      const buttonCssClass = (this._options.buttonCssClass || '').replace(/(\s+)/g, '.');
      if (buttonCssClass) {
        args.node.querySelectorAll(`.${buttonCssClass}`).forEach(elm => elm.remove());
      }
    }
  }

  protected handleButtonClick(button: HeaderButtonItem, columnDef: Column, e: DOMEvent<HTMLDivElement>) {
    const command = button.command || '';
    const callbackArgs = {
      grid: this._grid,
      column: columnDef,
      button: button
    } as HeaderButtonOnCommandArgs;

    if (command) {
      callbackArgs.command = command;
    }

    // execute action callback when defined
    if (typeof button.action === 'function') {
      button.action.call(this, e, callbackArgs);
    }

    if (command && !button.disabled) {
      this.onCommand.notify(callbackArgs, e, this);

      // Update the header in case the user updated the button definition in the handler.
      this._grid.updateColumnHeader(columnDef.id);
    }

    // Stop propagation so that it doesn't register as a header click event.
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Method that user can pass to override the default behavior.
   * In order word, user can choose or an item is (usable/visible/enable) by providing his own logic.
   * @param overrideFn: override function callback
   * @param args: multiple arguments provided to the override (cell, row, columnDef, dataContext, grid)
   */
  protected runOverrideFunctionWhenExists<T = any>(overrideFn: ((args: any) => boolean) | undefined, args: T): boolean {
    if (typeof overrideFn === 'function') {
      return overrideFn.call(this, args);
    }
    return true;
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      Plugins: {
        HeaderButtons: SlickHeaderButtons
      }
    }
  });
}

