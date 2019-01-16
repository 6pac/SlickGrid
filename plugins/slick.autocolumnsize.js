(function ($) {

    $.extend(true, window, {
        "Slick": {
            "Plugins": {
                "AutoColumnSize": AutoColumnSize
            }
        }
    });

    function AutoColumnSize(options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _defaults = {
            maxWidth: 800
        };

        var context;
        keyCodes = {
            'A': 65
        };

        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            maxWidth = options.maxWidth;

            _handler
                .subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered)
                .subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy)
                .subscribe(_grid.onKeyDown, handleControlKeys);

            context = document.createElement("canvas").getContext("2d");
        }

        function handleHeaderCellRendered(e, args) {
            var c = args.node;
            $(c).on("dblclick.autosize", ".slick-resizable-handle", reSizeColumn);            
        }

        function handleBeforeHeaderCellDestroy(e, args) {           
            var c = args.node;
            $(c).off("dblclick.autosize", ".slick-resizable-handle", reSizeColumn);
        }

        function destroy() {
            _handler.unsubscribeAll();
        }

        function handleControlKeys(event) {
            if (event.ctrlKey && event.shiftKey && event.keyCode === keyCodes.A) {
                resizeAllColumns();
            }
        }

        function resizeAllColumns() {
            if (_grid.getContainerNode().offsetParent === null) return;
            var allColumns = _grid.getColumns();
            var gridOps = _grid.getOptions();

            allColumns.forEach(function (columnDef, index) {
                if (columnDef && (!columnDef.resizable || columnDef._autoCalcWidth === true)) return;
                var el = document.getElementById(_grid.getUID() + columnDef.id);
                var headerWidth = getElementWidth(el);
                var autoSizeWidth = Math.max(headerWidth, getMaxColumnTextWidth(columnDef, index)) + 1;

                // Check we are smaller than the maxWidth if provided
                autoSizeWidth = Math.min(maxWidth, autoSizeWidth);

                // Save a piece of info against column so we don't calculate every time we call resize
                columnDef._autoCalcWidth = true;
                columnDef.width = autoSizeWidth;   
                columnDef.minWidth = autoSizeWidth;  
            });
            _grid.autosizeColumns();
            _grid.onColumnsResized.notify();
        }

        function reSizeColumnByName(name) {
            var columnIdx = _grid.getColumnIndex(name);
            var allColumns = _grid.getColumns();
            var columnDef;
            if (columnIdx !== undefined) {
                columnDef = allColumns[columnIdx];
            }

            if (!columnDef || !columnDef.resizable) {
                return;
            }

            var headerWidth = columnDef.width;
            var autoSizeWidth = Math.max(headerWidth, getMaxColumnTextWidth(columnDef, columnIdx)) + 1;

            if (autoSizeWidth !== headerWidth) {
                columnDef.width = autoSizeWidth;
                _grid.autosizeColumns();
                _grid.onColumnsResized.notify();
            }
        }

        function reSizeColumn(e) {
            var headerEl = $(e.currentTarget).closest('.slick-header-column');
            var columnDef = headerEl.data('column');

            if (!columnDef || !columnDef.resizable) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var headerWidth = getElementWidth(headerEl[0]);
            var colIndex = _grid.getColumnIndex(columnDef.id);
            var allColumns = _grid.getColumns();
            var column = allColumns[colIndex];

            var autoSizeWidth = Math.max(headerWidth, getMaxColumnTextWidth(columnDef, colIndex)) + 1;

            if (autoSizeWidth !== column.width) {
                column.width = autoSizeWidth;
                _grid.autosizeColumns();
                _grid.onColumnsResized.notify();
            }
        }

        function getMaxColumnTextWidth(columnDef, colIndex) {
            var texts = [];
            var rowEl = createRow(columnDef);
            var data = _grid.getData();
            if (Slick.Data && data instanceof Slick.Data.DataView) {
                data = data.getItems();
            }

            let length = data.length, result = [], seen = new Set();
            outer:
            for (let index = 0; index < length; index++) {
              let value = data[index][columnDef.field];
              if (seen.has(value)) continue outer;
              seen.add(value);
              result.push(value);
            }

            var template = getMaxTextTemplate(result, columnDef, colIndex, data, rowEl);
            var width = getTemplateWidth(rowEl, template);
            deleteRow(rowEl);
            return width;
        }

        function getTemplateWidth(rowEl, template) {
            var cell = $(rowEl.find(".slick-cell"));
            cell.append(template);
            $(cell).find("*").css("position", "relative");
            return cell.outerWidth() + 1;
        }

        function getMaxTextTemplate(texts, columnDef, colIndex, data, rowEl) {
            var max = 0,
                maxTemplate = null;
            var formatFun = columnDef.formatter;

            context.font = rowEl.css("font-size") + " " + rowEl.css("font-family");
            $(texts).each(function (index, text) {
                var template;
                if (formatFun) {
                    template = $("<span>" + formatFun(index, colIndex, text, columnDef, data[index]) + "</span>");
                    text = template.text() || text;
                }

                var length = text ? context.measureText(text).width : 0;
                if (length > max) {
                    max = length;
                    maxTemplate = template || text;
                }
            });
            return maxTemplate;
        }

        function createRow(columnDef) {
            var rowEl = $('<div class="slick-row"><div class="slick-cell"></div></div>');
            rowEl.find(".slick-cell").css({
                "visibility": "hidden",
                "text-overflow": "initial",
                "white-space": "nowrap"
            });
            var gridCanvas = $(_grid.getContainerNode()).find(".grid-canvas")[0];
            $(gridCanvas).append(rowEl);
            return rowEl;
        }

        function deleteRow(rowEl) {
            $(rowEl).remove();
        }

        function getElementWidth(element) {
            var width, clone = element.cloneNode(true);
            clone.style.cssText = 'position: absolute; visibility: hidden;right: auto;text-overflow: initial;white-space: nowrap;';
            element.parentNode.insertBefore(clone, element);
            width = clone.offsetWidth;
            clone.parentNode.removeChild(clone);
            return width;
        }

        function getElementWidthUsingCanvas(element, text) {
            context.font = element.css("font-size") + " " + element.css("font-family");
            var metrics = context.measureText(text);
            return metrics.width;
        }

        return {
            "init": init,
            "destroy": destroy,

            "resizeAllColumns": resizeAllColumns,
            "reSizeColumnByName": reSizeColumnByName
        };
    }
}(jQuery));
