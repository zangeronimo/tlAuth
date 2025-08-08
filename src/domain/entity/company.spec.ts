import { Messages } from '@application/messages/message'
import { Company } from './company'
import { ActiveEnum } from '@domain/enum/active.enum'
import { randomUUID } from 'crypto'

const SUT = (
  id = randomUUID(),
  name = 'Tudo Linux',
  slug = 'tudo-linux',
  isActive = ActiveEnum.ACTIVE,
  createdAt = Date.now().toString(),
  updatedAt = Date.now().toString(),
  deletedAt?: string,
) =>
  Company.restore(id, name, slug, isActive, [], createdAt, updatedAt, deletedAt)

describe('Company Entity', () => {
  it('should be able to create a valid Company', () => {
    const sut = Company.create('Tudo Linux', ActiveEnum.ACTIVE)
    expect(sut).toBeInstanceOf(Company)
    expect(sut).toBeTruthy()
    expect(sut.id).toBeTruthy()
  })
  it('should be able to restore a valid Company', () => {
    const id = randomUUID()
    const sut = SUT(id)
    expect(sut).toBeInstanceOf(Company)
    expect(sut).toBeTruthy()
    expect(sut.id).toEqual(id)
  })
  it('should receive an error on create', () => {
    expect(() => Company.create('', ActiveEnum.ACTIVE)).toThrow(
      Messages.notFound('Required field'),
    )
  })
  it('should receive an error on restore', () => {
    const id = randomUUID()
    expect(() => SUT(id, '')).toThrow(Messages.notFound('Required field'))
  })
})

