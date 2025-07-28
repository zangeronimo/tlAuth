import { container } from 'tsyringe'
import { HashProvider } from '../hash.provider'
import { Messages } from '@application/messages/message'

export class Password {
  readonly _hashProvider = container.resolve<HashProvider>('HashProvider')

  private constructor(
    readonly value: string,
    readonly salt: string,
  ) {}
  static create(password: string) {
    const _hashProvider = container.resolve<HashProvider>('HashProvider')
    const { hash, salt } = _hashProvider.generateHash(password)!
    if (!hash || !salt) {
      throw new Error(Messages.passwordHashFail)
    }
    return new Password(hash, salt)
  }
  static restore(hash: string, salt: string) {
    return new Password(hash, salt)
  }
  validate(password: string) {
    return this._hashProvider.compareHash(password, this.salt, this.value)
  }
}

