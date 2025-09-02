import { Company, Credential, User } from '@domain/entity'
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
      const credentials = await this.getAllCredentialsByUserIdAsync(data.id)
      const user = User.restore(
        data.id,
        data.name,
        data.email,
        data.is_active,
        companies,
        credentials,
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
    for (const credential of user.credentials) {
      await this.createCredentialUserAsync(
        user.id,
        credential.systemId,
        credential.password.value,
        credential.password.salt,
        credential.isActive,
      )
    }
    return (await this.getByIdAsync(user.id))!
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
    for (const credential of user.credentials) {
      if (credential.id)
        await this.updateCredentialUserAsync(
          credential.id,
          credential.password.value,
          credential.password.salt,
          credential.isActive,
          credential.updatedAt,
          credential.deletedAt,
        )
      else
        await this.createCredentialUserAsync(
          user.id,
          credential.systemId,
          credential.password.value,
          credential.password.salt,
          credential.isActive,
        )
    }
    return (await this.getByIdAsync(user.id))!
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
    const credentials = data
      ? await this.getAllCredentialsByUserIdAsync(data.id)
      : []
    const user = data
      ? User.restore(
          data.id,
          data.name,
          data.email,
          data.is_active,
          companies,
          credentials,
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
    const credentials = data
      ? await this.getAllCredentialsByUserIdAsync(data.id)
      : []
    const user = data
      ? User.restore(
          data.id,
          data.name,
          data.email,
          data.is_active,
          companies,
          credentials,
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
        [],
        data.created_at,
        data.updated_at,
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

  private async getAllCredentialsByUserIdAsync(
    userId: string,
  ): Promise<Credential[]> {
    const where = 'c.user_id = $1 and c.deleted_at is null'
    const result: any[] = await this.db.queryAsync(
      `select
          c.id,
          c.system_id,
          c.user_id,
          c.password_hash,
          c.password_salt,
          c.is_active,
          c.last_login_at,
          c.created_at,
          c.updated_at
        from
          user_credentials c
        where ${where}
        `,
      [userId],
    )
    const credentials: Credential[] = []
    for (const data of result) {
      const credential = Credential.restore(
        data.id,
        data.system_id,
        data.password_hash,
        data.password_salt,
        data.is_active,
        data.created_at,
        data.updated_at,
        data.last_login_at,
      )
      credentials.push(credential)
    }
    return credentials
  }

  private async createCredentialUserAsync(
    userId: string,
    systemId: string,
    password: string,
    salt: string,
    active: number,
  ): Promise<void> {
    await this.db.queryAsync(
      'insert into user_credentials (user_id, system_id, password_hash, password_salt, is_active) values ($1, $2, $3, $4, $5)',
      [userId, systemId, password, salt, active],
    )
  }

  private async updateCredentialUserAsync(
    id: string,
    password: string,
    salt: string,
    active: number,
    updatedAt: Date,
    deletedAt?: Date,
  ): Promise<void> {
    await this.db.queryAsync(
      'update user_credentials set password_hash=$2, password_salt=$3, is_active=$4, updated_at=$5, deleted_at=$6 where id=$1',
      [id, password, salt, active, updatedAt, deletedAt],
    )
  }

  private async deleteCompanyUserAsync(userId: string): Promise<void> {
    await this.db.queryAsync('delete from company_user where user_id=$1', [
      userId,
    ])
  }
}

