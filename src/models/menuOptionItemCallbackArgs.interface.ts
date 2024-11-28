import type { MenuOptionItem } from './menuOptionItem.interface.js';
import type { MenuCallbackArgs } from './menuCallbackArgs.interface.js';

export interface MenuOptionItemCallbackArgs extends MenuCallbackArgs {
  /** A command identifier to be passed to the onCommand event callback handler (when using "commandItems"). */
  option: string;

  /** Menu item selected */
  item: MenuOptionItem;

  /** Value of the cell we triggered the context menu from */
  value?: any;
}
