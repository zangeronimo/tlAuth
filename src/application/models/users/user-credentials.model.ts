export class UserCredentialsModel {
  constructor(
    readonly systemId: string,
    readonly active: number,
    readonly password?: string,
    readonly id?: string,
  ) {
    this.validate(systemId, id, password)
  }

  private validate(systemId: string, id?: string, password?: string) {
    if (systemId && !id && !password) {
      throw new Error('password field required')
    }
  }
}

