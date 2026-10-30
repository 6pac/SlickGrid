import type { Column, MenuCommandItem } from './index.js';
import type { SlickGrid } from '../slick.grid.js';

export interface HeaderMenuItems {
  /** List of command items to show in the header menu. */
  commandItems?: Array<HeaderMenuCommandItem | 'divider'>;

}

export interface HeaderMenuCommandItemCallbackArgs {
  /** Column definition */
  column: Column;

  /** Slick Grid object */
  grid: SlickGrid;

  /** Command items of the menu being populated. `onBeforeMenuShow` and `onAfterMenuShow` receive the column's `header.menu` object instead. */
  menu: Array<HeaderMenuCommandItem | 'divider'>;
}

export interface HeaderMenuCommandItem extends Omit<MenuCommandItem, 'commandItems'> {
  /** Array of Command Items (title, command, disabled, ...) */
  commandItems?: Array<HeaderMenuCommandItem | 'divider'>;

}
