import {
  ICompanyRepository,
  ISystemRepository,
  IUserRepository,
} from '@domain/interface/repository'
import { CompanyRepository } from '@infra/repository/company.repository'
import { SystemRepository } from '@infra/repository/system.repository'
import { UserRepository } from '@infra/repository/user.repository'
import { container } from 'tsyringe'

export class RepositoryExtensions {
  static init() {
    container.registerSingleton<ICompanyRepository>(
      'ICompanyRepository',
      CompanyRepository,
    )
    container.registerSingleton<ISystemRepository>(
      'ISystemRepository',
      SystemRepository,
    )
    container.registerSingleton<IUserRepository>(
      'IUserRepository',
      UserRepository,
    )
  }
}

