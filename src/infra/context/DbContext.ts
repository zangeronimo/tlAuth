export interface DbContext {
  connection: any;
  transactions: { statement: string; data: any }[];
  queryAsync(statement: string, data: any, transaction?: boolean): Promise<any>;
  commitAsync(): Promise<void>;
  closeAsync(): Promise<void>;
}
