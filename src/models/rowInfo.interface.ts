export interface RowInfo {
  colIndex: number;
  length: number;
  maxLen: number;
  rowCount: number;
  startIndex: number;
  endIndex: number;
  valueArr: any[] | null;
  rowIndexArr?: number[];
  getRowVal: (i: any) => any;
}