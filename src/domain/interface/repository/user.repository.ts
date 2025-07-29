import { User } from '@domain/entity'
import { Email } from '@domain/valueObjects'

export interface IUserRepository {
  getAllAsync(): Promise<User[]>
  getByIdAsync(id: string): Promise<User | undefined>
  getByEmailAsync(email: Email): Promise<User | undefined>
  createAsync(company: User): Promise<User>
  updateAsync(company: User): Promise<User>
  deleteAsync(company: User): Promise<User>
}

