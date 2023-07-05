import { SlickAutoTooltip } from './plugins/slick.autotooltips';
import { SlickCellCopyManager } from './plugins/slick.cellcopymanager';
import { SlickGroupItemMetadataProvider } from './slick.groupitemmetadataprovider';
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

declare global {
  var IIFE_ONLY: boolean;
  var flatpickr: any;
  var Slick: {
    AutoTooltips: typeof SlickAutoTooltips,
    CellCopyManager: typeof SlickCellCopyManager,
    keyCode: { [key: string]: number; },
    BindingEventService: typeof BindingEventService,
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
    preClickClassName: typeof preClickClassName,
    Range: typeof SlickRange,
    RowSelectionMode: typeof RowSelectionMode,
    ValueFilterMode: typeof ValueFilterMode,
    Utils: typeof Utils,
    WidthEvalMode: typeof WidthEvalMode,
  };
}

export { };
