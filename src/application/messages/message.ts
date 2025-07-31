export class Messages {
  static passwordHashFail =
    'Something wrong with the generating password process.'
  static invalidUsernameOrPassword = 'Invalid username or password.'
  static invalidJwtToken = 'Invalid JWT token.'
  static invalidGrantType = 'Invalid grant_type.'
  static invalidId = 'Invalid Param ID and Body ID.'
  static invalidEmail = 'Invalid EMail.'
  static notFound = (field: string) => `${field} not found.`
  static notCreated = (field: string) => `${field} not created.`
  static alreadyInUse = (field: string) => `${field} already in use.`
  static conflictField = (first: string, second: string) =>
    `${first} differente to ${second}.`
  static accessDenied = 'Access denied.'
  static system = {
    moduleNotFound: "You need to add at least one module before activating the system."
  }
}

