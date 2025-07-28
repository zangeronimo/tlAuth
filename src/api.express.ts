import { MainController } from '@api/controllers'
import express from 'express'

export class API {
  static init() {
    const app = express()
    app.use(express.json({ limit: '50mb' }))

    const mainController = new MainController()
    app.use(mainController.router)

    return app
  }
}

