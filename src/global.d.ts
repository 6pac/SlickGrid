import type { Sortable } from 'sortablejs';

import type {
  BindingEventService,
  ColAutosizeMode,
  GridAutosizeColsMode,
  keyCode,
  preClickClassName,
  RowSelectionMode,
  SlickEvent,
  SlickEventData,
  SlickEventHandler,
  SlickGlobalEditorLock,
  SlickGroup,
  SlickGroupTotals,
  SlickRange,
  Utils,
  ValueFilterMode,
  WidthEvalMode,
} from './slick.core';
import type { SlickColumnMenu } from './controls/slick.columnmenu';
import type { SlickColumnPicker } from './controls/slick.columnpicker';
import type { SlickGridMenu } from './controls/slick.gridmenu';
import type { SlickGridPager } from './controls/slick.pager';
import type { SlickAutoTooltip } from './plugins/slick.autotooltips';
import type { SlickCellCopyManager } from './plugins/slick.cellcopymanager';
import type { SlickCellMenu } from './plugins/slick.cellmenu';
import type { SlickContextMenu } from './plugins/slick.contextmenu';
import type { SlickHeaderButtons } from './plugins/slick.headerbuttons';
import type { SlickHeaderMenu } from './plugins/slick.headermenu';
import type { SlickCellExternalCopyManager } from './plugins/slick.cellexternalcopymanager';
import type { SlickCellRangeDecorator } from './plugins/slick.cellrangedecorator';
import type { SlickCellRangeSelector } from './plugins/slick.cellrangeselector';
import type { SlickCellSelectionModel } from './plugins/slick.cellselectionmodel';
import type { SlickRowSelectionModel } from './plugins/slick.rowselectionmodel';
import type { SlickGroupItemMetadataProvider } from './slick.groupitemmetadataprovider';
import type { Draggable, MouseWheel, Resizable } from './slick.interactions';
import type { Aggregators } from './slick.dataview';
import type { Editors } from './slick.editors';
import type { Formatters } from './slick.formatters';
import type { SlickGrid } from './slick.grid';

declare global {
  var IIFE_ONLY: boolean;
  var flatpickr: any;
  var moment: any;
  var Sortable: typeof Sortable;
  var Slick: {
    AutoTooltips: typeof SlickAutoTooltips,
    BindingEventService: typeof BindingEventService,
    CellCopyManager: typeof SlickCellCopyManager,
    CellExternalCopyManager: typeof SlickCellExternalCopyManager,
    CellRangeDecorator: typeof SlickCellRangeDecorator,
    CellRangeSelector: typeof SlickCellRangeSelector,
    CellSelectionModel: typeof SlickCellSelectionModel,
    Draggable: typeof Draggable,
    ColAutosizeMode: typeof ColAutosizeMode,
    Controls: {
      ColumnPicker: typeof SlickColumnPicker | typeof SlickColumnMenu,
      GridMenu: typeof SlickGridMenu,
      Pager: typeof SlickGridPager
    },
    Data: {
      Aggregators: typeof Aggregators,
      DataView: typeof SlickDataView,
      GroupItemMetadataProvider: typeof SlickGroupItemMetadataProvider
    },
    Editors: typeof Editors,
    Event: typeof SlickEvent,
    EventData: typeof SlickEventData,
    EventHandler: typeof SlickEventHandler,
    Formatters: typeof Formatters,
    GlobalEditorLock: typeof GlobalEditorLock,
    Grid: typeof SlickGrid,
    GridAutosizeColsMode: typeof GridAutosizeColsMode,
    Group: typeof SlickGroup,
    GroupTotals: typeof SlickGroupTotals,
    keyCode: typeof keyCode,
    MouseWheel: typeof MouseWheel,
    Plugins: {
      CellMenu: typeof SlickCellMenu,
      ContextMenu: typeof SlickContextMenu,
      HeaderButtons: typeof SlickHeaderButtons,
      HeaderMenu: typeof SlickHeaderMenu
    },
    preClickClassName: typeof preClickClassName,
    Range: typeof SlickRange,
    Resizable: typeof Resizable,
    RowSelectionMode: typeof RowSelectionMode,
    RowSelectionModel: typeof SlickRowSelectionModel,
    Utils: typeof Utils,
    ValueFilterMode: typeof ValueFilterMode,
    WidthEvalMode: typeof WidthEvalMode,
  };
}

export { };
