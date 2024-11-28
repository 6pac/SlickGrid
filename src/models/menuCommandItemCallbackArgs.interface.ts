import type { MenuCallbackArgs } from './menuCallbackArgs.interface.js';
import type { MenuCommandItem } from './menuCommandItem.interface.js';

export interface MenuCommandItemCallbackArgs extends MenuCallbackArgs {
  /** A command identifier returned by the onCommand (or action) event callback handler. */
  command: string;

  /** Menu item selected */
  item: MenuCommandItem;

  /** Value of the cell we triggered the menu from */
  value?: any;
}
