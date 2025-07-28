import { BaseEntity } from './base.entity'
import { ActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Email } from '@domain/valueObjects'

export class User extends BaseEntity {
  private _name: string
  private _email: Email
  private _isActive: ActiveEnum
  private _companies: string[]

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
    companies: string[],
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
    companyId: string,
  ) {
    const id = randomUUID()
    return new User(
      id,
      name,
      Email.create(email),
      isActive,
      [companyId],
      new Date(),
      new Date(),
    )
  }

  static restore(
    id: string,
    name: string,
    email: string,
    isActive: number,
    companies: string[],
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

  private _validate() {
    if (!this._name || !this._email.value || !this._companies.length)
      throw new Error(Messages.notFound('Required field'))
  }
}

