// Test environment setup
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'file:./test.db'
process.env.OPENAI_API_KEY = 'sk-test-key-for-testing'
process.env.ENABLE_TEST_MODE = 'true'
process.env.AUTH_JWT_SECRET = 'test-jwt-secret-key'

// Mock console.log in tests to reduce noise
const originalLog = console.log
beforeAll(() => {
  console.log = jest.fn()
})

afterAll(() => {
  console.log = originalLog
})






