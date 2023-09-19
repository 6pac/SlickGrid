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
import type { SlickDataView } from './slick.dataview';
import type { SlickGrid } from './slick.grid';
import type { SlickCompositeEditor } from './slick.compositeeditor';
import type { SlickColumnMenu } from './controls/slick.columnmenu';
import type { SlickColumnPicker } from './controls/slick.columnpicker';
import type { SlickGridMenu } from './controls/slick.gridmenu';
import type { SlickGridPager } from './controls/slick.pager';
import type { SlickAutoTooltips } from './plugins/slick.autotooltips';
import type { SlickCellCopyManager } from './plugins/slick.cellcopymanager';
import type { SlickCellMenu } from './plugins/slick.cellmenu';
import type { SlickCheckboxSelectColumn } from './plugins/slick.checkboxselectcolumn';
import type { SlickContextMenu } from './plugins/slick.contextmenu';
import type { SlickHeaderButtons } from './plugins/slick.headerbuttons';
import type { SlickHeaderMenu } from './plugins/slick.headermenu';
import type { SlickCellExternalCopyManager } from './plugins/slick.cellexternalcopymanager';
import type { SlickCellRangeDecorator } from './plugins/slick.cellrangedecorator';
import type { SlickCellRangeSelector } from './plugins/slick.cellrangeselector';
import type { SlickCellSelectionModel } from './plugins/slick.cellselectionmodel';
import type { SlickCrossGridRowMoveManager } from './plugins/slick.crossgridrowmovemanager';
import type { SlickDraggableGrouping } from './plugins/slick.draggablegrouping';
import type { SlickRowSelectionModel } from './plugins/slick.rowselectionmodel';
import type { SlickResizer } from './plugins/slick.resizer';
import type { SlickRowMoveManager } from './plugins/slick.rowmovemanager';
import type { SlickRowDetailView } from './plugins/slick.rowdetailview';
import type { SlickState } from './plugins/slick.state';
import type { SlickGroupItemMetadataProvider } from './slick.groupitemmetadataprovider';
import type { SlickRemoteModel } from './slick.remotemodel';
import type { SlickRemoteModelYahoo } from './slick.remotemodel-yahoo';
import type { Draggable, MouseWheel, Resizable } from './slick.interactions';
import type { Aggregators } from './slick.dataview';
import type { Editors } from './slick.editors';
import type { Formatters } from './slick.formatters';

declare global {
  // jQuery might still be loaded for SlickRemote plugin
  var $: any;
  var jQuery: any;

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
    CheckboxSelectColumn: typeof SlickCheckboxSelectColumn,
    Draggable: typeof Draggable,
    ColAutosizeMode: typeof ColAutosizeMode,
    CompositeEditor: typeof SlickCompositeEditor,
    Controls: {
      ColumnPicker: typeof SlickColumnPicker | typeof SlickColumnMenu,
      GridMenu: typeof SlickGridMenu,
      Pager: typeof SlickGridPager
    },
    CrossGridRowMoveManager: SlickCrossGridRowMoveManager,
    Data: {
      Aggregators: typeof Aggregators,
      DataView: typeof SlickDataView,
      GroupItemMetadataProvider: typeof SlickGroupItemMetadataProvider,
      RemoteModel: typeof SlickRemoteModel
      RemoteModelYahoo: typeof SlickRemoteModelYahoo;
    },
    DraggableGrouping: typeof SlickDraggableGrouping,
    Editors: typeof Editors,
    Event: typeof SlickEvent,
    EventData: typeof SlickEventData,
    EventHandler: typeof SlickEventHandler,
    Formatters: typeof Formatters,
    GlobalEditorLock: typeof SlickGlobalEditorLock,
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
      HeaderMenu: typeof SlickHeaderMenu,
      Resizer: typeof SlickResizer,
      RowDetailView: typeof SlickRowDetailView
    },
    preClickClassName: typeof preClickClassName,
    Range: typeof SlickRange,
    Resizable: typeof Resizable,
    RowMoveManager: typeof SlickRowMoveManager,
    RowSelectionMode: typeof RowSelectionMode,
    RowSelectionModel: typeof SlickRowSelectionModel,
    State: typeof SlickState,
    Utils: typeof Utils,
    ValueFilterMode: typeof ValueFilterMode,
    WidthEvalMode: typeof WidthEvalMode,
  };
}

export { };
