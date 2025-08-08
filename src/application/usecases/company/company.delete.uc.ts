import { NotFoundError } from '@domain/errors/not.found.error'
import {
  type ISystemRepository,
  type ICompanyRepository,
} from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CompanyDeleteUC implements UseCase<string, void> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync(id: string): Promise<void> {
    const company = await this.companyRepository.getByIdAsync(id)
    if (!company) throw new NotFoundError('Company', id)
    company.delete()
    await this.companyRepository.deleteAsync(company)
  }
}

