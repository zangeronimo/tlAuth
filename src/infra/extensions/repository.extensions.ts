import { ICompanyRepository } from '@domain/interface/repository'
import { CompanyRepository } from '@infra/repository/company.repository'
import { container } from 'tsyringe'

export class RepositoryExtensions {
  static init() {
    container.registerSingleton<ICompanyRepository>(
      'ICompanyRepository',
      CompanyRepository,
    )
  }
}

