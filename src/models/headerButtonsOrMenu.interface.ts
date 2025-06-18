import type { HeaderButtonItem } from './headerButtonItem.interface.js';
import type { HeaderMenuItems } from './headerMenuItems.interface.js';

export interface HeaderButtonsOrMenu {
  /** list of Buttons to show in the header */
  buttons?: Array<HeaderButtonItem>;
  menu?: HeaderMenuItems;
}