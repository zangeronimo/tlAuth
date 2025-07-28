import { container } from 'tsyringe'
import { API } from '../../../api.express'
import request from 'supertest'
import { Messages } from '@application/messages/message'
import { Express } from 'express'
import { CompanyInMemoryRepository } from '@infra/repository/company-inmemory.repository'

const BASE_URL = '/companies'
describe('CompanyController', () => {
  let app: Express
  let repo: CompanyInMemoryRepository
  beforeAll(() => {
    repo = new CompanyInMemoryRepository()
    container.registerInstance('ICompanyRepository', repo)
    app = API.init()
  })
  beforeEach(() => {
    repo.clear()
  })

  it('should return 201 created in POST /companies', async () => {
    const res = await request(app).post(BASE_URL).send({
      name: 'Tudo Linux',
      active: 1,
    })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.slug).toBe('tudo-linux')
  })

  it('should return an exception on create the same company twice', async () => {
    const CompanyBody = {
      name: 'Tudo Linux',
      active: 1,
    }
    await request(app).post(BASE_URL).send(CompanyBody)
    const res = await request(app).post(BASE_URL).send(CompanyBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.alreadyInUse(`Slug "tudo-linux"`))
  })

  it('should return an array in GET /companies', async () => {
    const res = await request(app).get(BASE_URL)
    expect(res.status).toBe(200)
    expect(res.body).toStrictEqual([])
  })

  it('should return a persisted company by ID', async () => {
    const CompanyBody = {
      name: 'Tudo Linux',
      active: 1,
    }
    const companyCreated = await request(app).post(BASE_URL).send(CompanyBody)
    const company = await request(app).get(
      `${BASE_URL}/${companyCreated.body.id}`,
    )
    expect(company.body.id).toBe(companyCreated.body.id)
  })

  it('should return an exception if company not exist', async () => {
    const id = '1234'
    const company = await request(app).get(`${BASE_URL}/${id}`)
    expect(company.status).toBe(404)
    expect(company.body.message).toBe(Messages.notFound(`Company "${id}"`))
  })

  it('should update a persisted company', async () => {
    const CompanyBody = {
      name: 'Tudo Linux',
      active: 1,
    }
    const created = await request(app).post(BASE_URL).send(CompanyBody)
    const UpdateBody = {
      id: created.body.id,
      name: created.body.name,
      active: 0,
    }
    const updated = await request(app)
      .put(`${BASE_URL}/${UpdateBody.id}`)
      .send(UpdateBody)

    const company = await request(app).get(`${BASE_URL}/${updated.body.id}`)
    expect(updated.status).toBe(200)
    expect(company.body.id).toBe(created.body.id)
    expect(company.body.id).toBe(created.body.id)
    expect(company.body.active).toBe(UpdateBody.active)
  })

  it('should receive an exception if param id not equal body id', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'Tudo Linux', active: 1 })
    const UpdateBody = {
      id: created.body.id,
      name: 'Tudo Linux',
      active: 0,
    }
    const res = await request(app).put(`${BASE_URL}/${1234}`).send(UpdateBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.conflictField('Param ID', 'Body ID'))
  })

  it('should receive an exception if name equal other persisted company', async () => {
    await request(app).post(BASE_URL).send({ name: 'Tudo Linux', active: 1 })
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'Tudo Linux 2', active: 1 })
    const UpdateBody = {
      id: created.body.id,
      name: 'Tudo Linux',
      active: 0,
    }
    const res = await request(app)
      .put(`${BASE_URL}/${UpdateBody.id}`)
      .send(UpdateBody)
    expect(res.status).toBe(409)
    expect(res.body.message).toBe(Messages.alreadyInUse(`Slug "tudo-linux"`))
  })

  it('should be able to delete a Company', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'Tudo Linux', active: 1 })
    const res = await request(app).delete(`${BASE_URL}/${created.body.id}`)
    expect(res.status).toBe(204)
    const find = await request(app).get(`${BASE_URL}/${created.body.id}`)
    expect(find.status).toBe(404)
    expect(find.body.message).toBe(
      Messages.notFound(`Company "${created.body.id}"`),
    )
  })

  it('should be able to receive an error when delete an invalid Company', async () => {
    const id = '1234'
    const res = await request(app).delete(`${BASE_URL}/${id}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe(Messages.notFound(`Company "${id}"`))
  })

  it('should be able to update status of the Company', async () => {
    const created = await request(app)
      .post(BASE_URL)
      .send({ name: 'Tudo Linux', active: 1 })
    const res = await request(app).patch(`${BASE_URL}/${created.body.id}/0`)
    expect(res.status).toBe(200)
    const find = await request(app).get(`${BASE_URL}/${created.body.id}`)
    expect(find.status).toBe(200)
    expect(find.body.active).toBe(0)
  })

  it('should be able to receive an error when update status in an invalid Company', async () => {
    const id = '1234'
    const res = await request(app).patch(`${BASE_URL}/${id}/1`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe(Messages.notFound(`Company "${id}"`))
  })
})

