/**
 * React hook for authentication
 */

import { useState, useEffect } from 'react'
import { 
  AuthState, 
  AuthUser, 
  subscribeToAuth, 
  getAuthState, 
  login as authLogin, 
  logout as authLogout,
  initializeAuth
} from '@/lib/auth/auth'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(getAuthState())

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuth(setAuthState)
    
    // Initialize auth if not already done
    if (authState.isLoading) {
      initializeAuth()
    }

    return unsubscribe
  }, [])

  const login = async (email?: string) => {
    return authLogin(email)
  }

  const logout = async () => {
    return authLogout()
  }

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading: authState.isLoading,
    login,
    logout
  }
}







