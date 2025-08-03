import { Module, System } from '@domain/entity'
import { ActiveEnum } from '@domain/enum/active.enum'
import { ISystemRepository } from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { injectable } from 'tsyringe'

@injectable()
export class SystemInMemoryRepository implements ISystemRepository {
  systems: System[] = []
  modules: Module[] = []
  constructor() {
    this.clear()
  }
  async createAsync(
    system: System,
    modules?: { name: string; description: string; active: ActiveEnum }[],
  ): Promise<System> {
    this.systems.push(system)
    modules && this.createModuleAsync(modules, system.id)
    this.modules
      .filter(module => !module.deletedAt && module.systemId === system.id)
      .forEach(module => system.addModule(module))
    return system
  }
  async updateAsync(
    updated: System,
    modules?: {
      id?: string
      name: string
      description: string
      active: ActiveEnum
    }[],
  ): Promise<System> {
    const toUpdate = System.restore(
      updated.id,
      updated.name,
      updated.slug.value!,
      updated.description,
      +updated.active,
      updated.createdAt.toString(),
      updated.updatedAt.toString(),
      updated.deletedAt?.toString(),
      [],
    )
    modules && this.createModuleAsync(modules, toUpdate.id)
    this.modules
      .filter(module => !module.deletedAt && module.systemId === toUpdate.id)
      .forEach(module => {
        toUpdate.addModule(module)
      })
    const systems = this.systems.map(system => {
      if (system.id === toUpdate.id) return toUpdate
      return system
    })
    this.systems = systems
    return toUpdate
  }
  async getAllAsync(): Promise<System[]> {
    return this.systems.filter(system => system.deletedAt === undefined)
  }
  async getByIdAsync(id: string): Promise<System | undefined> {
    const system = this.systems.find(
      system => system.id === id && system.deletedAt === undefined,
    )
    return system
  }
  async getBySlugAsync(slug: Slug): Promise<System | undefined> {
    const system = this.systems.find(
      system =>
        system.slug.value === slug.value && system.deletedAt === undefined,
    )
    return system
  }
  async deleteAsync(deleteSystem: System): Promise<System> {
    const systems = this.systems.map(system => {
      if (system.id === deleteSystem.id) return deleteSystem
      return system
    })
    this.systems = systems
    return deleteSystem
  }
  clear() {
    this.systems = []
    this.modules = []
  }
  seed(systems: System[]) {
    this.systems = systems
  }
  private createModuleAsync(
    modules: {
      id?: string
      name: string
      description: string
      active: ActiveEnum
    }[],
    systemId: string,
  ) {
    this.clearDeletedModules(modules, systemId)
    for (const module of modules ?? []) {
      if (module.id) {
        const moduleToUpdate = this.modules.find(
          register => !register.deletedAt && register.id === module.id,
        )
        moduleToUpdate?.update(module.name, module.description, module.active)
        if (!moduleToUpdate) return
        const setOfModule = new Set([moduleToUpdate, ...this.modules])
        this.modules = [...setOfModule]
      } else {
        const createdModule = Module.create(
          module.name,
          module.description,
          module.active,
          systemId,
        )
        this.modules.push(createdModule)
      }
    }
  }

  private clearDeletedModules(
    modules: {
      id?: string
      name: string
      description: string
      active: ActiveEnum
    }[],
    systemId: string,
  ) {
    const allModuleWithId = modules.filter(module => module.id)
    const filteredModules = this.modules
      .filter(module => !module.deletedAt && module.systemId === systemId)
      .map(register => {
        if (allModuleWithId.some(module => module.id === register.id) === false)
          register.delete()
        return register
      })
    const setOfModule = new Set([...filteredModules, ...this.modules])
    this.modules = [...setOfModule]
  }
}

