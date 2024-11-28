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
} from './slick.core.js';
import type { SlickDataView } from './slick.dataview.js';
import type { SlickGrid } from './slick.grid.js';
import type { SlickCompositeEditor } from './slick.compositeeditor.js';
import type { SlickColumnMenu } from './controls/slick.columnmenu.js';
import type { SlickColumnPicker } from './controls/slick.columnpicker.js';
import type { SlickGridMenu } from './controls/slick.gridmenu.js';
import type { SlickGridPager } from './controls/slick.pager.js';
import type { SlickAutoTooltips } from './plugins/slick.autotooltips.js';
import type { SlickCellCopyManager } from './plugins/slick.cellcopymanager.js';
import type { SlickCellMenu } from './plugins/slick.cellmenu.js';
import type { SlickCheckboxSelectColumn } from './plugins/slick.checkboxselectcolumn.js';
import type { SlickContextMenu } from './plugins/slick.contextmenu.js';
import type { SlickHeaderButtons } from './plugins/slick.headerbuttons.js';
import type { SlickHeaderMenu } from './plugins/slick.headermenu.js';
import type { SlickCellExternalCopyManager } from './plugins/slick.cellexternalcopymanager.js';
import type { SlickCellRangeDecorator } from './plugins/slick.cellrangedecorator.js';
import type { SlickCellRangeSelector } from './plugins/slick.cellrangeselector.js';
import type { SlickCellSelectionModel } from './plugins/slick.cellselectionmodel.js';
import type { SlickCrossGridRowMoveManager } from './plugins/slick.crossgridrowmovemanager.js';
import type { SlickDraggableGrouping } from './plugins/slick.draggablegrouping.js';
import type { SlickRowSelectionModel } from './plugins/slick.rowselectionmodel.js';
import type { SlickResizer } from './plugins/slick.resizer.js';
import type { SlickRowMoveManager } from './plugins/slick.rowmovemanager.js';
import type { SlickRowDetailView } from './plugins/slick.rowdetailview.js';
import type { SlickState } from './plugins/slick.state.js';
import type { SlickGroupItemMetadataProvider } from './slick.groupitemmetadataprovider.js';
import type { SlickRemoteModel } from './slick.remotemodel.js';
import type { SlickRemoteModelYahoo } from './slick.remotemodel-yahoo.js';
import type { Draggable, MouseWheel, Resizable } from './slick.interactions.js';
import type { Aggregators } from './slick.dataview.js';
import type { Editors } from './slick.editors.js';
import type { Formatters } from './slick.formatters.js';

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
