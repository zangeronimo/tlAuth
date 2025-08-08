import { CompanyModules } from './'

export class CompanySystems {
  get modules() {
    return this._modules
  }

  constructor(
    public systemId: string,
    private _modules: CompanyModules[] = [],
  ) {}

  addCompanyModules(moduleId: string) {
    if (this._modules.some(data => data.moduleId === moduleId)) {
      throw new Error(
        `Module "${moduleId}" already assigned to this company system.`,
      )
    }
    this._modules.push(new CompanyModules(moduleId))
  }
}

