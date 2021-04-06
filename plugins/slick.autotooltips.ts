// @todo Primitive type should be in some generic type folder
type Primitive = boolean | string | number | null;
// @todo GenericOption type should be in some generic type folder
type GenericOption = Record<string, Primitive>;
// @todo slickGrid type should be in some generic type folder
type SlickGrid = any;

type AutoTooltipsOptions = {
  enableForCells?: boolean;
  enableForHeaderCells?: boolean;
  maxToolTipLength?: number | null;
} & GenericOption;
type AutoTooltipsFunction = (options: AutoTooltipsOptions) => void;

(function ($) {
  // Register namespace
  $.extend(true, window, {
    Slick: {
      AutoTooltips: AutoTooltips,
    },
  });

  /**
   * AutoTooltips plugin to show/hide tooltips when columns are too narrow to fit content.
   * @constructor
   * @param {boolean} [autoTooltipOptions.enableForCells=true]        - Enable tooltip for grid cells
   * @param {boolean} [autoTooltipOptions.enableForHeaderCells=false] - Enable tooltip for header cells
   * @param {number}  [autoTooltipOptions.maxToolTipLength=null]      - The maximum length for a tooltip
   */
  function AutoTooltips(
    this: AutoTooltipsFunction,
    autoTooltipOptions?: AutoTooltipsOptions
  ) {
    let options: AutoTooltipsOptions;
    var _grid: SlickGrid;
    var _defaults = {
      enableForCells: true,
      enableForHeaderCells: false,
      maxToolTipLength: null,
      replaceExisting: true,
    };

    /**
     * Initialize plugin.
     */
    function init(grid: SlickGrid) {
      options = $.extend(true, {}, _defaults, autoTooltipOptions);
      _grid = grid;
      if (options.enableForCells)
        _grid.onMouseEnter.subscribe(handleMouseEnter);
      if (options.enableForHeaderCells)
        _grid.onHeaderMouseEnter.subscribe(handleHeaderMouseEnter);
    }

    /**
     * Destroy plugin.
     */
    function destroy() {
      if (options.enableForCells)
        _grid.onMouseEnter.unsubscribe(handleMouseEnter);
      if (options.enableForHeaderCells)
        _grid.onHeaderMouseEnter.unsubscribe(handleHeaderMouseEnter);
    }

    /**
     * Handle mouse entering grid cell to add/remove tooltip.
     * @param {jQuery.Event} e - The event
     */
    function handleMouseEnter(e: HTMLDivElement) {
      var cell = _grid.getCellFromEvent(e);
      if (cell) {
        var $node: JQuery<HTMLDivElement> = $(
          _grid.getCellNode(cell.row, cell.cell)
        );
        var text: string;
        if (!$node.attr("title") || options.replaceExisting) {
          const innerWidth = $node.innerWidth();
          if (
            typeof innerWidth !== "undefined" &&
            innerWidth < $node[0].scrollWidth
          ) {
            text = $.trim($node.text());
            if (
              options.maxToolTipLength &&
              text.length > options.maxToolTipLength
            ) {
              text = text.substr(0, options.maxToolTipLength - 3) + "...";
            }
          } else {
            text = "";
          }
          $node.attr("title", text);
        }
        $node = null as any;
      }
    }

    type HandleHeaderMouseEnterArgs = {
      column: {
        toolTip: boolean | undefined;
        name: string;
      };
    };

    /**
     * Handle mouse entering header cell to add/remove tooltip.
     * @param {jQuery.Event} e     - The event
     * @param {object} args.column - The column definition
     */
    function handleHeaderMouseEnter(e: any, args: HandleHeaderMouseEnterArgs) {
      var column = args.column,
        $node: JQuery<HTMLDivElement> = $(e.target).closest(
          ".slick-header-column"
        );
      if (column && !column.toolTip) {
        const innerWidth = $node.innerWidth();
        if (typeof innerWidth !== "undefined") {
          $node.attr(
            "title",
            innerWidth < $node[0].scrollWidth ? column.name : ""
          );
        }
      }
      $node = null as any;
    }

    // Public API
    $.extend(this, {
      init: init,
      destroy: destroy,
      pluginName: "AutoTooltips",
    });
  }
})(jQuery);
