import { container } from 'tsyringe'
import { API } from '../../../api.express'
import request from 'supertest'
import { Express } from 'express'
import { SystemInMemoryRepository } from '@infra/repository/system-inmemory.repository'
import { Messages } from '@application/messages/message'

const BASE_URL = '/systems'
describe('SystemController', () => {
  let app: Express
  let repo: SystemInMemoryRepository
  beforeAll(() => {
    repo = new SystemInMemoryRepository()
    container.registerInstance('ISystemRepository', repo)
    app = API.init()
  })
  beforeEach(() => {
    repo.clear()
  })

  it('should return 201 created in POST /systems', async () => {
    const res = await request(app).post(BASE_URL).send({
      name: 'webEditor',
      description: 'CMS',
    })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.slug).toBe('webeditor')
  })

  it('should return an exception on create the same system twice', async () => {
    const SystemBody = {
      name: 'webEditor',
      description: 'CMS',
    }
    await request(app).post(BASE_URL).send(SystemBody)
    const res = await request(app).post(BASE_URL).send(SystemBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.alreadyInUse(`Slug "webeditor"`))
  })

  it('should return an array in GET /systems', async () => {
    const res = await request(app).get(BASE_URL)
    expect(res.status).toBe(200)
    expect(res.body).toStrictEqual([])
  })

  it('should return a persisted system by ID', async () => {
    const SystemBody = {
      name: 'webEditor',
      description: 'CMS',
    }
    const systemCreated = await request(app).post(BASE_URL).send(SystemBody)
    const system = await request(app).get(
      `${BASE_URL}/${systemCreated.body.id}`,
    )
    expect(system.body.id).toBe(systemCreated.body.id)
  })

  it('should return an exception if system not exist', async () => {
    const id = '1234'
    const system = await request(app).get(`${BASE_URL}/${id}`)
    expect(system.status).toBe(404)
    expect(system.body.message).toBe(Messages.notFound(`System "${id}"`))
  })

  it('should update a persisted system', async () => {
    const SystemBody = {
      name: 'webEditor',
      description: 'CMS',
    }
    const created = await request(app).post(BASE_URL).send(SystemBody)
    const UpdateBody = {
      id: created.body.id,
      name: created.body.name,
      description: created.body.description,
      active: created.body.active,
    }
    const updated = await request(app)
      .put(`${BASE_URL}/${UpdateBody.id}`)
      .send(UpdateBody)

    const system = await request(app).get(`${BASE_URL}/${updated.body.id}`)
    expect(updated.status).toBe(200)
    expect(system.body.id).toBe(created.body.id)
    expect(system.body.id).toBe(created.body.id)
  })

  it('should receive an exception if param id not equal body id', async () => {
    const UpdateBody = {
      id: '123',
    }
    const res = await request(app).put(`${BASE_URL}/${1234}`).send(UpdateBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.conflictField('Param ID', 'Body ID'))
  })

  it('should receive an exception if name equal other persisted system', async () => {
    await request(app)
      .post(BASE_URL)
      .send({ name: 'webEditor', description: 'CMS' })
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'webEditor2', description: 'CMS' })
    const UpdateBody = {
      id: created.body.id,
      name: 'webEditor',
      description: 'CMS',
    }
    const res = await request(app)
      .put(`${BASE_URL}/${UpdateBody.id}`)
      .send(UpdateBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.alreadyInUse(`Slug "webeditor"`))
  })

  it('should be able to delete a System', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'webEditor', description: 'CMS' })
    const res = await request(app).delete(`${BASE_URL}/${created.body.id}`)
    expect(res.status).toBe(204)
    const find = await request(app).get(`${BASE_URL}/${created.body.id}`)
    expect(find.status).toBe(404)
    expect(find.body.message).toBe(
      Messages.notFound(`System "${created.body.id}"`),
    )
  })

  it('should be able to receive an error when delete an invalid System', async () => {
    const id = '1234'
    const res = await request(app).delete(`${BASE_URL}/${id}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe(Messages.notFound(`System "${id}"`))
  })

  it('should be able to update status of the System', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'webEditor', description: 'CMS' })
    const res = await request(app).patch(`${BASE_URL}/${created.body.id}/0`)
    expect(res.status).toBe(200)
    const find = await request(app).get(`${BASE_URL}/${created.body.id}`)
    expect(find.status).toBe(200)
    expect(find.body.active).toBe(0)
  })

  it('should be able to receive an error when update status in an invalid System', async () => {
    const id = '1234'
    const res = await request(app).patch(`${BASE_URL}/${id}/1`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe(Messages.notFound(`System "${id}"`))
  })

  it('should be able to receive an error when try active a system without module', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'webEditor', description: 'CMS' })
    const res = await request(app).patch(`${BASE_URL}/${created.body.id}/1`)
    expect(res.status).toBe(400)
    expect(res.body.message).toBe(Messages.system.moduleNotFound)
  })
})

