import { CompanyActiveUC } from '@application/usecases/company/company.active.uc'
import { CompanyCreateUC } from '@application/usecases/company/company.create.uc'
import { CompanyDeleteUC } from '@application/usecases/company/company.delete.uc'
import { CompanyGetAllUC } from '@application/usecases/company/company.get.all.uc'
import { CompanyGetByIdUC } from '@application/usecases/company/company.get.by.id.uc'
import { CompanyUpdateUC } from '@application/usecases/company/company.update.uc'
import { CompanyDto } from '@domain/dto/company.dto'
import { type UseCase } from '@domain/interface/use.case'
import { container } from 'tsyringe'

export class UseCaseExtensions {
  static init() {
    container.registerSingleton<UseCase<'', CompanyDto[]>>(
      'CompanyGetAllUC',
      CompanyGetAllUC,
    )
    container.registerSingleton<UseCase<string, CompanyDto | undefined>>(
      'CompanyGetByIdUC',
      CompanyGetByIdUC,
    )
    container.registerSingleton<
      UseCase<{ name: string; active: number }, CompanyDto>
    >('CompanyCreateUC', CompanyCreateUC)
    container.registerSingleton<
      UseCase<{ name: string; active: number }, CompanyDto>
    >('CompanyUpdateUC', CompanyUpdateUC)
    container.registerSingleton<UseCase<string, CompanyDto>>(
      'CompanyDeleteUC',
      CompanyDeleteUC,
    )
    container.registerSingleton<
      UseCase<{ id: string; active: number }, CompanyDto>
    >('CompanyActiveUC', CompanyActiveUC)
  }
}

