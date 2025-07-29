import { Messages } from '@application/messages/message'
import { User } from './user'
import { ActiveEnum } from '@domain/enum/active.enum'
import { randomUUID } from 'crypto'

const SUT = (
  id = randomUUID(),
  name = 'Luciano Zangeronimo',
  email = 'zangeronimo@gmail.com',
  isActive = ActiveEnum.ACTIVE,
  companies = ['abc'],
  createdAt = Date.now().toString(),
  updatedAt = Date.now().toString(),
  deletedAt?: string,
) =>
  User.restore(
    id,
    name,
    email,
    isActive,
    companies,
    createdAt,
    updatedAt,
    deletedAt,
  )

describe('User Entity', () => {
  it('should be able to create a valid User', () => {
    const sut = User.create(
      'Luciano Zangeronimo',
      'zangeronimo@gmail.com',
      ActiveEnum.ACTIVE,
      ['abc'],
    )
    expect(sut).toBeInstanceOf(User)
    expect(sut).toBeTruthy()
    expect(sut.id).toBeTruthy()
  })
  it('should be able to restore a valid User', () => {
    const id = randomUUID()
    const sut = SUT(id)
    expect(sut).toBeInstanceOf(User)
    expect(sut).toBeTruthy()
    expect(sut.id).toEqual(id)
  })
  it('should receive an error on create', () => {
    expect(() =>
      User.create('', 'zangeronimo@gmail.com', ActiveEnum.ACTIVE, []),
    ).toThrow(Messages.notFound('Required field'))
  })
  it('should receive an error on restore', () => {
    const id = randomUUID()
    expect(() => SUT(id, '')).toThrow(Messages.notFound('Required field'))
  })
})

