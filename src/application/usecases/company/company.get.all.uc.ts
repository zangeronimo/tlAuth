import { CompanyDto } from '@domain/dto/company.dto'
import { type ICompanyRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CompanyGetAllUC implements UseCase<'', CompanyDto[]> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
  ) {}
  async executeAsync(): Promise<CompanyDto[]> {
    const companies = await this.companyRepository.getAllAsync()
    const companiesDto = companies.map(company => CompanyDto.from(company))
    return companiesDto
  }
}

