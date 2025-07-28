import { Messages } from '@application/messages/message'

export class ConflictError extends Error {
  constructor(first: string, second: string) {
    super(Messages.conflictField(first, second))
    this.name = 'ConflictError'
  }
}

