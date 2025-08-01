import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Email } from '@domain/valueObjects'
import { Company } from './company'

export class User extends BaseEntity {
  private _name: string
  private _email: Email
  private _isActive: ActiveEnum
  private _companies: Company[]

  get name() {
    return this._name
  }
  get email() {
    return this._email
  }
  get isActive() {
    return this._isActive
  }
  get companies() {
    return this._companies
  }

  private constructor(
    id: string,
    name: string,
    email: Email,
    isActive: ActiveEnum,
    companies: Company[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._name = name
    this._email = email
    this._isActive = isActive
    this._companies = companies

    this._validate()
  }

  static create(
    name: string,
    email: string,
    isActive: ActiveEnum,
    companies: Company[],
  ) {
    const id = randomUUID()
    return new User(
      id,
      name,
      Email.create(email),
      isActive,
      companies,
      new Date(),
      new Date(),
    )
  }

  static restore(
    id: string,
    name: string,
    email: string,
    isActive: number,
    companies: Company[],
    createdAt: string,
    updatedAt: string,
    deletedAt?: string,
  ) {
    return new User(
      id,
      name,
      Email.restore(email),
      isActive ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE,
      companies,
      new Date(createdAt),
      new Date(updatedAt),
      deletedAt ? new Date(deletedAt) : undefined,
    )
  }
  update(name: string, email: string, active: number, companies: Company[]) {
    this._name = name
    this._email = Email.create(email)
    this._isActive = numberToActiveEnum(active)
    this._companies = companies
    this.updatedAt = new Date()
  }
  delete() {
    this.deletedAt = new Date()
  }
  active(active: number) {
    this._isActive = numberToActiveEnum(active)
  }

  private _validate() {
    if (!this._name || !this._email.value || !this._companies.length)
      throw new Error(Messages.notFound('Required field'))
  }
}

