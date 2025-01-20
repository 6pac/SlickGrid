import type { EditorArguments } from './editorArguments.interface.js';
import type { EditorValidationResult } from './editorValidationResult.interface.js';
import type { Column } from './column.interface.js';
import type { GridOption } from './gridOption.interface.js';
export type EditorValidator = <TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>>(value: any, args?: EditorArguments<TData, C, O>) => EditorValidationResult;
//# sourceMappingURL=editorValidator.interface.d.ts.map