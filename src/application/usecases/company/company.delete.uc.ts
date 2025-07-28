import { CompanyDto } from '@domain/dto/company.dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type ICompanyRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CompanyDeleteUC implements UseCase<string, CompanyDto> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
  ) {}
  async executeAsync(id: string): Promise<CompanyDto> {
    const company = await this.companyRepository.getByIdAsync(id)
    if (!company) throw new NotFoundError('Company', id)
    company.delete()
    const result = await this.companyRepository.deleteAsync(company)
    return CompanyDto.from(result)
  }
}

