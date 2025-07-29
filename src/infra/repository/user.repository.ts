import { User } from '@domain/entity'
import { IUserRepository } from '@domain/interface/repository'
import { Email } from '@domain/valueObjects'
import { type DbContext } from '@infra/context'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject('DbContext')
    readonly db: DbContext,
  ) {}

  async getAllAsync(): Promise<User[]> {
    const where = 'deleted_at is null'
    const result: any[] = await this.db.queryAsync(
      `select
          id,
          name,
          email,
          is_active,
          created_at,
          updated_at,
          deleted_at
        from
          users
        where ${where}
        `,
      [],
    )
    const users: User[] = []
    result.forEach(data => {
      const user = User.restore(
        data.id,
        data.name,
        data.email,
        data.is_active,
        ['123'],
        data.created_at,
        data.updated_at,
        data.deleted_at,
      )
      users.push(user)
    })
    return users
  }

  async createAsync(user: User): Promise<User> {
    await this.db.queryAsync(
      'insert into users (id, name, email, is_active, created_at, updated_at) values ($1, $2, $3, $4, $5, $6)',
      [
        user.id,
        user.name,
        user.email.value,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      ],
    )
    return user
  }

  async updateAsync(user: User): Promise<User> {
    await this.db.queryAsync(
      'update users set name=$2, email=$3, is_active=$4, updated_at=$5 where id=$1 and deleted_at is null',
      [user.id, user.name, user.email.value, user.isActive, user.updatedAt],
    )
    return user
  }

  async getByEmailAsync(email: Email): Promise<User | undefined> {
    const where = `email = $1 and deleted_at is null`
    const [data] = await this.db.queryAsync(
      `select
          id,
          name,
          email,
          is_active,
          created_at,
          updated_at,
          deleted_at
        from
          users
        where ${where}
        `,
      [email.value],
    )
    const user = data
      ? User.restore(
          data.id,
          data.name,
          data.email,
          data.is_active,
          ['123'],
          data.created_at,
          data.updated_at,
          data.deleted_at,
        )
      : undefined
    return user
  }

  async getByIdAsync(id: string): Promise<User | undefined> {
    const where = `id = $1 and deleted_at is null`
    const [data] = await this.db.queryAsync(
      `select
          id,
          name,
          email,
          is_active,
          created_at,
          updated_at,
          deleted_at
        from
          users
        where ${where}
        `,
      [id],
    )
    const user = data
      ? User.restore(
          data.id,
          data.name,
          data.email,
          data.is_active,
          ['123'],
          data.created_at,
          data.updated_at,
          data.deleted_at,
        )
      : undefined
    return user
  }

  async deleteAsync(user: User): Promise<User> {
    await this.db.queryAsync(
      'update users set deleted_at=$2 where id=$1 and deleted_at is null',
      [user.id, user.deletedAt],
    )
    return user
  }
}

