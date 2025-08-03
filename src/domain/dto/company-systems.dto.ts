import { System } from '@domain/entity'

export class CompanySystemsDto {
  static from(system: System, checked: boolean = false) {
    return {
      id: system.id,
      name: system.name,
      slug: system.slug.value,
      description: system.description,
      active: system.isActive,
      checked,
    }
  }
}

