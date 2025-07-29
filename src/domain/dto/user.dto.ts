import { User } from '@domain/entity'

export class UserDto {
  static from(company: User) {
    return {
      id: company.id,
      name: company.name,
      email: company.email.value,
      active: company.isActive,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    }
  }
}

