import 'reflect-metadata'
import express from 'express'
import dotenv from 'dotenv'
import { ExtensionDI } from '@infra/extensions'
import { container } from 'tsyringe'
import { DbContext } from '@infra/context'
import { MainController } from '@api/controllers/MainController'
import { LoggerProvider } from '@domain/interface/provider/LoggerProvider'

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({ path: envFile })

ExtensionDI.init()

const app = express()
app.use(express.json({ limit: '50mb' }))

const mainController = new MainController()
app.use(mainController.router)

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

