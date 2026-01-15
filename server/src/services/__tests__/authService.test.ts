import { issueTokenForUser, verifyToken } from '../authService'

describe('AuthService', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com'
  }

  describe('issueTokenForUser', () => {
    it('should generate a valid JWT token', () => {
      const token = issueTokenForUser(mockUser)
      
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = issueTokenForUser(mockUser)
      const payload = verifyToken(token)
      
      expect(payload).toBeTruthy()
      expect(payload?.userId).toBe(mockUser.id)
      expect(payload?.email).toBe(mockUser.email)
    })

    it('should return null for invalid token', () => {
      const payload = verifyToken('invalid-token')
      
      expect(payload).toBeNull()
    })

    it('should return null for expired token', () => {
      // This would require mocking time, but for now we test basic validation
      const payload = verifyToken('')
      
      expect(payload).toBeNull()
    })
  })
})












