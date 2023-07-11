import { Sortable } from 'sortablejs';

import {
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
  SlickRange,
  RowSelectionMode,
  ValueFilterMode,
  Utils,
  WidthEvalMode,
} from './slick.core';
import { SlickAutoTooltip } from './plugins/slick.autotooltips';
import { SlickCellCopyManager } from './plugins/slick.cellcopymanager';
import { SlickGroupItemMetadataProvider } from './slick.groupitemmetadataprovider';
import { Draggable, MouseWheel, Resizable } from './slick.interactions';
import { Aggregators } from './slick.dataview';
import { Editors } from './slick.editors';
import { Formatters } from './slick.formatters';
import { SlickGrid } from './slick.grid';

declare global {
  var IIFE_ONLY: boolean;
  var flatpickr: any;
  var moment: any;
  var Sortable: typeof Sortable;
  var Slick: {
    AutoTooltips: typeof SlickAutoTooltips,
    BindingEventService: typeof BindingEventService,
    CellCopyManager: typeof SlickCellCopyManager,
    Draggable: typeof Draggable,
    ColAutosizeMode: typeof ColAutosizeMode,
    Data: {
      Aggregators: typeof Aggregators,
      DataView: SlickDataView,
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
