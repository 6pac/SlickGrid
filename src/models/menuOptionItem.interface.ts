import type { MenuItem } from './menuItem.interface';
import type { MenuOptionItemCallbackArgs } from './menuOptionItemCallbackArgs.interface';

export interface MenuOptionItem extends MenuItem {
  /** An option returned by the onOptionSelected (or action) event callback handler. */
  option: any;

  // --
  // action/override callbacks

  /** Optionally define a callback function that gets executed when item is chosen (and/or use the onCommand event) */
  action?: (event: Event, callbackArgs: MenuOptionItemCallbackArgs) => void;
}
