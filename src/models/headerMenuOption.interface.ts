import type { Column } from './index';
import type { SlickGrid } from '../slick.grid';

export interface HeaderMenuOption {
  /** Auto-align drop menu to the left when not enough viewport space to show on the right */
  autoAlign?: boolean;

  /** When drop menu is aligned to the left, it might not be perfectly aligned with the header menu icon, if that is the case you can add an offset (positive/negative number to move right/left) */
  autoAlignOffset?: number;

  /** an extra CSS class to add to the menu button */
  buttonCssClass?: string;

  /** a url to the menu button image */
  buttonImage?: string;

  /** A CSS class to be added to the menu item icon. */
  iconCssClass?: string;

  /** Header Menu dropdown offset top */
  menuOffsetTop?: number;

  /** Minimum width that the drop menu will have */
  minWidth?: number;

  /** Menu item text. */
  title?: string;

  /** Item tooltip. */
  tooltip?: string;

  // --
  // Methods

  /** Callback method that user can override the default behavior of enabling/disabling an item from the list. */
  menuUsabilityOverride?: (args: { grid: SlickGrid, column: Column, menu: HTMLElement }) => boolean;
}
