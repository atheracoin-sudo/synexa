import { SynexaApiClient } from '../client'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SynexaApiClient', () => {
  let client: SynexaApiClient

  beforeEach(() => {
    client = new SynexaApiClient()
    mockFetch.mockClear()
  })

  describe('healthCheck', () => {
    it('should return success response for healthy backend', async () => {
      const mockResponse = {
        status: 'ok',
        timestamp: '2026-01-07T22:00:00.000Z',
        services: {
          database: { status: 'configured' },
          openai: { configured: true, testMode: true }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })

      const result = await client.healthCheck()

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/health',
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.healthCheck()

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('NETWORK_ERROR')
    })
  })

  describe('login', () => {
    it('should login successfully with demo account', async () => {
      const mockResponse = {
        user: { id: '1', email: 'demo@example.com' },
        token: 'mock-jwt-token'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })

      const result = await client.login('demo@example.com')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/auth/demo',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'demo@example.com' }),
        })
      )
    })
  })

  describe('chat', () => {
    it('should send chat message and receive response', async () => {
      const mockResponse = {
        requestId: 'test-123',
        outputText: 'Test response from backend',
        model: 'gpt-4o-mini'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })

      const result = await client.chat({
        messages: [{ role: 'user', content: 'Hello' }],
        modelId: 'gpt-4o-mini'
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
    })
  })
})









