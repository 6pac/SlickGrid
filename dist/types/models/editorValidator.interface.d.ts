import type { EditorArguments } from './editorArguments.interface';
import type { EditorValidationResult } from './editorValidationResult.interface';
import type { Column } from './column.interface';
import type { GridOption } from './gridOption.interface';
export type EditorValidator = <TData = any, C extends Column<TData> = Column<TData>, O extends GridOption<C> = GridOption<C>>(value: any, args?: EditorArguments<TData, C, O>) => EditorValidationResult;
//# sourceMappingURL=editorValidator.interface.d.ts.map