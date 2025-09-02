import { User } from '@domain/entity'
import { CompanyDto } from './company.dto'

export class UserDto {
  static from(user: User) {
    const userDto = {
      id: user.id,
      name: user.name,
      email: user.email.value,
      active: user.isActive,
      companies: user.companies?.map(company => CompanyDto.from(company)),
      credentials: user.credentials?.map(credential => ({
        id: credential.id,
        systemId: credential.systemId,
        active: credential.isActive,
        lastLogin: credential.lastLogin,
      })),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
    return userDto
  }
}

