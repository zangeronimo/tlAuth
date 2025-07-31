import { Module } from '@domain/entity'

export class ModuleDto {
  static from(module: Module) {
    return {
      id: module.id,
      name: module.name,
      slug: module.slug.value,
      description: module.description,
      active: module.isActive,
      createdAt: module.createdAt.toISOString(),
      updatedAt: module.updatedAt.toISOString(),
    }
  }
}

