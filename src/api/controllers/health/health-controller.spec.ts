import { API } from '../../../api.express'
import request from 'supertest'

describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const app = API.init()
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.db).toBe('connected')
  })
})

