import type { Column, MenuCommandItem } from './index';
import type { SlickGrid } from '../slick.grid';

export interface HeaderMenuItems {
  items: Array<HeaderMenuCommandItem | 'divider'>;
}

export interface HeaderMenuCommandItemCallbackArgs {
  /** Column definition */
  column: Column;

  /** Slick Grid object */
  grid: SlickGrid;

  /** html DOM element of the menu */
  menu: Array<HeaderMenuCommandItem | 'divider'>;
}

export interface HeaderMenuCommandItem extends Omit<MenuCommandItem, 'commandItems'> {
  /** Array of Command Items (title, command, disabled, ...) */
  items: Array<HeaderMenuCommandItem | 'divider'>;
}