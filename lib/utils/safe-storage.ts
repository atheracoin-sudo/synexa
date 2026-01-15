/**
 * Safe storage utilities for SSR compatibility
 * Prevents localStorage/sessionStorage access during server-side rendering
 */

// Check if we're in browser environment
export const isBrowser = typeof window !== 'undefined'

/**
 * Safe localStorage wrapper that returns null on server
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isBrowser) return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silently fail on server or when storage is unavailable
    }
  },

  removeItem: (key: string): void => {
    if (!isBrowser) return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail on server
    }
  }
}

/**
 * Safe sessionStorage wrapper that returns null on server
 */
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null
    try {
      return sessionStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isBrowser) return
    try {
      sessionStorage.setItem(key, value)
    } catch {
      // Silently fail on server
    }
  },

  removeItem: (key: string): void => {
    if (!isBrowser) return
    try {
      sessionStorage.removeItem(key)
    } catch {
      // Silently fail on server
    }
  }
}

/**
 * Safe window/document access
 */
export const safeWindow = {
  location: isBrowser ? window.location : null,
  navigator: isBrowser ? window.navigator : null,
  addEventListener: isBrowser ? window.addEventListener.bind(window) : () => {},
  removeEventListener: isBrowser ? window.removeEventListener.bind(window) : () => {},
  dispatchEvent: isBrowser ? window.dispatchEvent.bind(window) : () => {},
  open: isBrowser ? window.open.bind(window) : () => {},
}

export const safeDocument = {
  createElement: isBrowser ? document.createElement.bind(document) : () => null,
  body: isBrowser ? document.body : null,
}

/**
 * Hook for client-side only data loading
 * Returns default value on server, loads actual data on client
 */
export function useClientOnlyData<T>(
  loader: () => T,
  defaultValue: T
): T {
  if (!isBrowser) return defaultValue
  
  // On client, load the data
  try {
    return loader()
  } catch {
    return defaultValue
  }
}



