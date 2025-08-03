import { CompanyDto } from '@domain/dto/company.dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { type ICompanyRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  active: number
}

@injectable()
export class CompanyActiveUC implements UseCase<Props, CompanyDto> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
  ) {}
  async executeAsync({ id, active }: Props): Promise<CompanyDto> {
    const company = await this.companyRepository.getByIdAsync(id)
    if (!company) throw new NotFoundError('Company', id)
    company.active(active)
    const result = await this.companyRepository.updateAsync(
      company,
      company.systems
        .filter(companySystem => companySystem.checked)
        .map(companySystem => companySystem.system.id),
    )
    return CompanyDto.from(result)
  }
}

