import { Company } from '@domain/entity'
import { CompanySystemsDto } from './company-systems.dto'

export class CompanyDto {
  static from(company: Company) {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug.value,
      active: company.isActive,
      systems: company.systems.length
        ? company.systems.map(companySystems =>
            CompanySystemsDto.from(
              companySystems.system,
              companySystems.checked,
            ),
          )
        : [],
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    }
  }
}

