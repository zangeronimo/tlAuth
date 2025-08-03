import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Slug } from '@domain/valueObjects'
import { System } from './system'

export class Company extends BaseEntity {
  private _name: string
  private _slug: Slug
  private _isActive: ActiveEnum
  private _companySystems: { system: System; checked: boolean }[]

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
    companySystems: { system: System; checked: boolean }[],
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
    companySystems: { system: System; checked: boolean }[],
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
  update(
    name: string,
    active: number,
    companySystems: { system: System; checked: boolean }[],
  ) {
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

  private _validate() {
    if (!this._name || !this._slug)
      throw new Error(Messages.notFound('Required field'))
  }
}

