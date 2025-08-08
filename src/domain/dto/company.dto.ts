import { Company, System } from '@domain/entity'
import { CompanySystemsDto } from './company-systems.dto'

export class CompanyDto {
  static from(company: Company, systems: System[] = []) {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug.value,
      active: company.isActive,
      systems: systems.map(system =>
        CompanySystemsDto.from(system, company.systems),
      ),
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    }
  }
}

