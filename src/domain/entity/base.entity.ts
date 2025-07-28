import { Messages } from '@application/messages/message'

export class BaseEntity {
  private _id: string
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt?: Date

  constructor(id: string, createdAt: Date, updatedAt: Date, deletedAt?: Date) {
    if (!id || !createdAt || !updatedAt)
      throw new Error(Messages.notFound('Required field'))
    ;((this._id = id), (this._createdAt = createdAt))
    this._updatedAt = updatedAt
    this._deletedAt = deletedAt
  }

  get id() {
    return this._id
  }
  get createdAt() {
    return this._createdAt
  }
  get updatedAt() {
    return this._updatedAt
  }
  get deletedAt() {
    return this._deletedAt
  }

  set updatedAt(value: Date) {
    this._updatedAt = value
  }

  set deletedAt(value: Date | undefined) {
    this._deletedAt = value
  }
}

