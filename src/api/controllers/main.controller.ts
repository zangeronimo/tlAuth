import { Router } from "express";
import { HealthRouters } from "./health";

export class MainController {
  router = Router();
  healthRouters = new HealthRouters();

  constructor() {
    this.healthRouters.init(this.router);
  }
}
