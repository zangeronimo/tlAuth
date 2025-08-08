import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Slug } from '@domain/valueObjects'
import { CompanySystems } from './company-systems'

export class Company extends BaseEntity {
  private _name: string
  private _slug: Slug
  private _isActive: ActiveEnum
  private _companySystems: CompanySystems[]

  get name() {
    return this._name
  }
  get slug() {
    return this._slug
  }
  get isActive() {
    return this._isActive
  }
  get systems() {
    return this._companySystems
  }

  private constructor(
    id: string,
    name: string,
    slug: Slug,
    isActive: ActiveEnum,
    companySystems: CompanySystems[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._name = name
    this._slug = slug
    this._isActive = isActive
    this._companySystems = companySystems

    this._validate()
  }

  static create(name: string, isActive: ActiveEnum) {
    const id = randomUUID()
    return new Company(
      id,
      name,
      Slug.create(name),
      isActive,
      [],
      new Date(),
      new Date(),
    )
  }

  static restore(
    id: string,
    name: string,
    slug: string,
    isActive: number,
    companySystems: CompanySystems[],
    createdAt: string,
    updatedAt: string,
    deletedAt?: string,
  ) {
    return new Company(
      id,
      name,
      Slug.restore(slug),
      isActive ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE,
      companySystems,
      new Date(createdAt),
      new Date(updatedAt),
      deletedAt ? new Date(deletedAt) : undefined,
    )
  }
  update(name: string, active: number, companySystems: CompanySystems[]) {
    this._name = name
    this._slug = Slug.create(name)
    this._isActive = numberToActiveEnum(active)
    this._companySystems = companySystems
    this.updatedAt = new Date()
  }
  delete() {
    this.deletedAt = new Date()
  }
  active(active: number) {
    this._isActive = numberToActiveEnum(active)
  }
  addCompanySystem(systemId: string, modules: string[] = []) {
    if (this._companySystems.some(data => data.systemId === systemId)) {
      throw new Error(`System "${systemId}" already assigned to this company.`)
    }
    const companySystem = new CompanySystems(systemId)
    modules.forEach(moduleId => companySystem.addCompanyModules(moduleId))
    this._companySystems.push(companySystem)
  }

  private _validate() {
    if (!this._name || !this._slug)
      throw new Error(Messages.notFound('Required field'))
  }
}

