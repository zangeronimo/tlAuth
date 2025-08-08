import { Company, CompanyModules, CompanySystems } from '@domain/entity'
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

  async createAsync(company: Company): Promise<Company> {
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
      await this.deleteCompanyModulesAsync(companyId, tx)
      for (const companySystem of company.systems) {
        await this.addCompanySystemsAsync(companyId, companySystem.systemId, tx)
        await this.addCompanyModulesAsync(companyId, companySystem.modules, tx)
      }
      return companyId
    })
    return (await this.getByIdAsync(companyId))!
  }

  async updateAsync(company: Company): Promise<Company> {
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
      await this.deleteCompanyModulesAsync(company.id, tx)
      for (const companySystem of company.systems) {
        await this.addCompanySystemsAsync(
          company.id,
          companySystem.systemId,
          tx,
        )
        await this.addCompanyModulesAsync(company.id, companySystem.modules, tx)
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
      const companySystems = await this.getAllSystemsIdByCompanyIdAsync(data.id)
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
    const companySystems = await this.getAllSystemsIdByCompanyIdAsync(data.id)
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
    const companySystems = await this.getAllSystemsIdByCompanyIdAsync(data.id)
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

  private async addCompanyModulesAsync(
    companyId: string,
    companyModules: CompanyModules[],
    tx: any,
  ) {
    for (const companyModule of companyModules) {
      await this.db.queryAsync(
        'insert into company_modules (company_id, module_id) values ($1, $2)',
        [companyId, companyModule.moduleId],
        tx,
      )
    }
  }

  private async deleteCompanyModulesAsync(companyId: string, tx: any) {
    await this.db.queryAsync(
      'delete from company_modules where company_id=$1',
      [companyId],
      tx,
    )
  }

  private async getAllSystemsIdByCompanyIdAsync(
    companyId: string,
  ): Promise<CompanySystems[]> {
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
    const result: CompanySystems[] = []
    for (const data of dataSystems) {
      const modules = await this.getAllModulesIdByCompanyIdAsync(
        companyId,
        data.system_id,
      )
      const companySystem = new CompanySystems(data.system_id, modules)
      result.push(companySystem)
    }
    return result
  }

  private async getAllModulesIdByCompanyIdAsync(
    companyId: string,
    systemId: string,
  ): Promise<CompanyModules[]> {
    const where = `cm.company_id = $1 and m.system_id = $2`
    const dataModules = await this.db.queryAsync(
      `select
        cm.module_id,
        m.system_id
      from
        company_modules cm
        inner join modules m on m.id = cm.module_id and m.deleted_at is null
      where ${where}
      `,
      [companyId, systemId],
    )
    return dataModules.length
      ? dataModules.map((data: any) => new CompanyModules(data.module_id))
      : []
  }
}

