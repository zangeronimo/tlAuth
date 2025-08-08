import { CompanyDto } from '@domain/dto/company.dto'
import { Company } from '@domain/entity'
import { numberToActiveEnum } from '@domain/enum/active.enum'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import {
  type ISystemRepository,
  type ICompanyRepository,
} from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  name: string
  active: number
  systems: { id: string; modules: string[] }[]
}

@injectable()
export class CompanyCreateUC implements UseCase<Props, CompanyDto> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({
    name,
    active,
    systems = [],
  }: Props): Promise<CompanyDto> {
    const company = Company.create(name, numberToActiveEnum(active))
    const companySaved = await this.companyRepository.getBySlugAsync(
      company.slug,
    )
    if (companySaved) throw new SlugAlreadyExistsError(company.slug.value!)
    systems.forEach(system =>
      company.addCompanySystem(system.id, system.modules),
    )
    const result = await this.companyRepository.createAsync(company)
    const allSystems = await this.systemRepository.getAllAsync()
    return CompanyDto.from(result, allSystems)
  }
}

