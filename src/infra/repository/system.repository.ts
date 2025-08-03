import { System, Module } from '@domain/entity'
import { ISystemRepository } from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { type DbContext } from '@infra/context'
import { inject, injectable } from 'tsyringe'

type ModuleProps = {
  id?: string
  name: string
  description: string
  active: number
}
@injectable()
export class SystemRepository implements ISystemRepository {
  constructor(
    @inject('DbContext')
    readonly db: DbContext,
  ) {}

  async createAsync(system: System, modules: ModuleProps[]): Promise<System> {
    const systemId = await this.db.withTransaction(async tx => {
      const [createdSystem] = await this.db.queryAsync(
        'insert into systems (name, slug, description, is_active) values ($1, $2, $3, $4) RETURNING id',
        [system.name, system.slug.value, system.description, system.isActive],
        tx,
      )
      const systemId = createdSystem.id
      for (const module of modules)
        await this.createModuleAsync(module, systemId, tx)
      return systemId
    })
    return (await this.getByIdAsync(systemId))!
  }

  async updateAsync(system: System, modules: ModuleProps[]): Promise<System> {
    await this.db.withTransaction(async tx => {
      await this.db.queryAsync(
        'update systems set name=$2, slug=$3, description=$4, is_active=$5, updated_at=$6 where id=$1 and deleted_at is null',
        [
          system.id,
          system.name,
          system.slug.value,
          system.description,
          system.isActive,
          system.updatedAt,
        ],
        tx,
      )
      const allModules = await this.getAllModules(system.id)
      for (const modulePersisted of allModules) {
        const modulesWithId = modules.filter(module => module.id)
        if (
          modulesWithId.some(module => module.id === modulePersisted.id) ===
          false
        ) {
          modulePersisted.delete()
          await this.deleteModuleAsync(modulePersisted)
        }
      }
      for (const module of modules) {
        if (module.id) await this.updateModuleAsync(module, system.id, tx)
        else await this.createModuleAsync(module, system.id, tx)
      }
    })
    return (await this.getByIdAsync(system.id))!
  }

  async deleteAsync(system: System): Promise<System> {
    await this.db.queryAsync('update systems set deleted_at=$2 where id=$1', [
      system.id,
      system.deletedAt,
    ])
    return system
  }

  async getAllAsync(): Promise<System[]> {
    const where = 'deleted_at is null'
    const result: any[] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        deleted_at
      from
        systems
      where ${where}
      `,
      [],
    )
    const systems: System[] = []
    for (const data of result) {
      const modules = await this.getAllModules(data.id)
      const system = System.restore(
        data.id,
        data.name,
        data.slug,
        data.description,
        data.is_active,
        data.created_at,
        data.updated_at,
        data.deleted_at,
        modules,
      )
      systems.push(system)
    }
    return systems
  }

  async getBySlugAsync(slug: Slug): Promise<System | undefined> {
    const where = `slug = $1 and deleted_at is null`
    const [data] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        deleted_at
      from
        systems
      where ${where}
      `,
      [slug.value],
    )
    const modules = await this.getAllModules(data?.id)
    const system = data
      ? System.restore(
          data.id,
          data.name,
          data.slug,
          data.description,
          data.is_active,
          data.created_at,
          data.updated_at,
          data.deleted_at,
          modules,
        )
      : undefined
    return system
  }

  async getByIdAsync(id: string): Promise<System | undefined> {
    const where = `id = $1 and deleted_at is null`
    const [data] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        deleted_at
      from
        systems
      where ${where}
      `,
      [id],
    )
    const modules = await this.getAllModules(data.id)
    const system = data
      ? System.restore(
          data.id,
          data.name,
          data.slug,
          data.description,
          data.is_active,
          data.created_at,
          data.updated_at,
          data.deleted_at,
          modules,
        )
      : undefined
    return system
  }

  private async createModuleAsync(
    module: ModuleProps,
    systemId: string,
    tx?: any,
  ) {
    await this.db.queryAsync(
      'insert into modules (name, slug, description, is_active, system_id) values ($1, $2, $3, $4, $5)',
      [
        module.name,
        Slug.create(module.name).value,
        module.description,
        module.active,
        systemId,
      ],
      tx,
    )
  }

  private async updateModuleAsync(
    module: ModuleProps,
    systemId: string,
    tx?: any,
  ) {
    await this.db.queryAsync(
      'update modules set name=$2, slug=$3, description=$4, is_active=$5 where id=$1 and system_id=$6',
      [
        module.id,
        module.name,
        Slug.create(module.name).value,
        module.description,
        module.active,
        systemId,
      ],
      tx,
    )
  }

  private async getAllModules(systemId: string): Promise<Module[]> {
    const where = 'system_id=$1 and deleted_at is null'
    const result: any[] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at,
        deleted_at,
        system_id
      from
        modules
      where ${where}
      `,
      [systemId],
    )
    const modules: Module[] = []
    result.forEach(data => {
      const module = Module.restore(
        data.id,
        data.name,
        data.slug,
        data.description,
        data.is_active,
        data.system_id,
        data.created_at,
        data.updated_at,
        data.deleted_at,
      )
      modules.push(module)
    })
    return modules
  }

  private async deleteModuleAsync(module: Module): Promise<void> {
    await this.db.queryAsync('update modules set deleted_at=$2 where id=$1', [
      module.id,
      module.deletedAt,
    ])
  }
}

