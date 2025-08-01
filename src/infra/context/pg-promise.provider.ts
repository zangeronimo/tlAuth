import pgPromise from 'pg-promise'
import { DbContext } from './db.context'

export class PgPromiseContext implements DbContext {
  connection: any

  constructor() {
    this.connection = pgPromise()(atob(process.env.POSTGRES_URL!))
  }

  queryAsync(statement: string, data?: any, tx?: any): Promise<any> {
    const executor = tx || this.connection
    return executor.query(statement, data)
  }

  async withTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.connection.tx(async (t: any) => {
      return await fn(t)
    })
  }

  async closeAsync(): Promise<void> {
    await this.connection.$pool.end()
  }
}

