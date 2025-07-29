import { Company, User } from '@domain/entity'
import {
  type ICompanyRepository,
  IUserRepository,
} from '@domain/interface/repository'
import { Email } from '@domain/valueObjects'
import { type DbContext } from '@infra/context'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject('DbContext')
    readonly db: DbContext,
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
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
    for (const data of result) {
      const companies = await this.getAllCompaniesByUserIdAsync(data.id)
      const user = User.restore(
        data.id,
        data.name,
        data.email,
        data.is_active,
        companies,
        data.created_at,
        data.updated_at,
        data.deleted_at,
      )
      users.push(user)
    }
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
    for (const company of user.companies) {
      await this.createCompanyUserAsync(company.id, user.id)
    }
    return user
  }

  async updateAsync(user: User): Promise<User> {
    await this.db.queryAsync(
      'update users set name=$2, email=$3, is_active=$4, updated_at=$5 where id=$1 and deleted_at is null',
      [user.id, user.name, user.email.value, user.isActive, user.updatedAt],
    )
    await this.deleteCompanyUserAsync(user.id)
    for (const company of user.companies) {
      await this.createCompanyUserAsync(company.id, user.id)
    }
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
    const companies = data
      ? await this.getAllCompaniesByUserIdAsync(data.id)
      : []
    const user = data
      ? User.restore(
          data.id,
          data.name,
          data.email,
          data.is_active,
          companies,
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
    const companies = data
      ? await this.getAllCompaniesByUserIdAsync(data.id)
      : []
    const user = data
      ? User.restore(
          data.id,
          data.name,
          data.email,
          data.is_active,
          companies,
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

  private async getAllCompaniesByUserIdAsync(
    userId: string,
  ): Promise<Company[]> {
    const where = 'cu.user_id = $1'
    const result: any[] = await this.db.queryAsync(
      `select
          c.id,
          c.name,
          c.slug,
          c.is_active,
          c.created_at,
          c.updated_at
        from
          company_user cu
        inner join
          companies c on c.id = cu.company_id and c.deleted_at is null
        where ${where}
        `,
      [userId],
    )
    const companies: Company[] = []
    for (const data of result) {
      const company = Company.restore(
        data.id,
        data.name,
        data.slug,
        data.is_active,
        data.created_at,
        data.updated_at,
        data.deleted_at,
      )
      companies.push(company)
    }
    return companies
  }

  private async createCompanyUserAsync(
    companyId: string,
    userId: string,
  ): Promise<void> {
    await this.db.queryAsync(
      'insert into company_user (company_id, user_id) values ($1, $2)',
      [companyId, userId],
    )
  }

  private async deleteCompanyUserAsync(userId: string): Promise<void> {
    await this.db.queryAsync('delete from company_user where user_id=$1', [
      userId,
    ])
  }
}

