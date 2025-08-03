import { System } from '@domain/entity'
import { ActiveEnum } from '@domain/enum/active.enum'
import { Slug } from '@domain/valueObjects'

export interface ISystemRepository {
  getAllAsync(): Promise<System[]>
  getByIdAsync(id: string): Promise<System | undefined>
  getBySlugAsync(slug: Slug): Promise<System | undefined>
  createAsync(
    company: System,
    modules?: { name: string; description: string; active: ActiveEnum }[],
  ): Promise<System>
  updateAsync(
    company: System,
    modules?: { name: string; description: string; active: ActiveEnum }[],
  ): Promise<System>
  deleteAsync(company: System): Promise<System>
}

