/**
 * Authentication utilities for web app
 */

import { apiClient } from '@/lib/api/client'

export interface AuthUser {
  id: string
  email?: string
  credits: number
  dailyUsageChat: number
  dailyUsageImage: number
  dailyUsageVideo: number
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoading: boolean
}

// Auth state management
let authState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: typeof window !== 'undefined' // Only loading on client side
}

const authListeners: ((state: AuthState) => void)[] = []

export function subscribeToAuth(listener: (state: AuthState) => void): () => void {
  authListeners.push(listener)
  
  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(listener)
    if (index > -1) {
      authListeners.splice(index, 1)
    }
  }
}

function notifyAuthListeners() {
  authListeners.forEach(listener => listener(authState))
}

function updateAuthState(updates: Partial<AuthState>) {
  authState = { ...authState, ...updates }
  notifyAuthListeners()
}

// Auth functions
export async function initializeAuth(): Promise<void> {
  updateAuthState({ isLoading: true })
  
  try {
    // Check if we have a token
    const token = localStorage.getItem('synexa_auth_token')
    if (!token) {
      updateAuthState({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      })
      return
    }

    // Demo mode - if we have a token, assume user is logged in
    const demoUser: AuthUser = {
      id: 'demo-user-1',
      email: 'demo@synexa.ai',
      credits: 150,
      dailyUsageChat: 5,
      dailyUsageImage: 3,
      dailyUsageVideo: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    updateAuthState({
      isAuthenticated: true,
      user: demoUser,
      isLoading: false
    })
  } catch (error) {
    console.error('Auth initialization failed:', error)
    updateAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    })
  }
}

export async function login(email?: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Demo mode - simulate successful login
    const demoUser: AuthUser = {
      id: 'demo-user-1',
      email: email || 'demo@synexa.ai',
      credits: 150,
      dailyUsageChat: 5,
      dailyUsageImage: 3,
      dailyUsageVideo: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Store demo token
    localStorage.setItem('synexa_auth_token', 'demo-token-' + Date.now())
    
    updateAuthState({
      isAuthenticated: true,
      user: demoUser,
      isLoading: false
    })
    
    return { success: true }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Login failed' 
    }
  }
}

export async function logout(): Promise<void> {
  await apiClient.logout()
  updateAuthState({
    isAuthenticated: false,
    user: null,
    isLoading: false
  })
}

export function getAuthState(): AuthState {
  return authState
}

export function isAuthenticated(): boolean {
  return authState.isAuthenticated
}

export function getCurrentUser(): AuthUser | null {
  return authState.user
}

// Token management functions (for testing)
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  // Delay initialization to avoid hydration issues
  setTimeout(() => {
    initializeAuth()
  }, 100)
}
