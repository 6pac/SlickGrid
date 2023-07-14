import type { Sortable } from 'sortablejs';

import type {
  BindingEventService,
  ColAutosizeMode,
  SlickEvent,
  SlickEventData,
  GlobalEditorLock,
  GridAutosizeColsMode,
  SlickGroup,
  SlickGroupTotals,
  keyCode,
  preClickClassName,
  RowSelectionMode,
  SlickRange,
  ValueFilterMode,
  Utils,
  WidthEvalMode,
} from './slick.core';
import type { SlickColumnPicker } from './controls/slick.columnpicker';
import type { SlickColumnMenu } from './controls/slick.columnmenu';
import type { SlickGridPager } from './controls/slick.pager';
import type { SlickGridMenu } from './controls/slick.gridmenu';
import type { SlickAutoTooltip } from './plugins/slick.autotooltips';
import type { SlickCellCopyManager } from './plugins/slick.cellcopymanager';
import type { SlickCellExternalCopyManager } from './plugins/slick.cellcopymanager';
import type { SlickGroupItemMetadataProvider } from './slick.cellexternalcopymanager';
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
    Formatters: typeof Formatters,
    GlobalEditorLock: typeof GlobalEditorLock,
    Grid: typeof SlickGrid,
    GridAutosizeColsMode: typeof GridAutosizeColsMode,
    Group: typeof SlickGroup,
    GroupTotals: typeof SlickGroupTotals,
    keyCode: typeof keyCode,
    MouseWheel: typeof MouseWheel,
    preClickClassName: typeof preClickClassName,
    Range: typeof SlickRange,
    Resizable: typeof Resizable,
    RowSelectionMode: typeof RowSelectionMode,
    Utils: typeof Utils,
    ValueFilterMode: typeof ValueFilterMode,
    WidthEvalMode: typeof WidthEvalMode,
  };
}

export { };
