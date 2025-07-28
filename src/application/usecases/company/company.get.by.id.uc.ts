import { CompanyDto } from '@domain/dto/company.dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type ICompanyRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CompanyGetByIdUC
  implements UseCase<string, CompanyDto | undefined>
{
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
  ) {}
  async executeAsync(id: string): Promise<CompanyDto | undefined> {
    const company = await this.companyRepository.getByIdAsync(id)
    if (!company) throw new NotFoundError('Company', id)
    const companyDto = company ? CompanyDto.from(company) : undefined
    return companyDto
  }
}

