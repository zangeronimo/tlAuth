import { Messages } from '@application/messages/message'

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(Messages.alreadyInUse(`Email "${email}"`))
    this.name = 'EmailAlreadyExistsError'
  }
}

