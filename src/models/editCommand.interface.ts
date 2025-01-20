import type { Editor } from './editor.interface.js';

export interface EditCommand {
  /** The row of the cell being edited */
  row: number;

  /** The column of the cell being edited */
  cell: number;

  /** a reference to the cell editor */
  editor: Editor | any;

  /** The result of calling editor.serializeValue() right before destroying the editor */
  serializedValue: any;

  /** The result of calling editor.serializeValue() before the changes have been made by the user */
  prevSerializedValue: any;

  /** Call to commit changes */
  execute: () => void;

  /** Call to undo (rollback) changes */
  undo: () => void;
}
