export interface DbContext {
  connection: any
  queryAsync(statement: string, data?: any, tx?: any): Promise<any>
  withTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T>
  closeAsync(): Promise<void>
}

