import { CompanyModules, Module } from '@domain/entity'

export class CompanyModulesDto {
  static from(module: Module, companyModules: CompanyModules[]) {
    return {
      id: module.id,
      name: module.name,
      slug: module.slug.value,
      description: module.description,
      active: module.isActive,
      checked: companyModules.some(data => data.moduleId === module.id),
    }
  }
}

