import type { Column, DOMMouseOrTouchEvent, DraggableGroupingOption, Grouping, GroupingGetterFunction, InteractionBase } from '../models/index.js';
import { BindingEventService as BindingEventService_, SlickEvent as SlickEvent_, SlickEventHandler as SlickEventHandler_, Utils as Utils_ } from '../slick.core.js';
import { setupColumnReorderDrag as setupColumnReorderDrag_, setupDropzonePillDrag as setupDropzonePillDrag_ } from '../slick.interactions.js';
import type { SlickDataView } from '../slick.dataview.js';
import type { SlickGrid } from '../slick.grid.js';

// for (iife) load Slick methods from global Slick object, or use imports for (esm)
const BindingEventService = IIFE_ONLY ? Slick.BindingEventService : BindingEventService_;
const SlickEvent = IIFE_ONLY ? Slick.Event : SlickEvent_;
const SlickEventHandler = IIFE_ONLY ? Slick.EventHandler : SlickEventHandler_;
const Utils = IIFE_ONLY ? Slick.Utils : Utils_;
const setupColumnReorderDrag = IIFE_ONLY ? Slick.setupColumnReorderDrag : setupColumnReorderDrag_;
const setupDropzonePillDrag = IIFE_ONLY ? Slick.setupDropzonePillDrag : setupDropzonePillDrag_;

/**
 *
 * Draggable Grouping contributed by:  Muthukumar Selvarasu
 *  muthukumar{dot}se{at}gmail{dot}com
 *  github.com/muthukumarse/Slickgrid
 *
 * NOTES:
 *     This plugin provides the Draggable Grouping feature which could be located in either the Top-Header or the Pre-Header
 * A plugin to add Draggable Grouping feature.
 *
 * USAGE:
 *
 * Add the plugin .js & .css files and register it with the grid.
 *
 *
 * The plugin expose the following methods:
 *    destroy: used to destroy the plugin
 *    setDroppedGroups: provide option to set default grouping on loading
 *    clearDroppedGroups: provide option to clear grouping
 *    getSetupColumnReorder: its function to setup draggable feature agains Header Column, should be passed on grid option. Also possible to pass custom function
 *
 *
 * The plugin expose the following event(s):
 *    onGroupChanged: pass the grouped columns to who subscribed.
 *
 */
export class SlickDraggableGrouping {
  // --
  // public API
  pluginName = 'DraggableGrouping' as const;
  onGroupChanged = new SlickEvent<{ caller?: string; groupColumns: Grouping[]; }>('onGroupChanged');

  // --
  // protected props
  protected _grid!: SlickGrid;
  protected _gridUid = '';
  protected _gridColumns: Column[] = [];
  protected _dataView!: SlickDataView;
  protected _dropzoneElm!: HTMLDivElement;
  protected _dropzonePillDrag?: InteractionBase;
  protected _dropzonePlaceholder!: HTMLDivElement;
  protected _groupToggler?: HTMLDivElement;
  protected _isInitialized = false;
  protected _options: DraggableGroupingOption;
  protected _defaults: DraggableGroupingOption = {
    dropPlaceHolderText: 'Drop a column header here to group by the column',
    hideGroupSortIcons: false,
    hideToggleAllButton: false,
    toggleAllButtonText: '',
    toggleAllPlaceholderText: 'Toggle all Groups',
  };
  protected _bindingEventService = new BindingEventService();
  protected _handler = new SlickEventHandler();
  protected _columnReorderDrag?: InteractionBase;
  protected _columnsGroupBy: Column[] = [];

  /**
   * @param options {Object} Options:
   *    deleteIconCssClass:  an extra CSS class to add to the delete button (default undefined), if deleteIconCssClass && deleteIconImage undefined then slick-groupby-remove-image class will be added
   *    deleteIconImage:     a url to the delete button image (default undefined)
   *    groupIconCssClass:   an extra CSS class to add to the grouping field hint  (default undefined)
   *    groupIconImage:      a url to the grouping field hint image (default undefined)
   *    dropPlaceHolderText:      option to specify set own placeholder note text
   */
  constructor(options: Partial<DraggableGroupingOption>) {
    this._options = Utils.extend(true, {}, this._defaults, options);
  }

  /**
   * Initialize plugin.
   */
  init(grid: SlickGrid) {
    this._grid = grid;
    Utils.addSlickEventPubSubWhenDefined(grid.getPubSubService(), this);

    this._gridUid = this._grid.getUID();
    this._gridColumns = this._grid.getColumns();
    this._dataView = this._grid.getData();
    this._dropzoneElm = this._grid.getTopHeaderPanel() || this._grid.getPreHeaderPanel();
    if (!this._dropzoneElm) {
      throw new Error(
        '[Slickgrid] Draggable Grouping requires the pre-header to be created and shown for the plugin to work correctly (use `createPreHeaderPanel` and `showPreHeaderPanel`).'
      );
    }
    this._dropzoneElm.classList.add('slick-dropzone');

    const dropPlaceHolderText = this._options.dropPlaceHolderText || 'Drop a column header here to group by the column';

    this._dropzonePlaceholder = document.createElement('div');
    this._dropzonePlaceholder.className = 'slick-placeholder';
    this._dropzonePlaceholder.textContent = dropPlaceHolderText;

    this._groupToggler = document.createElement('div');
    this._groupToggler.className = 'slick-group-toggle-all expanded';
    this._groupToggler.style.display = 'none';

    this._dropzoneElm.appendChild(this._dropzonePlaceholder);
    this._dropzoneElm.appendChild(this._groupToggler);

    this.setupColumnDropbox();


    this._handler.subscribe(this._grid.onHeaderCellRendered, (_e, args) => {
      const column = args.column;
      const node = args.node;
      if (!Utils.isEmptyObject(column.grouping) && node) {
        node.style.cursor = 'pointer'; // add the pointer cursor on each column title

        // also optionally add an icon beside each column title that can be dragged
        if (this._options.groupIconCssClass || this._options.groupIconImage) {
          const groupableIconElm = document.createElement('span');
          groupableIconElm.className = 'slick-column-groupable';
          if (this._options.groupIconCssClass) {
            groupableIconElm.classList.add(...Utils.classNameToList(this._options.groupIconCssClass));
          }
          if (this._options.groupIconImage) {
            groupableIconElm.style.background = `url(${this._options.groupIconImage}) no-repeat center center`;
          }
          node.appendChild(groupableIconElm);
        }
      }
    });

    for (let i = 0; i < this._gridColumns.length; i++) {
      const columnId = this._gridColumns[i].field;
      this._grid.updateColumnHeader(columnId);
    }
  }

  /**
   * Setup the column reordering
   * NOTE: this function is a standalone function and is called externally and does not have access to `this` instance
   * @param grid - slick grid object
   * @param headers - slick grid column header elements
   * @param _headerColumnWidthDiff - header column width difference
   * @param setColumns - callback to reassign columns
   * @param setupColumnResize - callback to setup the column resize
   * @param columns - columns array
   * @param getColumnIndex - callback to find index of a column
   * @param uid - grid UID
   * @param trigger - callback to execute when triggering a column grouping
   */
  getSetupColumnReorder(grid: SlickGrid, _headers: any, _headerColumnWidthDiff: any, setColumns: (columns: Column[]) => void, setupColumnResize: () => void, _columns: Column[], getColumnIndex: (columnId: string) => number, _uid: string, trigger: (slickEvent: SlickEvent_, data?: any) => void) {
    this.destroyColumnReorderInstance();
    const dropzoneElm = grid.getTopHeaderPanel() || grid.getPreHeaderPanel();
    const groupTogglerElm = dropzoneElm.querySelector<HTMLDivElement>('.slick-group-toggle-all');
    const headerLeft = document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-left`) as HTMLDivElement;
    const headerRight = document.querySelector(`.${grid.getUID()} .slick-header-columns.slick-header-columns-right`) as HTMLDivElement;

    // restore the dropzone UI that gets altered while a header drag is in flight (hidden pills, shown placeholder, hover classes)
    const restoreDropzoneUI = () => {
      const draggablePlaceholderElm = dropzoneElm.querySelector<HTMLDivElement>('.slick-placeholder');
      dropzoneElm.classList.remove('slick-dropzone-hover');
      draggablePlaceholderElm?.classList.remove('slick-dropzone-placeholder-hover');

      if (this._dropzonePlaceholder) {
        this._dropzonePlaceholder.style.display = 'none';
      }
      if (draggablePlaceholderElm) {
        draggablePlaceholderElm.parentElement?.classList.remove('slick-dropzone-placeholder-hover');
      }

      const droppedGroupingElms = dropzoneElm.querySelectorAll<HTMLDivElement>('.slick-dropped-grouping');
      if (droppedGroupingElms.length) {
        droppedGroupingElms.forEach(droppedGroupingElm => droppedGroupingElm.style.display = 'inline-flex');
        if (draggablePlaceholderElm) {
          draggablePlaceholderElm.style.display = 'none';
        }
        if (groupTogglerElm) {
          groupTogglerElm.style.display = 'inline-block';
        }
      }
    };

    this._columnReorderDrag = setupColumnReorderDrag({
      headerLeft,
      headerRight,
      container: grid.getContainerNode(),
      viewportScrollContainerX: grid.getViewportNode() ?? grid.getContainerNode(),
      hasFrozenColumns: () => (grid.getOptions().frozenColumn ?? -1) >= 0,
      draggableSelector: '.slick-header-column',
      dragActiveClass: 'slick-header-column-active',
      unorderableColumnCssClass: grid.getOptions().unorderableColumnCssClass,
      onDragStart: () => {
        dropzoneElm.classList.add('slick-dropzone-hover');
        dropzoneElm.classList.add('slick-dropzone-placeholder-hover');
        const draggablePlaceholderElm = dropzoneElm.querySelector<HTMLDivElement>('.slick-placeholder');
        if (draggablePlaceholderElm) {
          draggablePlaceholderElm.style.display = 'inline-block';
        }

        const droppedGroupingElms = dropzoneElm.querySelectorAll<HTMLDivElement>('.slick-dropped-grouping');
        droppedGroupingElms.forEach(droppedGroupingElm => droppedGroupingElm.style.display = 'none');
        if (groupTogglerElm) {
          groupTogglerElm.style.display = 'none';
        }
      },
      onDragEnd: (reorderedIds) => {
        restoreDropzoneUI();

        if (!grid.getEditorLock().commitCurrentEdit()) {
          return;
        }

        const finalReorderedColumns: Column[] = [];
        const reorderedColumns = grid.getColumns();
        for (const reorderedId of reorderedIds) {
          finalReorderedColumns.push(reorderedColumns[getColumnIndex.call(grid, reorderedId)]);
        }
        setColumns.call(grid, finalReorderedColumns);
        trigger.call(grid, grid.onColumnsReordered, { grid, impactedColumns: finalReorderedColumns });
        setupColumnResize.call(grid);
      },
      onDrop: (draggedEl) => {
        // column header dropped onto the dropzone: group by that column (the engine already restored
        // the header element to its original position in the header row)
        restoreDropzoneUI();
        this.handleGroupByDrop(dropzoneElm, draggedEl as HTMLDivElement);
      },
    });

    // user can optionally provide initial groupBy columns
    if (this._options.initialGroupBy && !this._isInitialized) {
      setTimeout(() => this.setDroppedGroups(this._options.initialGroupBy || []), 0);
    }
    this._isInitialized = true;

    // NOTE: breaking change - this previously returned `{ sortableLeftInstance, sortableRightInstance }`
    // (SortableJS instances); it now returns the single native drag instance which only exposes `destroy()`
    return {
      columnReorderDragInstance: this._columnReorderDrag
    };
  }

  /**
   * Destroy plugin.
   */
  destroy() {
    this.destroyColumnReorderInstance();
    this._dropzonePillDrag?.destroy();
    this._dropzonePillDrag = undefined;
    this.onGroupChanged.unsubscribe();
    this._handler.unsubscribeAll();
    this._bindingEventService.unbindAll();
    Utils.emptyElement(document.querySelector(`.${this._gridUid} .slick-preheader-panel,.${this._gridUid} .slick-topheader-panel`));
  }

  protected destroyColumnReorderInstance() {
    this._columnReorderDrag?.destroy();
    this._columnReorderDrag = undefined;
  }

  protected setupColumnDropbox() {
    const dropzoneElm = this._dropzoneElm;

    this._dropzonePillDrag = setupDropzonePillDrag({
      dropzoneElm,
      itemSelector: '.slick-dropped-grouping',
      draggingCssClass: 'slick-droppable-sortitem-hover',
      onPillDragEnd: () => {
        // read the new pill order from the DOM and reapply the grouping when it changed
        const sortArray = Array.from(dropzoneElm.querySelectorAll<HTMLDivElement>('.slick-dropped-grouping')).map(elm => elm.dataset.id ?? '');
        const newGroupingOrder: Column[] = [];
        for (const id of sortArray) {
          const columnGroupBy = this._columnsGroupBy.find(col => String(col.id) === id);
          if (columnGroupBy) {
            newGroupingOrder.push(columnGroupBy);
          }
        }
        const isSameOrder = newGroupingOrder.length === this._columnsGroupBy.length && newGroupingOrder.every((col, idx) => col === this._columnsGroupBy[idx]);
        if (!isSameOrder) {
          this._columnsGroupBy = newGroupingOrder;
          this.updateGroupBy('sort-group');
        }
      },
      onColumnDragEnter: () => dropzoneElm.classList.add('slick-dropzone-hover'),
      onColumnDragLeave: () => dropzoneElm.classList.remove('slick-dropzone-hover'),
      onColumnDrop: (columnDataId) => {
        // native HTML5 drop of a column header onto the dropzone; also handled (and deduplicated by
        // handleGroupByDrop) through the column reorder drag's own onDrop for the non-native fallbacks
        const headerColumnElm = this._grid.getHeaderColumn(columnDataId);
        if (headerColumnElm) {
          this.handleGroupByDrop(dropzoneElm, headerColumnElm as HTMLDivElement);
        }
      },
    });

    if (this._groupToggler) {
      this._bindingEventService.bind(this._groupToggler, 'click', ((event: DOMMouseOrTouchEvent<HTMLDivElement>) => {
        const target = event.target;
        this.toggleGroupToggler(target, target?.classList.contains('expanded'));
      }) as EventListener);
    }
  }

  protected handleGroupByDrop(containerElm: HTMLDivElement, headerColumnElm: HTMLDivElement) {
    const headerColDataId = headerColumnElm.getAttribute('data-id');
    const columnId = headerColDataId?.replace(this._gridUid, '');
    let columnAllowed = true;
    for (const colGroupBy of this._columnsGroupBy) {
      if (colGroupBy.id === columnId) {
        columnAllowed = false;
      }
    }

    if (columnAllowed) {
      for (const col of this._gridColumns) {
        if (col.id === columnId && col.grouping && !Utils.isEmptyObject(col.grouping)) {
          const columnNameElm = headerColumnElm.querySelector('.slick-column-name');
          const entryElm = document.createElement('div');
          entryElm.id = `${this._gridUid}_${col.id}_entry`;
          entryElm.className = 'slick-dropped-grouping';
          entryElm.dataset.id = `${col.id}`;
          entryElm.draggable = true; // needed for the native HTML5 pill drag

          const groupTextElm = document.createElement('div');
          groupTextElm.className = 'slick-dropped-grouping-title';
          groupTextElm.style.display = 'inline-flex';
          groupTextElm.textContent = columnNameElm ? columnNameElm.textContent : headerColumnElm.textContent;
          entryElm.appendChild(groupTextElm);

          // delete icon
          const groupRemoveIconElm = document.createElement('div');
          groupRemoveIconElm.className = 'slick-groupby-remove';
          if (this._options.deleteIconCssClass) {
            groupRemoveIconElm.classList.add(...Utils.classNameToList(this._options.deleteIconCssClass));
          }
          if (this._options.deleteIconImage) {
            groupRemoveIconElm.classList.add(...Utils.classNameToList(this._options.deleteIconImage));
          }
          if (!this._options.deleteIconCssClass) {
            groupRemoveIconElm.classList.add('slick-groupby-remove-icon');
          }
          if (!this._options.deleteIconCssClass && !this._options.deleteIconImage) {
            groupRemoveIconElm.classList.add('slick-groupby-remove-image');
          }

          // sorting icons when enabled
          if (this._options?.hideGroupSortIcons !== true && col.sortable) {
            if (col.grouping?.sortAsc === undefined) {
              col.grouping.sortAsc = true;
            }
          }

          entryElm.appendChild(groupRemoveIconElm);
          entryElm.appendChild(document.createElement('div'));
          containerElm.appendChild(entryElm);

          this.addColumnGroupBy(col);
          this.addGroupByRemoveClickHandler(col.id, groupRemoveIconElm, headerColumnElm, entryElm);
        }
      }

      // show the "Toggle All" when feature is enabled
      if (this._groupToggler && this._columnsGroupBy.length > 0) {
        this._groupToggler.style.display = 'inline-block';
      }
    }
  }

  protected addColumnGroupBy(column: Column) {
    this._columnsGroupBy.push(column);
    this.updateGroupBy('add-group');
  }

  protected addGroupByRemoveClickHandler(id: string | number, groupRemoveIconElm: HTMLDivElement, headerColumnElm: HTMLDivElement, entry: any) {
    this._bindingEventService.bind(groupRemoveIconElm, 'click', () => {
      const boundedElms = this._bindingEventService.getBoundedEvents().filter(boundedEvent => boundedEvent.element === groupRemoveIconElm);
      for (const boundedEvent of boundedElms) {
        this._bindingEventService.unbind(boundedEvent.element, 'click', boundedEvent.listener);
      }
      this.removeGroupBy(id, headerColumnElm, entry);
    });
  }

  setDroppedGroups(groupingInfo: Array<string | GroupingGetterFunction> | string) {
    const groupingInfos = Array.isArray(groupingInfo) ? groupingInfo : [groupingInfo];
    this._dropzonePlaceholder.style.display = 'none';
    for (const groupInfo of groupingInfos) {
      const columnElm = this._grid.getHeaderColumn(groupInfo as string);
      this.handleGroupByDrop(this._dropzoneElm, columnElm);
    }
  }

  clearDroppedGroups() {
    this._columnsGroupBy = [];
    this.updateGroupBy('clear-all');
    const allDroppedGroupingElms = this._dropzoneElm.querySelectorAll('.slick-dropped-grouping');

    for (const groupElm of Array.from(allDroppedGroupingElms)) {
      const groupRemoveBtnElm = this._dropzoneElm.querySelector('.slick-groupby-remove');
      groupRemoveBtnElm?.remove();
      groupElm?.remove();
    }

    // show placeholder text & hide the "Toggle All" when that later feature is enabled
    this._dropzonePlaceholder.style.display = 'inline-block';
    if (this._groupToggler) {
      this._groupToggler.style.display = 'none';
    }
  }

  protected removeFromArray(arrayToModify: any[], itemToRemove: any) {
    if (Array.isArray(arrayToModify)) {
      const itemIdx = arrayToModify.findIndex(a => a.id === itemToRemove.id);
      if (itemIdx >= 0) {
        arrayToModify.splice(itemIdx, 1);
      }
    }
    return arrayToModify;
  }

  protected removeGroupBy(id: string | number, _hdrColumnElm: HTMLDivElement, entry: any) {
    entry.remove();
    const groupby: Column[] = [];
    this._gridColumns.forEach((col) => groupby[col.id as any] = col);
    this.removeFromArray(this._columnsGroupBy, groupby[id as any]);
    if (this._columnsGroupBy.length === 0) {
      this._dropzonePlaceholder.style.display = 'block';
      if (this._groupToggler) {
        this._groupToggler.style.display = 'none';
      }
    }
    this.updateGroupBy('remove-group');
  }

  protected toggleGroupToggler(targetElm: Element | null, collapsing = true, shouldExecuteDataViewCommand = true) {
    if (targetElm) {
      if (collapsing === true) {
        targetElm.classList.add('collapsed');
        targetElm.classList.remove('expanded');
        if (shouldExecuteDataViewCommand) {
          this._dataView.collapseAllGroups();
        }
      } else {
        targetElm.classList.remove('collapsed');
        targetElm.classList.add('expanded');
        if (shouldExecuteDataViewCommand) {
          this._dataView.expandAllGroups();
        }
      }
    }
  }

  protected updateGroupBy(originator: string) {
    if (this._columnsGroupBy.length === 0) {
      this._dataView.setGrouping([]);
      this.onGroupChanged.notify({ caller: originator, groupColumns: [] });
      return;
    }
    const groupingArray: Grouping<any>[] = [];
    this._columnsGroupBy.forEach((element) => groupingArray.push(element.grouping!));
    this._dataView.setGrouping(groupingArray);
    this.onGroupChanged.notify({ caller: originator, groupColumns: groupingArray });
  }
}

// extend Slick namespace on window object when building as iife
if (IIFE_ONLY && window.Slick) {
  Utils.extend(true, window, {
    Slick: {
      DraggableGrouping: SlickDraggableGrouping
    }
  });
}
