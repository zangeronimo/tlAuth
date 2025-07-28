import { Company } from '@domain/entity/company'
import { Slug } from '@domain/valueObjects'

export interface ICompanyRepository {
  getAllAsync(): Promise<Company[]>
  getByIdAsync(id: string): Promise<Company | undefined>
  getBySlugAsync(slug: Slug): Promise<Company | undefined>
  createAsync(company: Company): Promise<Company>
  updateAsync(company: Company): Promise<Company>
  deleteAsync(company: Company): Promise<Company>
}

