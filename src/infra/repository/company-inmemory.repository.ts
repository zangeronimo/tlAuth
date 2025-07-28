import { Company } from '@domain/entity/company'
import { ICompanyRepository } from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { injectable } from 'tsyringe'

@injectable()
export class CompanyInMemoryRepository implements ICompanyRepository {
  companies: Company[]
  constructor() {
    this.companies = []
  }
  async createAsync(company: Company): Promise<Company> {
    this.companies.push(company)
    return company
  }
  async updateAsync(updated: Company): Promise<Company> {
    const companies = this.companies.map(company => {
      if (company.id === updated.id) return updated
      return company
    })
    this.companies = companies
    return updated
  }
  async getAllAsync(): Promise<Company[]> {
    return this.companies.filter(company => company.deletedAt === undefined)
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
}

