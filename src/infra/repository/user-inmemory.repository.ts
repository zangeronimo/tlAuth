import { User } from '@domain/entity'
import { IUserRepository } from '@domain/interface/repository'
import { Email } from '@domain/valueObjects'
import { injectable } from 'tsyringe'

@injectable()
export class UserInMemoryRepository implements IUserRepository {
  users: User[]
  constructor() {
    this.users = []
  }
  async createAsync(user: User): Promise<User> {
    this.users.push(user)
    return user
  }
  async updateAsync(updated: User): Promise<User> {
    const users = this.users.map(user => {
      if (user.id === updated.id) return updated
      return user
    })
    this.users = users
    return updated
  }
  async getAllAsync(): Promise<User[]> {
    return this.users.filter(user => user.deletedAt === undefined)
  }
  async getByIdAsync(id: string): Promise<User | undefined> {
    const user = this.users.find(
      user => user.id === id && user.deletedAt === undefined,
    )
    return user
  }
  async getByEmailAsync(email: Email): Promise<User | undefined> {
    const user = this.users.find(
      user => user.email.value === email.value && user.deletedAt === undefined,
    )
    return user
  }
  async deleteAsync(deleteUser: User): Promise<User> {
    const users = this.users.map(user => {
      if (user.id === deleteUser.id) return deleteUser
      return user
    })
    this.users = users
    return deleteUser
  }
  clear() {
    this.users = []
  }
}

