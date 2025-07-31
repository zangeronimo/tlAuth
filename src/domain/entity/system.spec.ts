import { Messages } from '@application/messages/message'
import { ActiveEnum } from '@domain/enum/active.enum'
import { randomUUID } from 'crypto'
import { System } from './system'
import { Module } from './module'

const SUT = (
  id = randomUUID(),
  name = 'webEditor',
  slug = 'webeditor',
  description = 'Description',
  isActive = ActiveEnum.ACTIVE,
  createdAt = Date.now().toString(),
  updatedAt = Date.now().toString(),
  deletedAt?: string,
) =>
  System.restore(
    id,
    name,
    slug,
    description,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
  )

describe('System Entity', () => {
  it('should be able to create a valid System', () => {
    const sut = System.create('webEditor', '')
    expect(sut).toBeInstanceOf(System)
    expect(sut).toBeTruthy()
    expect(sut.id).toBeTruthy()
    expect(sut.name).toEqual('webEditor')
    expect(sut.slug.value).toEqual('webeditor')
    expect(sut.isActive).toEqual(ActiveEnum.INACTIVE)
  })
  it('should be able to restore a valid System', () => {
    const id = randomUUID()
    const sut = SUT(id)
    expect(sut).toBeInstanceOf(System)
    expect(sut).toBeTruthy()
    expect(sut.id).toEqual(id)
  })
  it('should receive an error on create', () => {
    expect(() => System.create('', '')).toThrow(
      Messages.notFound('Required field'),
    )
  })
  it('should receive an error on restore', () => {
    const id = randomUUID()
    expect(() => SUT(id, '')).toThrow(Messages.notFound('Required field'))
  })
  it('should be able to active = 0 without modules', () => {
    const sut = System.create('webEditor', '')
    expect(() => sut.active(ActiveEnum.INACTIVE)).not.toThrow()
  })
  it('should receive an error on activate a System without module', () => {
    const sut = System.create('webEditor', '')
    expect(() => sut.active(ActiveEnum.ACTIVE)).toThrow(
      Messages.system.moduleNotFound,
    )
  })
  it('should update a system with modules and active 1', () => {
    const sut = System.create('webEditor', '')
    sut.addModule(
      Module.create('name', 'description', ActiveEnum.ACTIVE, sut.id),
    )
    expect(() => sut.update('newName', '', ActiveEnum.ACTIVE)).not.toThrow()
  })
  it('should update a system without module if active is 0', () => {
    const sut = System.create('webEditor', '')
    expect(() => sut.update('newName', '', ActiveEnum.INACTIVE)).not.toThrow()
  })
  it('should receive an error on update a System without module and active 1', () => {
    const sut = System.create('webEditor', '')
    expect(() => sut.update('newName', '', ActiveEnum.ACTIVE)).toThrow(
      Messages.system.moduleNotFound,
    )
  })
})

