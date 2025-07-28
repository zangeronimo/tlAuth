import { Company } from '@domain/entity/company'
import { ICompanyRepository } from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { type DbContext } from '@infra/context'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @inject('DbContext')
    readonly db: DbContext,
  ) {}

  async createAsync(company: Company): Promise<Company> {
    await this.db.queryAsync(
      'insert into companies (id, name, slug, is_active, created_at, updated_at) values ($1, $2, $3, $4, $5, $6)',
      [
        company.id,
        company.name,
        company.slug.value,
        company.isActive,
        company.createdAt,
        company.updatedAt,
      ],
    )
    return company
  }

  async updateAsync(company: Company): Promise<Company> {
    await this.db.queryAsync(
      'update companies set name=$2, slug=$3, is_active=$4, updated_at=$5 where id=$1 and deleted_at is null',
      [
        company.id,
        company.name,
        company.slug.value,
        company.isActive,
        company.updatedAt,
      ],
    )
    return company
  }

  async deleteAsync(company: Company): Promise<Company> {
    await this.db.queryAsync('update companies set deleted_at=$2 where id=$1', [
      company.id,
      company.deletedAt,
    ])
    return company
  }

  async getAllAsync(): Promise<Company[]> {
    const where = 'deleted_at is null'
    const result: any[] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at,
        deleted_at
      from
        companies
      where ${where}
      `,
      [],
    )
    const companies: Company[] = []
    result.forEach(data => {
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
    })
    return companies
  }

  async getBySlugAsync(slug: Slug): Promise<Company | undefined> {
    const where = `slug = $1 and deleted_at is null`
    const [data] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at,
        deleted_at
      from
        companies
      where ${where}
      `,
      [slug.value],
    )
    const company = data
      ? Company.restore(
          data.id,
          data.name,
          data.slug,
          data.is_active,
          data.created_at,
          data.updated_at,
          data.deleted_at,
        )
      : undefined
    return company
  }

  async getByIdAsync(id: string): Promise<Company | undefined> {
    const where = `id = $1 and deleted_at is null`
    const [data] = await this.db.queryAsync(
      `select
        id,
        name,
        slug,
        is_active,
        created_at,
        updated_at,
        deleted_at
      from
        companies
      where ${where}
      `,
      [id],
    )
    const company = data
      ? Company.restore(
          data.id,
          data.name,
          data.slug,
          data.is_active,
          data.created_at,
          data.updated_at,
          data.deleted_at,
        )
      : undefined
    return company
  }
}

