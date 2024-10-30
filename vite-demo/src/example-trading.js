import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.0.2/+esm';
import sparkline from '@fnando/sparkline';
import {
  Aggregators,
  SlickRowSelectionModel,
  SlickColumnPicker,
  SlickContextMenu,
  SlickDataView,
  SlickGrid,
  SlickGridMenu,
  SlickHeaderMenu,
  SlickGroupItemMetadataProvider,
  Utils,
} from 'slickgrid';

import exampleHtml from './example-trading.html?raw';
import './example-trading.scss'

export class ExampleTrading {
  dataView;
  grid;
  data;
  columns = [];
  visibleColumns = [];
  options;
  sortcol = 'symbol';
  sortdir = 1;
  percentCompleteThreshold = 0;
  searchString = '';
  highlightDuration = 100; // highlight duration of green/red background color
  itemCount = 200;
  minChangePerCycle = 0;
  maxChangePerCycle = 25;
  refreshRate = 25;
  timer;

  /** render Example HTML code */
  render() {
    return exampleHtml;
  }

  destroy() {
    document.querySelector('#btnStartSimulation').removeEventListener('click', () => this.startSimulation());
    document.querySelector('#btnStopSimulation').removeEventListener('click', () => this.stopSimulation());
    document.querySelector('[data-test="group-currency-btn"]').removeEventListener('click', () => this.groupByColumn('currency'));
    document.querySelector('[data-test="group-market-btn"]').removeEventListener('click', () => this.groupByColumn('market'));
    document.querySelector('[data-test="clear-grouping-btn"]').removeEventListener('click', () => this.dataView.setGrouping([]));
    document.querySelector('[data-test="collapse-all-btn"]').removeEventListener('click', () => this.toggleGrouping(false));
    document.querySelector('[data-test="expand-all-btn"]').removeEventListener('click', () => this.toggleGrouping(true));
  }

  /** initialize Example JS code */
  init() {
    this.columns = [
      {
        id: 'currency', name: 'Currency', field: 'currency', sortable: true, width: 74,
        formatter: (row, cell, value) => `<img src="https://flags.fmcdn.net/data/flags/mini/${value.substring(0, 2).toLowerCase()}.png" width="18"/>&nbsp;${value}`
      },
      { id: 'symbol', name: 'Symbol', field: 'symbol', sortable: true, minWidth: 65, width: 65 },
      {
        id: 'market', name: 'Market', field: 'market', sortable: true, minWidth: 65, width: 65,
      },
      { id: 'company', name: 'Company', field: 'company', sortable: true, minWidth: 80, width: 130 },
      {
        id: 'trsnType', name: 'Type', field: 'trsnType', minWidth: 45, width: 50,
        formatter: (row, cell, value) => {
          return `<span class="bold ${value === 'Buy' ? 'color-info' : 'color-warning'}">${value}</span>`;
        }
      },
      {
        id: 'priceChange', name: 'Change', field: 'priceChange', minWidth: 65, width: 65,
        formatter: this.currencyFormatter
      },
      {
        id: 'price', name: 'Price', field: 'price', minWidth: 70, width: 70,
        formatter: this.currencyFormatter
      },
      {
        id: 'quantity', name: 'Qty', field: 'quantity', width: 50,
      },
      {
        id: 'amount', name: 'Amount', field: 'amount', minWidth: 70, width: 115,
        formatter: this.currencyFormatter, groupTotalsFormatter: this.sumTotalsFormatter
      },
      {
        id: 'historic', name: 'Price History', field: 'historic', minWidth: 100, width: 150, maxWidth: 150,
        formatter: this.historicSparklineFormatter
      },
      {
        id: 'execution', name: 'Execution Timestamp', field: 'execution', sortable: true, width: 175,
        formatter: (row, cell, val) => val.toISOString()
      },
    ];

    // also add Header Menu options
    for (var i = 0; i < this.columns.length; i++) {
      this.columns[i].header = {
        menu: {
          commandItems: [
            {
              iconCssClass: 'sgi sgi-caret sgi-flip-v',
              title: "Sort Ascending",
              disabled: !this.columns[i].sortable,
              // hidden: !this.columns[i].sortable, // you could disable or hide the command completely
              command: "sort-asc"
            },
            {
              iconCssClass: 'sgi sgi-caret',
              title: "Sort Descending",
              disabled: !this.columns[i].sortable,
              // hidden: !this.columns[i].sortable, // you could disable or hide the command completely
              cssClass: !this.columns[i].sortable ? 'italic' : '',
              command: "sort-desc"
            },
            {
              title: "Hide Column",
              command: "hide",
            },
          ]
        }
      };
    }

    // keep a copy of all column for the array of visible columns
    this.visibleColumns = this.columns;

    this.options = {
      editable: true,
      enableAddRow: true,
      enableCellNavigation: true,
      asyncEditorLoading: true,
      forceFitColumns: false,
      gridMenu: {
        iconCssClass: "sgi sgi-menu sgi-17px",
        columnTitle: "Columns",
      },
      topPanelHeight: 35,
      rowHeight: 28
    };

    // prepare the data
    this.data = this.getData(200);

    window.setTimeout(() => {
      this.startSimulation();
    }, this.refreshRate);

    const groupItemMetadataProvider = new SlickGroupItemMetadataProvider();
    this.dataView = new SlickDataView({
      groupItemMetadataProvider,
      inlineFilters: true
    });
    this.grid = new SlickGrid("#myGrid", this.dataView, this.columns, this.options);
    this.grid.registerPlugin(groupItemMetadataProvider);
    this.grid.setSelectionModel(new SlickRowSelectionModel());

    new SlickColumnPicker(this.columns, this.grid, this.options);
    new SlickGridMenu(this.columns, this.grid, this.options);

    const contextMenuOptions = {
      commandTitle: "Commands",
      commandItems: [
        {
          command: "group-collapse", iconCssClass: "sgi sgi-arrow-collapse", title: "Collapse all Groups",
          action: () => this.toggleGrouping(false),
          itemUsabilityOverride: () => this.dataView.getGrouping().length
        },
        {
          command: "group-expand", iconCssClass: "sgi sgi-arrow-expand", title: "Expand all Groups",
          action: () => this.toggleGrouping(true),
          itemUsabilityOverride: () => this.dataView.getGrouping().length
        },
        {
          command: "group-clearing", iconCssClass: "sgi sgi-close", title: "Clear Grouping",
          action: () => this.dataView.setGrouping([]),
          itemUsabilityOverride: () => this.dataView.getGrouping().length
        },
      ],
    };
    const contextMenuPlugin = new SlickContextMenu(contextMenuOptions);
    const headerMenuPlugin = new SlickHeaderMenu({ buttonCssClass: 'sgi sgi-caret' });
    this.grid.registerPlugin(contextMenuPlugin);
    this.grid.registerPlugin(headerMenuPlugin);


    headerMenuPlugin.onCommand.subscribe((e, args) => {
      if (args.command === "hide") {
        // hide column
        this.visibleColumns = this.removeColumnById(this.visibleColumns, args.column.id);
        this.grid.setColumns(this.visibleColumns);
      } else if (args.command === "sort-asc" || args.command === "sort-desc") {
        const isSortedAsc = (args.command === "sort-asc");
        const sortCols = this.removeSortColumnById(grid.getSortColumns(), args.column.id);
        sortCols.push({ sortAsc: isSortedAsc, columnId: args.column.id });
        this.grid.setSortColumns(sortCols);
        this.dataView.sort(this.comparer.bind(this), isSortedAsc);
      } else {
        alert("Command: " + args.command);
      }
    });

    this.grid.onCellChange.subscribe((e, args) => {
      this.dataView.updateItem(args.item.id, args.item);
    });

    this.grid.onSort.subscribe((e, args) => {
      sortdir = args.sortAsc ? 1 : -1;
      sortcol = args.sortCol.field;

      // using native sort with comparer
      this.dataView.sort(comparer, args.sortAsc);
    });

    // wire up model events to drive the grid
    // !! both this.dataView.onRowCountChanged and this.dataView.onRowsChanged MUST be wired to correctly update the grid
    // see Issue#91
    this.dataView.onRowCountChanged.subscribe((e, args) => {
      this.grid.updateRowCount();
      this.grid.render();
    });

    this.dataView.onRowsChanged.subscribe((e, args) => {
      this.grid.invalidateRows(args.rows);
      this.grid.render();
    });

    // wire up the slider to apply the filter to the model
    const highlight = document.getElementById("highlightDuration");
    highlight.oninput = (e) => this.highlightDuration = e.target.value;

    const slider = document.getElementById("refreshRateSlider");
    slider.oninput = (e) => this.refreshRate = e.target.value;

    // initialize the model after all the events have been hooked up
    this.dataView.beginUpdate();
    this.dataView.setItems(this.data);
    this.dataView.endUpdate();

    // if you don't want the items that are not visible (due to being filtered out
    // or being on a different page) to stay selected, pass 'false' to the second arg
    this.dataView.syncGridSelection(this.grid, true);
    document.querySelector('#btnStartSimulation').addEventListener('click', () => this.startSimulation());
    document.querySelector('#btnStopSimulation').addEventListener('click', () => this.stopSimulation());
    document.querySelector('[data-test="group-currency-btn"]').addEventListener('click', () => this.groupByColumn('currency'));
    document.querySelector('[data-test="group-market-btn"]').addEventListener('click', () => this.groupByColumn('market'));
    document.querySelector('[data-test="clear-grouping-btn"]').addEventListener('click', () => this.dataView.setGrouping([]));
    document.querySelector('[data-test="collapse-all-btn"]').addEventListener('click', () => this.toggleGrouping(false));
    document.querySelector('[data-test="expand-all-btn"]').addEventListener('click', () => this.toggleGrouping(true));
  }

  sumTotalsFormatter(totals, columnDef, grid) {
    let val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      return "total: $" + ((Math.round(parseFloat(val) * 100) / 100));
    }
    return "";
  }

  comparer(a, b) {
    var x = a[this.sortcol], y = b[this.sortcol];
    return (x == y ? 0 : (x > y ? 1 : -1));
  }

  historicSparklineFormatter(_row, _cell, _value, _col, dataContext) {
    const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElem.setAttributeNS(null, 'width', '135');
    svgElem.setAttributeNS(null, 'height', '30');
    svgElem.setAttributeNS(null, 'stroke-width', '2');
    svgElem.classList.add('sparkline');
    if (dataContext.historic) {
      sparkline(svgElem, dataContext.historic, { interactive: true });
    }
    return svgElem.outerHTML;
  };

  currencyFormatter(row, cell, value, columnDef, dataContext) {
    return '$' + (Math.round(value * 100) / 100).toFixed(2);
  }

  getData(itemCount) {
    // mock a dataset
    const datasetTmp = [];
    for (let i = 0; i < itemCount; i++) {
      const randomPercent = Math.round(Math.random() * 100);
      const randomLowQty = this.randomNumber(1, 50);
      const randomHighQty = this.randomNumber(125, 255);
      const priceChange = this.randomNumber(-25, 35, false);
      const price = this.randomNumber(priceChange, 300);
      const quantity = price < 5 ? randomHighQty : randomLowQty;
      const amount = price * quantity;
      const now = new Date();
      now.setHours(9, 30, 0);
      const currency = (Math.floor(Math.random() * 10)) % 2
        ? 'CAD'
        : (Math.floor(Math.random() * 10)) % 3 ? 'AUD' : 'USD';
      const company = faker.company.name();

      datasetTmp[i] = {
        id: i,
        currency,
        trsnType: (Math.round(Math.random() * 100)) % 2 ? 'Buy' : 'Sell',
        company,
        symbol: currency === 'CAD' ? company.substring(0, 3).toUpperCase() + '.TO' : company.substring(0, 4).toUpperCase(),
        market: currency === 'AUD' ? 'ASX' : currency === 'CAD' ? 'TSX' : price > 200 ? 'Nasdaq' : 'S&P 500',
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentCompleteNumber: randomPercent,
        priceChange,
        price,
        quantity,
        amount,
        execution: now,
        historic: [price]
      };
    }
    return datasetTmp;
  }

  groupByColumn(columnName) {
    this.grid.setSortColumns([]);
    this.dataView.setGrouping({
      getter: columnName,
      formatter: (g) => {
        return `${columnName.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}: ${g.value}  <span style='color:#029eb7'>(${g.count} items)</span>`;
      },
      aggregators: [
        new Aggregators.Sum("amount")
      ],
      aggregateCollapsed: true,
      collapsed: true,
      lazyTotalsCalculation: true
    });
    this.grid.invalidate();
  }

  toggleGrouping(expand) {
    const groupToggleAllElm = document.querySelector(".slick-group-toggle-all");
    if (expand) {
      this.dataView.expandAllGroups();
      if (groupToggleAllElm) {
        groupToggleAllElm.classList.remove('collapsed');
        groupToggleAllElm.classList.addClass('expanded');
      }
    } else {
      this.dataView.collapseAllGroups();
      if (groupToggleAllElm) {
        groupToggleAllElm.classList.remove('expanded');
        groupToggleAllElm.classList.addClass('collapsed');
      }
    }
  }

  startSimulation() {
    const changes = {};
    const numberOfUpdates = this.randomNumber(this.minChangePerCycle, this.maxChangePerCycle);

    for (let i = 0; i < numberOfUpdates; i++) {
      const randomLowQty = this.randomNumber(1, 50);
      const randomHighQty = this.randomNumber(125, 255);
      const rowNumber = Math.round(Math.random() * (this.data.length - 1));
      const priceChange = this.randomNumber(-25, 25, false);
      const prevItem = Utils.extend(true, {}, this.data[rowNumber]);
      const itemTmp = { ...this.data[rowNumber] };
      itemTmp.priceChange = priceChange;
      itemTmp.price = ((itemTmp.price + priceChange) < 0) ? 0 : itemTmp.price + priceChange;
      itemTmp.quantity = itemTmp.price < 5 ? randomHighQty : randomLowQty;
      itemTmp.amount = itemTmp.price * itemTmp.quantity;
      itemTmp.trsnType = (Math.round(Math.random() * 100)) % 2 ? 'Buy' : 'Sell';
      itemTmp.execution = new Date();
      if (itemTmp.price !== undefined) {
        itemTmp.historic.push(itemTmp.price);
        itemTmp.historic = itemTmp.historic.slice(-20); // keep a max of X historic values
      }

      if (!changes[rowNumber]) {
        changes[rowNumber] = {};
      }

      // highlight whichever cell is being changed
      changes[rowNumber]['id'] = 'changed';
      this.renderCellHighlighting(itemTmp, this.findColumnById('priceChange'), priceChange);
      if ((prevItem.priceChange < 0 && itemTmp.priceChange > 0) || (prevItem.priceChange > 0 && itemTmp.priceChange < 0)) {
        this.renderCellHighlighting(itemTmp, this.findColumnById('price'), priceChange);
      }
      // if (prevItem.trsnType !== itemTmp.trsnType) {
      //   this.renderCellHighlighting(itemTmp, this.findColumnById('trsnType'), priceChange);
      // }

      // update the data
      this.dataView.updateItem(itemTmp.id, itemTmp);
      // NOTE: we should also invalidate/render the row after updating cell data to see the new data rendered in the UI
      // but the cell highlight actually does that for us so we can skip it
    }

    this.timer = window.setTimeout(this.startSimulation.bind(this), this.refreshRate || 0);
  }

  stopSimulation() {
    window.clearTimeout(this.timer);
  }

  findColumnById(columnName) {
    return this.columns.find(col => col.field === columnName);
  }

  renderCellHighlighting(item, column, priceChange) {
    if (item && column) {
      const row = this.dataView.getRowByItem(item);
      if (row >= 0) {
        const hash = { [row]: { [column.id]: priceChange >= 0 ? 'changed-gain' : 'changed-loss' } };
        this.grid.setCellCssStyles(`highlight_${[column.id]}${row}`, hash);

        // remove highlight after x amount of time
        window.setTimeout(() => this.removeCellStyling(item, column, row), this.highlightDuration);
      }
    }
  }

  /** remove change highlight css class from that cell */
  removeCellStyling(_item, column, row) {
    this.grid.removeCellCssStyles(`highlight_${[column.id]}${row}`);
  }

  randomNumber(min, max, floor = true) {
    const number = Math.random() * (max - min + 1) + min;
    return floor ? Math.floor(number) : number;
  }

  removeColumnById(array, idVal) {
    return array.filter((el, i) => el.id !== idVal);
  }

  removeSortColumnById(array, idVal) {
    return array.filter((el, i) => el.columnId !== idVal);
  }
}
