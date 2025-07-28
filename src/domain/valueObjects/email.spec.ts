import { Messages } from '@application/messages/message'
import { Email } from './email'

const VALID_EMAILs = ['zangeronimo@gmail.com', 'test@test.com.br', 'a@b.br']
const INVALID_EMAILS = ['', 'test', 'test@', '@test', 'test@test']

describe('Email Value Object', () => {
  it.each(VALID_EMAILs)(
    'should be able to create a valid email: "%s"',
    validEmail => {
      const email = Email.create(validEmail)
      expect(email.value).toBe(validEmail)
    },
  )
  it.each(INVALID_EMAILS)(
    'should throw error for invalid email: "%s"',
    invalidEmail => {
      expect(() => Email.create(invalidEmail)).toThrow(Messages.invalidEmail)
    },
  )
})

