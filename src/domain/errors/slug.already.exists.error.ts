import { Messages } from '@application/messages/message'

export class SlugAlreadyExistsError extends Error {
  constructor(slug: string) {
    super(Messages.alreadyInUse(`Slug "${slug}"`))
    this.name = 'SlugAlreadyExistsError'
  }
}

