export interface RowInfo {
  colIndex: number;
  length: number;
  maxLen: number;
  rowCount: number;
  startIndex: number;
  endIndex: number;
  valueArr: any[] | null;
  getRowVal: (i: any) => any;
}