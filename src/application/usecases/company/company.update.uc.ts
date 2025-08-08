import { CompanyDto } from '@domain/dto/company.dto'
import { CompanySystems } from '@domain/entity'
import { NotFoundError } from '@domain/errors/not.found.error'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import {
  type ISystemRepository,
  type ICompanyRepository,
} from '@domain/interface/repository'
import { UseCase } from '@domain/interface/use.case'
import { inject, injectable } from 'tsyringe'

type Props = {
  id: string
  name: string
  active: number
  systems: { id: string; modules: string[] }[]
}

@injectable()
export class CompanyUpdateUC implements UseCase<Props, CompanyDto> {
  constructor(
    @inject('ICompanyRepository')
    readonly companyRepository: ICompanyRepository,
    @inject('ISystemRepository')
    readonly systemRepository: ISystemRepository,
  ) {}
  async executeAsync({
    id,
    name,
    active,
    systems = [],
  }: Props): Promise<CompanyDto> {
    const companySystems: CompanySystems[] = []
    for (const companySystem of systems) {
      const system = await this.systemRepository.getByIdAsync(companySystem.id)
      if (!system) throw new NotFoundError('System', companySystem.id)
      companySystems.push(new CompanySystems(companySystem.id))
    }
    const company = await this.companyRepository.getByIdAsync(id)
    if (!company) throw new NotFoundError('Company', id)
    company.update(name, active, companySystems)
    const companySaved = await this.companyRepository.getBySlugAsync(
      company.slug,
    )
    if (companySaved && companySaved.id !== id)
      throw new SlugAlreadyExistsError(company.slug.value!)
    const result = await this.companyRepository.updateAsync(company)
    const allSystems = await this.systemRepository.getAllAsync()
    return CompanyDto.from(result, allSystems)
  }
}

