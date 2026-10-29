import type { ColAutosizeMode, GridAutosizeColsMode, RowSelectionMode, ValueFilterMode, WidthEvalMode } from '../slick.core.js';
import type { Formatter } from './formatter.interface.js';

export type GridAutosizeColsModeValue = (typeof GridAutosizeColsMode)[keyof typeof GridAutosizeColsMode];
export type ColAutosizeModeValue = (typeof ColAutosizeMode)[keyof typeof ColAutosizeMode];
export type RowSelectionModeValue = (typeof RowSelectionMode)[keyof typeof RowSelectionMode];
export type ValueFilterModeValue = (typeof ValueFilterMode)[keyof typeof ValueFilterMode];
export type WidthEvalModeValue = (typeof WidthEvalMode)[keyof typeof WidthEvalMode];

export interface AutoSize {
  allowAddlPercent?: number;
  autosizeMode?: ColAutosizeModeValue;
  colDataTypeOf?: any;
  colValueArray?: any[];
  contentSizePx?: number;
  formatterOverride?: Formatter;
  headerWidthPx?: number;
  ignoreHeaderText?: boolean;
  rowSelectionModeOnInit?: RowSelectionModeValue;
  rowSelectionMode?: RowSelectionModeValue;
  rowSelectionCount?: number;
  sizeToRemaining?: boolean | undefined;
  valueFilterMode?: ValueFilterModeValue;
  widthEvalMode?: WidthEvalModeValue;
  widthPx?: number;
}