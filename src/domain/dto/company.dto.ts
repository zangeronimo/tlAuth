import { Company } from '@domain/entity'

export class CompanyDto {
  static from(company: Company) {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug.value,
      active: company.isActive,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    }
  }
}

