import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Slug } from '@domain/valueObjects'

export class Module extends BaseEntity {
  private _name: string
  private _slug: Slug
  private _description: string
  private _isActive: ActiveEnum
  private _systemId: string

  get name() {
    return this._name
  }
  get slug() {
    return this._slug
  }
  get description() {
    return this._description
  }
  get isActive() {
    return this._isActive
  }
  get systemId() {
    return this._systemId
  }

  private constructor(
    id: string,
    name: string,
    slug: Slug,
    description: string,
    isActive: ActiveEnum,
    systemId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._name = name
    this._slug = slug
    this._description = description
    this._isActive = isActive
    this._systemId = systemId

    this._validate()
  }

  static create(name: string, description: string, isActive: ActiveEnum, systemId: string) {
    const id = randomUUID()
    return new Module(
      id,
      name,
      Slug.create(name),
      description,
      isActive,
      systemId,
      new Date(),
      new Date(),
    )
  }

  static restore(
    id: string,
    name: string,
    slug: string,
    description: string,
    isActive: number,
    systemId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt?: string,
  ) {
    return new Module(
      id,
      name,
      Slug.restore(slug),
      description,
      isActive ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE,
      systemId,
      new Date(createdAt),
      new Date(updatedAt),
      deletedAt ? new Date(deletedAt) : undefined,
    )
  }
  update(name: string, description: string, active: number) {
    this._name = name
    this._slug = Slug.create(name)
    this._description = description
    this._isActive = numberToActiveEnum(active)
    this.updatedAt = new Date()
  }
  delete() {
    this.deletedAt = new Date()
  }
  active(active: number) {
    this._isActive = numberToActiveEnum(active)
  }

  private _validate() {
    if (!this._name || !this._slug || !this._systemId)
      throw new Error(Messages.notFound('Required field'))
  }
}

