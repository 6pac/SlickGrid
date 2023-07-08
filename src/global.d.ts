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
import { Sortable } from 'sortablejs';

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
      DataView: any,
      GroupItemMetadataProvider: typeof SlickGroupItemMetadataProvider
    },
    Event: typeof SlickEvent,
    EventData: typeof SlickEventData,
    GlobalEditorLock: typeof GlobalEditorLock,
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
