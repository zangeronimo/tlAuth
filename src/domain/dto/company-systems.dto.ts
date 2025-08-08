import { CompanySystems, System } from '@domain/entity'
import { CompanyModulesDto } from './company-modules.dto'

export class CompanySystemsDto {
  static from(system: System, companySystems: CompanySystems[]) {
    return {
      id: system.id,
      name: system.name,
      slug: system.slug.value,
      description: system.description,
      active: system.isActive,
      modules: system.modules
        ? system.modules.map(module =>
            CompanyModulesDto.from(
              module,
              companySystems.find(cs => cs.systemId === system.id)?.modules ??
                [],
            ),
          )
        : [],
      checked: companySystems.some(data => data.systemId === system.id),
    }
  }
}

