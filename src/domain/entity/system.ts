import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { Messages } from '@application/messages/message'
import { randomUUID } from 'crypto'
import { Slug } from '@domain/valueObjects'
import { Module } from './module'

export class System extends BaseEntity {
  private _name: string
  private _slug: Slug
  private _description: string
  private _isActive: ActiveEnum
  private _modules: Module[]

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
  get modules() {
    return this._modules
  }

  private constructor(
    id: string,
    name: string,
    slug: Slug,
    description: string,
    isActive: ActiveEnum,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
    modules?: Module[],
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._name = name
    this._slug = slug
    this._description = description
    this._isActive = isActive
    this._modules = modules ? modules : []

    this._validate()
  }

  static create(name: string, description: string) {
    const id = randomUUID()
    return new System(
      id,
      name,
      Slug.create(name),
      description,
      ActiveEnum.INACTIVE,
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
    createdAt: string,
    updatedAt: string,
    deletedAt?: string,
    modules?: Module[],
  ) {
    return new System(
      id,
      name,
      Slug.restore(slug),
      description,
      isActive ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE,
      new Date(createdAt),
      new Date(updatedAt),
      deletedAt ? new Date(deletedAt) : undefined,
      modules,
    )
  }
  update(name: string, description: string, active: number) {
    this._name = name
    this._slug = Slug.create(name)
    this._description = description
    this.updatedAt = new Date()
    this.active(active)
  }
  delete() {
    this.deletedAt = new Date()
  }
  active(active: number) {
    if (active === ActiveEnum.ACTIVE && !this._modules.length)
      throw new Error(Messages.system.moduleNotFound)
    this._isActive = numberToActiveEnum(active)
  }

  addModule(module: Module) {
    const modules = new Set([...this._modules, module])
    this._modules = [...modules]
  }

  private _validate() {
    if (!this._name || !this._slug)
      throw new Error(Messages.notFound('Required field'))
  }
}

