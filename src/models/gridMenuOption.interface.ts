import type { Column, GridMenuItem, GridOption, MenuCallbackArgs, } from './index';

export interface GridMenuOption {
  /** Defaults to "Commands" which is the title that shows up over the custom commands list */
  customTitle?: string;

  /** Array of command items (title, command, disabled, ...) */
  customItems?: Array<GridMenuItem | 'divider'>;

  /** Defaults to 0 (auto), minimum width of grid menu content (command, column list) */
  contentMinWidth?: number;

  /** Defaults to "Columns" which is the title that shows up over the columns */
  columnTitle?: string;

  /** Defaults to "Force fit columns" which is 1 of the last 2 checkbox title shown at the end of the picker list */
  forceFitTitle?: string;

  /**
   * Defaults to undefined, fixed height of the Grid Menu content, when provided it will be used instead of the max-height.
   * Can be a number or a string, if a number is provided it will add the `px` suffix for pixels, or if a string is passed it will use it as is.
   */
  height?: number | string;

  /** Defaults to false, show/hide 1 of the last 2 checkbox at the end of the picker list */
  hideForceFitButton?: boolean;

  /** Defaults to false, show/hide 1 of the last 2 checkbox at the end of the picker list */
  hideSyncResizeButton?: boolean;

  /**  Grid Menu icon (hamburger icon) */
  iconImage?: string;

  /** CSS class for the displaying the Grid menu icon (basically the hamburger menu) */
  iconCssClass?: string;

  /** Defaults to False, which leads to leaving the menu open after a click */
  leaveOpen?: boolean;

  /** Defaults to 15, margin to use at the bottom of the grid menu to deduce from the max-height, only in effect when height is undefined */
  marginBottom?: number;

  /**
   * Defaults to available space at the bottom, Grid Menu minimum height.
   * Can be a number or a string, if a number is provided it will add the `px` suffix for pixels, or if a string is passed it will use it as is.
   */
  maxHeight?: number | string;

  /** Defaults to 16 pixels (only the number), which is the width in pixels of the Grid Menu icon container */
  menuWidth?: number;

  /** Defaults to False, which will resize the Header Row and remove the width of the Grid Menu icon from it's total width. */
  resizeOnShowHeaderRow?: boolean;

  /** Defaults to true, allows the user to control if the default gridMenu button (located on the top right corner by default CSS) should be created or omitted */
  showButton?: boolean;

  /** Defaults to "Synchronous resize" which is 1 of the last 2 checkbox title shown at the end of the picker list */
  syncResizeTitle?: string;

  /** Use the Click offset to reposition the Grid Menu (defaults to true), when set to False it will use the icon offset to reposition the grid menu */
  useClickToRepositionMenu?: boolean;

  /**
   * Width (alias to `menuWidth`) that the drop menu can have.
   * NOTE: the menu also has a "min-width" defined in CSS/SASS and setting a "width" below that threshold won't work, you change this min-width via SASS `$slick-menu-min-width`
   */
  width?: number | string;

  // --
  // action/override callbacks

  /** Callback method to override the column name output used by the ColumnPicker/GridMenu. */
  headerColumnValueExtractor?: (column: Column, gridOptions?: GridOption) => string;

  /** Callback method that user can override the default behavior of enabling/disabling an item from the list. */
  menuUsabilityOverride?: (args: MenuCallbackArgs<any>) => boolean;
}
