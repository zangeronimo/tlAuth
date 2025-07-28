import { CompanyDto } from '@domain/dto/company.dto'
import { NotFoundError } from '@domain/errors/not.found.error'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import { type ICompanyRepository } from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  name: string
  active: number
}

@injectable()
export class CompanyUpdateUC implements UseCase<Props, CompanyDto> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
  ) {}
  async executeAsync({ id, name, active }: Props): Promise<CompanyDto> {
    const company = await this.companyRepository.getByIdAsync(id)
    if (!company) throw new NotFoundError('Company', id)
    company.update(name, active)
    const companySaved = await this.companyRepository.getBySlugAsync(
      company.slug,
    )
    if (companySaved && companySaved.id !== id)
      throw new SlugAlreadyExistsError(company.slug.value!)
    const result = await this.companyRepository.updateAsync(company)
    return CompanyDto.from(result)
  }
}

