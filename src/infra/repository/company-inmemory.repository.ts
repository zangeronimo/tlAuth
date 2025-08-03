import { Company, System } from '@domain/entity'
import {
  ICompanyRepository,
  type ISystemRepository,
} from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { injectable } from 'tsyringe'

@injectable()
export class CompanyInMemoryRepository implements ICompanyRepository {
  companies: Company[] = []
  constructor(readonly systemRepo: ISystemRepository) {
    this.clear()
  }
  async createAsync(company: Company, systems: []): Promise<Company> {
    const allSystems = await this.systemRepo.getAllAsync()
    const companySystems: { system: System; checked: boolean }[] = []
    for (const system of allSystems) {
      const companySystem = {
        system,
        checked: systems?.some(systemId => systemId === system.id),
      }
      companySystems.push(companySystem)
    }
    company.update(company.name, company.isActive, companySystems)
    this.companies.push(company)
    return company
  }
  async updateAsync(updated: Company, systems: []): Promise<Company> {
    const allSystems = await this.systemRepo.getAllAsync()
    const companySystems: { system: System; checked: boolean }[] = []
    for (const system of allSystems) {
      const companySystem = {
        system,
        checked: systems?.some(systemId => systemId === system.id),
      }
      companySystems.push(companySystem)
    }
    updated.update(updated.name, updated.isActive, companySystems)
    const companies = this.companies.map(company => {
      if (company.id === updated.id) return updated
      return company
    })
    this.companies = companies
    return updated
  }
  async getAllAsync(): Promise<Company[]> {
    const activatedCompanies = this.companies.filter(
      company => company.deletedAt === undefined,
    )
    const companies = []
    for (const company of activatedCompanies) {
      const allSystems = await this.systemRepo.getAllAsync()
      const companySystems: { system: System; checked: boolean }[] = []
      for (const system of allSystems) {
        const companySystem = {
          system,
          checked: company.systems?.some(
            companySystem => companySystem.system.id === system.id,
          ),
        }
        companySystems.push(companySystem)
      }
      company.update(company.name, company.isActive, companySystems)
      companies.push(company)
    }
    return companies
  }
  async getByIdAsync(id: string): Promise<Company | undefined> {
    const company = this.companies.find(
      company => company.id === id && company.deletedAt === undefined,
    )
    return company
  }
  async getBySlugAsync(slug: Slug): Promise<Company | undefined> {
    const company = this.companies.find(
      company =>
        company.slug.value === slug.value && company.deletedAt === undefined,
    )
    return company
  }
  async deleteAsync(deleteCompany: Company): Promise<Company> {
    const companies = this.companies.map(company => {
      if (company.id === deleteCompany.id) return deleteCompany
      return company
    })
    this.companies = companies
    return deleteCompany
  }
  clear() {
    this.companies = []
  }
  seed(companies: Company[]) {
    this.companies = companies
  }
}

