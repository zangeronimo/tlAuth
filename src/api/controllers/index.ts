import { Router } from 'express'
import { HealthRouters } from './health'
import { CompanyRouters } from './company'

export class MainController {
  router = Router()
  companyRouters = new CompanyRouters()
  healthRouters = new HealthRouters()

  constructor() {
    this.companyRouters.init(this.router)
    this.healthRouters.init(this.router)
  }
}

