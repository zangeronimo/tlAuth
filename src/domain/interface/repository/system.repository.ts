import { System } from '@domain/entity'
import { Slug } from '@domain/valueObjects'

export interface ISystemRepository {
  getAllAsync(): Promise<System[]>
  getByIdAsync(id: string): Promise<System | undefined>
  getBySlugAsync(slug: Slug): Promise<System | undefined>
  createAsync(company: System): Promise<System>
  updateAsync(company: System): Promise<System>
  deleteAsync(company: System): Promise<System>
}

