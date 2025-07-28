import { Messages } from '@application/messages/message'

export class Email {
  readonly value?: string

  constructor(email: string) {
    this.value = email
    this._validate()
  }

  static create = (value: string) => {
    return new Email(value)
  }

  static restore = (value: string) => {
    return new Email(value)
  }

  private _validate() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    if (!this.value || !regex.test(this.value)) {
      throw new Error(Messages.invalidEmail)
    }
  }
}

