import { Router } from 'express'
import { HealthRouters } from './health'
import { CompanyRouters } from './company'
import { UserRouters } from './user'
import { SystemRouters } from './system'

export class MainController {
  router = Router()
  companyRouters = new CompanyRouters()
  systemRouters = new SystemRouters()
  userRouters = new UserRouters()
  healthRouters = new HealthRouters()

  constructor() {
    this.companyRouters.init(this.router)
    this.systemRouters.init(this.router)
    this.userRouters.init(this.router)
    this.healthRouters.init(this.router)
  }
}

