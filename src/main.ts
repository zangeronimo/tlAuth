import 'reflect-metadata'
import dotenv from 'dotenv'
import { ExtensionDI } from '@infra/extensions'
import { container } from 'tsyringe'
import { DbContext } from '@infra/context'
import { LoggerProvider } from '@domain/interface/provider'
import { Extensions } from '@application/extension'
import { API } from 'api.express'

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({ path: envFile })

Extensions.init()
ExtensionDI.init()

const app = API.init()

const dbContext = container.resolve<DbContext>('DbContext')
process.on('SIGINT', async () => {
  console.log('\nFechando conexão com banco...')
  await dbContext.closeAsync()
  process.exit(0)
})

const logger = container.resolve<LoggerProvider>('LoggerProvider')

const port = process.env.EXPRESS_PORT
app.listen(port, () => {
  logger.info('🚀 Server running...', { port, env: process.env.NODE_ENV })
})

