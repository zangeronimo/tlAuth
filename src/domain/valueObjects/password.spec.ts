import 'reflect-metadata'
import { Password } from './password'

const VALID_PASSWORD = 'MyV@lidPassword!'
const VALID_HASH_VALUE =
  '2c27df5325e9d17f5eab4a474c15a9881a4d4fdc775d21ddcf4d73f786b6cf13592f588eb500f1ff1df4d9b810e95536a331f8012183296768d1a73648ec3c27'
const VALID_SALT = '63596a8d2cdfa4dac36e4cca85ac7b0d5c422b7e'

describe('Password Value Object', () => {
  it('should create a password', () => {
    const { value, salt } = Password.create(VALID_PASSWORD)
    expect(value).toBeTruthy()
    expect(salt).toBeTruthy()
  })
  it('should validate a password', () => {
    const password = Password.restore(VALID_HASH_VALUE, VALID_SALT)
    const validated = password.validate(VALID_PASSWORD)
    expect(validated).toBeTruthy()
  })
  it('should validate a wrong password', () => {
    const password = Password.restore(VALID_HASH_VALUE, VALID_SALT)
    const validated = password.validate('some other invalid password')
    expect(validated).toBeFalsy()
  })
})

