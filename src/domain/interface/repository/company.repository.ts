import { Company } from '@domain/entity'
import { Slug } from '@domain/valueObjects'

export interface ICompanyRepository {
  getAllAsync(): Promise<Company[]>
  getByIdAsync(id: string): Promise<Company | undefined>
  getBySlugAsync(slug: Slug): Promise<Company | undefined>
  createAsync(company: Company, systems: string[]): Promise<Company>
  updateAsync(company: Company, systems: string[]): Promise<Company>
  deleteAsync(company: Company): Promise<Company>
}

