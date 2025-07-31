import { System } from '@domain/entity'
import { ModuleDto } from './module.dto'

export class SystemDto {
  static from(system: System) {
    return {
      id: system.id,
      name: system.name,
      slug: system.slug.value,
      description: system.description,
      active: system.isActive,
      createdAt: system.createdAt.toISOString(),
      updatedAt: system.updatedAt.toISOString(),
      modules: system.modules?.map(module => ModuleDto.from(module)),
    }
  }
}

