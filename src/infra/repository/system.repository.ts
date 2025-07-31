import { System } from '@domain/entity'
import { ISystemRepository } from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { type DbContext } from '@infra/context'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SystemRepository implements ISystemRepository {
  constructor(
    @inject('DbContext')
    readonly db: DbContext,
  ) {}

  async createAsync(system: System): Promise<System> {
    await this.db.queryAsync(
      'insert into systems (id, name, slug, is_active, created_at, updated_at) values ($1, $2, $3, $4, $5, $6)',
      [
        system.id,
        system.name,
        system.slug.value,
        system.isActive,
        system.createdAt,
        system.updatedAt,
      ],
    )
    return system
  }

  async updateAsync(system: System): Promise<System> {
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
    )
    return system
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
    result.forEach(data => {
      const system = System.restore(
        data.id,
        data.name,
        data.slug,
        data.description,
        data.is_active,
        data.created_at,
        data.updated_at,
        data.deleted_at,
        [],
      )
      systems.push(system)
    })
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
          [],
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
          [],
        )
      : undefined
    return system
  }
}

