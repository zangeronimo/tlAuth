import { Messages } from '@application/messages/message'

export class NotFoundError extends Error {
  constructor(name: string, value: string) {
    super(Messages.notFound(`${name} "${value}"`))
    this.name = 'NotFoundError'
  }
}

