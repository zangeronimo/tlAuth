import { Company, System } from '@domain/entity'
import {
  ICompanyRepository,
  type ISystemRepository,
} from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { type DbContext } from '@infra/context'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @inject('DbContext')
    readonly db: DbContext,
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}

  async createAsync(company: Company, systems: string[]): Promise<Company> {
    const companyId = await this.db.withTransaction(async tx => {
      const [createdCompany] = await this.db.queryAsync(
        'insert into companies (name, slug, is_active, created_at, updated_at) values ($1, $2, $3, $4, $5) RETURNING id',
        [
          company.name,
          company.slug.value,
          company.isActive,
          company.createdAt,
          company.updatedAt,
        ],
        tx,
      )
      const companyId = createdCompany.id
      await this.deleteCompanySystemsAsync(companyId, tx)
      for (const systemId of systems) {
        await this.addCompanySystemsAsync(companyId, systemId, tx)
      }
      return companyId
    })
    return (await this.getByIdAsync(companyId))!
  }

  async updateAsync(company: Company, systems: string[]): Promise<Company> {
    await this.db.withTransaction(async tx => {
      await this.db.queryAsync(
        'update companies set name=$2, slug=$3, is_active=$4, updated_at=$5 where id=$1 and deleted_at is null',
        [
          company.id,
          company.name,
          company.slug.value,
          company.isActive,
          company.updatedAt,
        ],
        tx,
      )
      await this.deleteCompanySystemsAsync(company.id, tx)
      for (const systemId of systems) {
        await this.addCompanySystemsAsync(company.id, systemId, tx)
      }
    })
    return (await this.getByIdAsync(company.id))!
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
    for (const data of result) {
      const companySystems = await this.getAllCompanySystems(data.id)
      const company = Company.restore(
        data.id,
        data.name,
        data.slug,
        data.is_active,
        companySystems,
        data.created_at,
        data.updated_at,
        data.deleted_at,
      )
      companies.push(company)
    }
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
    if (!data) return undefined
    const companySystems = await this.getAllCompanySystems(data.id)
    const company = Company.restore(
      data.id,
      data.name,
      data.slug,
      data.is_active,
      companySystems,
      data.created_at,
      data.updated_at,
      data.deleted_at,
    )
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
    if (!data) return undefined
    const companySystems = await this.getAllCompanySystems(data.id)
    const company = data
      ? Company.restore(
          data.id,
          data.name,
          data.slug,
          data.is_active,
          companySystems,
          data.created_at,
          data.updated_at,
          data.deleted_at,
        )
      : undefined
    return company
  }

  private async addCompanySystemsAsync(
    companyId: string,
    systemId: string,
    tx: any,
  ) {
    await this.db.queryAsync(
      'insert into company_systems (company_id, system_id) values ($1, $2)',
      [companyId, systemId],
      tx,
    )
  }

  private async deleteCompanySystemsAsync(companyId: string, tx: any) {
    await this.db.queryAsync(
      'delete from company_systems where company_id=$1',
      [companyId],
      tx,
    )
  }

  private async getAllCompanySystems(companyId: string) {
    const result: { system: System; checked: boolean }[] = []
    const companySystemsIds =
      await this.getAllSystemsIdByCompanyIdAsync(companyId)
    const allSystems = await this.systemRepository.getAllAsync()
    for (const system of allSystems) {
      result.push({
        system,
        checked: companySystemsIds?.some(systemId => systemId === system.id),
      })
    }
    return result
  }

  private async getAllSystemsIdByCompanyIdAsync(
    companyId: any,
  ): Promise<string[]> {
    const where = `company_id = $1`
    const dataSystems = await this.db.queryAsync(
      `select
        system_id
      from
        company_systems
      where ${where}
      `,
      [companyId],
    )
    return dataSystems.length
      ? dataSystems.map((data: any) => data.system_id)
      : []
  }
}

