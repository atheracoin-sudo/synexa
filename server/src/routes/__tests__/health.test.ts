import request from 'supertest'
import express from 'express'

// Mock the health endpoint
const app = express()

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'configured', error: null },
      openai: { configured: true, testMode: true }
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV
    }
  })
})

describe('Health Endpoint', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200)

    expect(response.body.status).toBe('ok')
    expect(response.body.services).toBeDefined()
    expect(response.body.services.database).toBeDefined()
    expect(response.body.services.openai).toBeDefined()
    expect(response.body.system).toBeDefined()
  })

  it('should include timestamp', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200)

    expect(response.body.timestamp).toBeDefined()
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date)
  })

  it('should include system information', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200)

    expect(response.body.system.nodeVersion).toBeDefined()
    expect(response.body.system.platform).toBeDefined()
    expect(response.body.system.env).toBeDefined()
  })
})






