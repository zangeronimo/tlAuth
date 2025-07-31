import { System } from '@domain/entity'
import { ISystemRepository } from '@domain/interface/repository'
import { Slug } from '@domain/valueObjects'
import { injectable } from 'tsyringe'

@injectable()
export class SystemInMemoryRepository implements ISystemRepository {
  companies: System[] = []
  constructor() {
    this.clear()
  }
  async createAsync(company: System): Promise<System> {
    this.companies.push(company)
    return company
  }
  async updateAsync(updated: System): Promise<System> {
    const companies = this.companies.map(company => {
      if (company.id === updated.id) return updated
      return company
    })
    this.companies = companies
    return updated
  }
  async getAllAsync(): Promise<System[]> {
    return this.companies.filter(company => company.deletedAt === undefined)
  }
  async getByIdAsync(id: string): Promise<System | undefined> {
    const company = this.companies.find(
      company => company.id === id && company.deletedAt === undefined,
    )
    return company
  }
  async getBySlugAsync(slug: Slug): Promise<System | undefined> {
    const company = this.companies.find(
      company =>
        company.slug.value === slug.value && company.deletedAt === undefined,
    )
    return company
  }
  async deleteAsync(deleteSystem: System): Promise<System> {
    const companies = this.companies.map(company => {
      if (company.id === deleteSystem.id) return deleteSystem
      return company
    })
    this.companies = companies
    return deleteSystem
  }
  clear() {
    this.companies = []
  }
  seed(companies: System[]) {
    this.companies = companies
  }
}

