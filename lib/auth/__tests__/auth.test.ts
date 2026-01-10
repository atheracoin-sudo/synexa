import { getAuthToken, setAuthToken, clearAuthToken } from '../auth'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('Auth utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setAuthToken', () => {
    it('should store token in localStorage', () => {
      setAuthToken('test-token')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'synexa_auth_token',
        'test-token'
      )
    })
  })

  describe('getAuthToken', () => {
    it('should retrieve token from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('stored-token')
      
      const token = getAuthToken()
      
      expect(token).toBe('stored-token')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('synexa_auth_token')
    })

    it('should return null when no token stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const token = getAuthToken()
      
      expect(token).toBeNull()
    })
  })

  describe('clearAuthToken', () => {
    it('should remove token from localStorage', () => {
      clearAuthToken()
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('synexa_auth_token')
    })
  })
})






