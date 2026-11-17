export interface AutoHeightOption {
  /**
   * Defaults to false. When enabled, the top-header panel, the pre-header and column headers, and the header row (filters) stick to
   * the top of the page (or of the nearest scrolling ancestor) while the grid is scrolled through.
   * Use the `--slick-sticky-header-top` CSS variable to offset them below fixed page content, such as a fixed navbar.
   */
  stickyHeader?: boolean;
}
