import { Express } from 'express'
import { API } from '../../../api.express'
import { container } from 'tsyringe'
import request from 'supertest'
import { UserInMemoryRepository } from '@infra/repository'
import { Messages } from '@application/messages/message'

const BASE_URL = '/users'
let app: Express
let repo: UserInMemoryRepository
describe('UserController', () => {
  beforeAll(() => {
    repo = new UserInMemoryRepository()
    container.registerInstance('IUserRepository', repo)
    app = API.init()
  })
  beforeEach(() => {
    repo.clear()
  })

  it('should be able to create a new user', async () => {
    const email = 'zangeronimo@gmail.com'
    const res = await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email,
        companies: ['123'],
        active: 1,
      })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.email).toBe(email)
  })

  it('should receive an exception if try add the same user twice', async () => {
    const email = 'zangeronimo@gmail.com'
    await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email,
        companies: ['123'],
        active: 1,
      })
    const res = await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email,
        companies: ['123'],
        active: 1,
      })
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.alreadyInUse(`Email "${email}"`))
  })

  it('should be able to getAll users', async () => {
    const res = await request(app).get(BASE_URL)
    expect(res.status).toBe(200)
    expect(res.body).toStrictEqual([])
  })

  it('should return a persisted user by ID', async () => {
    const UserBody = {
      name: 'Luciano Zangeronimo',
      email: 'zangeronimo@gmail.com',
      active: 1,
      companies: ['123'],
    }
    const userCreated = await request(app).post(BASE_URL).send(UserBody)
    expect(userCreated.status).toBe(201)
    const user = await request(app).get(`${BASE_URL}/${userCreated.body.id}`)
    expect(user.body.id).toBe(userCreated.body.id)
  })

  it('should return an exception if user not exist', async () => {
    const id = '1234'
    const user = await request(app).get(`${BASE_URL}/${id}`)
    expect(user.status).toBe(404)
    expect(user.body.message).toBe(Messages.notFound(`User "${id}"`))
  })

  it('should update a persisted user', async () => {
    const UserBody = {
      name: 'Luciano Zangeronimo',
      email: 'zangeronimo@gmail.com',
      active: 1,
      companies: ['123'],
    }
    const created = await request(app).post(BASE_URL).send(UserBody)
    const UpdateBody = {
      id: created.body.id,
      name: created.body.name,
      email: created.body.email,
      active: 0,
      companies: ['123'],
    }
    const updated = await request(app)
      .put(`${BASE_URL}/${UpdateBody.id}`)
      .send(UpdateBody)

    const user = await request(app).get(`${BASE_URL}/${updated.body.id}`)
    expect(updated.status).toBe(200)
    expect(user.body.id).toBe(created.body.id)
    expect(user.body.id).toBe(created.body.id)
    expect(user.body.active).toBe(UpdateBody.active)
  })

  it('should receive an exception if param id not equal body id', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email: 'zangeronimo@gmail.com',
        active: 1,
        companies: ['123'],
      })
    const UpdateBody = {
      id: created.body.id,
      name: 'Luciano Zangeronimo',
      email: 'zangeronimo@gmail.com',
      active: 0,
      companies: ['123'],
    }
    const res = await request(app).put(`${BASE_URL}/${1234}`).send(UpdateBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.conflictField('Param ID', 'Body ID'))
  })

  it('should receive an exception if name equal other persisted user', async () => {
    await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email: 'zangeronimo@gmail.com',
        active: 1,
        companies: ['123'],
      })
    const created = await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo 2',
        email: 'zangeronimo2@gmail.com',
        active: 1,
        companies: ['123'],
      })
    const UpdateBody = {
      id: created.body.id,
      name: 'Luciano Zangeronimo',
      email: 'zangeronimo@gmail.com',
      active: 0,
      companies: ['123'],
    }
    const res = await request(app)
      .put(`${BASE_URL}/${UpdateBody.id}`)
      .send(UpdateBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(
      Messages.alreadyInUse(`Email "zangeronimo@gmail.com"`),
    )
  })

  it('should be able to delete a User', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email: 'zangeronimo@gmail.com',
        active: 1,
        companies: ['123'],
      })
    const res = await request(app).delete(`${BASE_URL}/${created.body.id}`)
    expect(res.status).toBe(204)
    const find = await request(app).get(`${BASE_URL}/${created.body.id}`)
    expect(find.status).toBe(404)
    expect(find.body.message).toBe(
      Messages.notFound(`User "${created.body.id}"`),
    )
  })

  it('should be able to receive an error when delete an invalid User', async () => {
    const id = '1234'
    const res = await request(app).delete(`${BASE_URL}/${id}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe(Messages.notFound(`User "${id}"`))
  })

  it('should be able to update status of the User', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({
        name: 'Luciano Zangeronimo',
        email: 'zangeronimo@gmail.com',
        active: 1,
        companies: ['123'],
      })
    expect(created.status).toBe(201)
    const res = await request(app).patch(`${BASE_URL}/${created.body.id}/0`)
    expect(res.status).toBe(200)
    const find = await request(app).get(`${BASE_URL}/${created.body.id}`)
    expect(find.body.active).toBe(0)
  })

  it('should be able to receive an error when update status in an invalid User', async () => {
    const id = '1234'
    const res = await request(app).patch(`${BASE_URL}/${id}/1`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe(Messages.notFound(`User "${id}"`))
  })
})

