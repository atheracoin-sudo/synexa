'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AppState, UserState, WorkspaceState, defaultUserState, config } from '@/lib/config'

// Action Types
type AppAction =
  | { type: 'SET_USER'; payload: UserState }
  | { type: 'UPDATE_USER'; payload: Partial<UserState> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USAGE'; payload: Partial<UserState['usage']> }
  | { type: 'SET_ACTIVE_PROJECT'; payload: string }
  | { type: 'ADD_RECENT_PROJECT'; payload: string }
  | { type: 'TOGGLE_SIDEBAR'; payload?: boolean }
  | { type: 'CLEAR_ERROR' }

// Initial State
const initialState: AppState = {
  user: defaultUserState,
  workspace: {
    recentProjects: ['project_1', 'project_2', 'project_3'],
    openTabs: [],
    sidebarCollapsed: false
  },
  isLoading: false,
  error: null
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    case 'UPDATE_USAGE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          usage: { ...state.user.usage, ...action.payload }
        } : null
      }
    
    case 'SET_ACTIVE_PROJECT':
      return {
        ...state,
        workspace: { ...state.workspace, activeProject: action.payload }
      }
    
    case 'ADD_RECENT_PROJECT':
      const recentProjects = [
        action.payload,
        ...state.workspace.recentProjects.filter(id => id !== action.payload)
      ].slice(0, 10) // Keep only 10 recent projects
      
      return {
        ...state,
        workspace: { ...state.workspace, recentProjects }
      }
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          sidebarCollapsed: action.payload ?? !state.workspace.sidebarCollapsed
        }
      }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  actions: {
    setUser: (user: UserState) => void
    updateUser: (updates: Partial<UserState>) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void
    updateUsage: (usage: Partial<UserState['usage']>) => void
    setActiveProject: (projectId: string) => void
    addRecentProject: (projectId: string) => void
    toggleSidebar: (collapsed?: boolean) => void
    incrementUsage: (type: keyof UserState['usage'], amount?: number) => void
  }
} | null>(null)

// Provider Component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load user data on mount
  useEffect(() => {
    // In production, this would load from API/localStorage
    const savedUser = localStorage.getItem('synexa_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'SET_USER', payload: { ...defaultUserState, ...user } })
      } catch (error) {
        console.error('Failed to load user data:', error)
      }
    }
  }, [])

  // Save user data when it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('synexa_user', JSON.stringify(state.user))
    }
  }, [state.user])

  // Action creators
  const actions = {
    setUser: (user: UserState) => dispatch({ type: 'SET_USER', payload: user }),
    
    updateUser: (updates: Partial<UserState>) => dispatch({ type: 'UPDATE_USER', payload: updates }),
    
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    
    updateUsage: (usage: Partial<UserState['usage']>) => dispatch({ type: 'UPDATE_USAGE', payload: usage }),
    
    setActiveProject: (projectId: string) => dispatch({ type: 'SET_ACTIVE_PROJECT', payload: projectId }),
    
    addRecentProject: (projectId: string) => dispatch({ type: 'ADD_RECENT_PROJECT', payload: projectId }),
    
    toggleSidebar: (collapsed?: boolean) => dispatch({ type: 'TOGGLE_SIDEBAR', payload: collapsed }),
    
    incrementUsage: (type: keyof UserState['usage'], amount = 1) => {
      if (!state.user) return
      
      const currentValue = typeof state.user.usage[type] === 'number' 
        ? state.user.usage[type] as number 
        : 0
      
      dispatch({
        type: 'UPDATE_USAGE',
        payload: { [type]: currentValue + amount }
      })
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Convenience hooks
export function useUser() {
  const { state } = useApp()
  return state.user
}

export function useUserPlan() {
  const user = useUser()
  return user?.plan || 'free'
}

export function useUsage() {
  const user = useUser()
  return user?.usage || defaultUserState.usage
}

export function useWorkspace() {
  const { state } = useApp()
  return state.workspace
}





