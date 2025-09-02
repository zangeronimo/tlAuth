import { Password } from '@domain/valueObjects'
import { BaseEntity } from './base.entity'
import { ActiveEnum, numberToActiveEnum } from '@domain/enum/active.enum'
import { randomUUID } from 'crypto'

export class Credential extends BaseEntity {
  private _systemId: string
  private _password: Password
  private _isActive: ActiveEnum
  private _lastLogin?: Date

  get systemId() {
    return this._systemId
  }
  get password() {
    return this._password
  }
  get lastLogin() {
    return this._lastLogin
  }
  get isActive() {
    return this._isActive
  }

  private constructor(
    id: string,
    systemId: string,
    password: Password,
    isActive: ActiveEnum,
    createdAt: Date,
    updatedAt: Date,
    lastLogin?: Date,
    deletedAt?: Date,
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._systemId = systemId
    this._password = password
    this._isActive = isActive
    this._lastLogin = lastLogin
  }

  static create(systemId: string, password: string, isActive: ActiveEnum) {
    const id = randomUUID()
    return new Credential(
      id,
      systemId,
      Password.create(password),
      isActive,
      new Date(),
      new Date(),
    )
  }

  static restore(
    id: string,
    systemId: string,
    passwordHash: string,
    passwordSalt: string,
    isActive: number,
    createdAt: string,
    updatedAt: string,
    lastLogin?: string,
    deletedAt?: string,
  ) {
    return new Credential(
      id,
      systemId,
      Password.restore(passwordHash, passwordSalt),
      isActive ? ActiveEnum.ACTIVE : ActiveEnum.INACTIVE,
      new Date(createdAt),
      new Date(updatedAt),
      lastLogin ? new Date(lastLogin) : undefined,
      deletedAt ? new Date(deletedAt) : undefined,
    )
  }
  update(active: number, password?: string) {
    this._isActive = numberToActiveEnum(active)
    if (password) this._password = Password.create(password)
    super.updatedAt = new Date()
  }
  delete() {
    this.deletedAt = new Date()
  }
}

