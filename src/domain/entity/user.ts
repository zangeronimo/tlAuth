import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Email } from '@domain/valueObjects'
import { Company } from './company'
import { Credential } from './'

export class User extends BaseEntity {
  private _name: string
  private _email: Email
  private _isActive: ActiveEnum
  private _companies: Company[]
  private _credentials: Credential[]

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
  get credentials() {
    return this._credentials
  }

  private constructor(
    id: string,
    name: string,
    email: Email,
    isActive: ActiveEnum,
    companies: Company[],
    credentials: Credential[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._name = name
    this._email = email
    this._isActive = isActive
    this._companies = companies
    this._credentials = credentials

    this._validate()
  }

  static create(
    name: string,
    email: string,
    isActive: ActiveEnum,
    companies: Company[],
    credentials: Credential[],
  ) {
    const id = randomUUID()
    return new User(
      id,
      name,
      Email.create(email),
      isActive,
      companies,
      credentials,
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
    credentials: Credential[],
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
      credentials,
      new Date(createdAt),
      new Date(updatedAt),
      deletedAt ? new Date(deletedAt) : undefined,
    )
  }
  update(
    name: string,
    email: string,
    active: number,
    companies: Company[],
    credentials: Credential[],
  ) {
    this._name = name
    this._email = Email.create(email)
    this._isActive = numberToActiveEnum(active)
    this._companies = companies
    this._credentials = credentials
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

