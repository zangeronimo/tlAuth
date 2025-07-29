import { User } from '@domain/entity'
import { CompanyDto } from './company.dto'

export class UserDto {
  static from(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      active: user.isActive,
      companies: user.companies?.map(company => CompanyDto.from(company)),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }
}

