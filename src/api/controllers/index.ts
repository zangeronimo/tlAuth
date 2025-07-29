import { Router } from 'express'
import { HealthRouters } from './health'
import { CompanyRouters } from './company'
import { UserRouters } from './user'

export class MainController {
  router = Router()
  companyRouters = new CompanyRouters()
  userRouters = new UserRouters()
  healthRouters = new HealthRouters()

  constructor() {
    this.companyRouters.init(this.router)
    this.userRouters.init(this.router)
    this.healthRouters.init(this.router)
  }
}

