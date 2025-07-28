import { DbContext } from '@infra/context'
import { Request, Response, Router } from 'express'
import { container } from 'tsyringe'

export class HealthRouters {
  init = (router: Router) => {
    router.get('/health', this.healthAsync)
  }

  private healthAsync = async (req: Request, res: Response) => {
    try {
      const db = container.resolve<DbContext>('DbContext')
      await db.queryAsync('SELECT 1', [])

      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        db: 'connected',
      })
    } catch (error: any) {
      console.error('Health check failed:', error)

      res.status(503).json({
        status: 'error',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        db: 'disconnected',
        error: error.message,
      })
    }
  }
}

