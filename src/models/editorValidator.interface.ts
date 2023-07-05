import { EditorArguments } from "./editorArguments.interface";
import { EditorValidationResult } from "./editorValidationResult.interface";

export type EditorValidator = (value: any, args?: EditorArguments) => EditorValidationResult;
