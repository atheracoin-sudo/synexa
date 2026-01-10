'use client'

import * as React from 'react'

// Types compatible with shadcn/ui
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default' | 'destructive'

export interface ToastProps {
  id?: string
  title?: string
  description?: string
  type?: ToastType
  variant?: 'default' | 'destructive'
  duration?: number
  action?: React.ReactElement
}

// Internal toast state
interface ToastState extends Required<Pick<ToastProps, 'id' | 'title'>> {
  description?: string
  type: ToastType
  duration: number
}

// Global toast state
let toasts: ToastState[] = []
let listeners: Array<(toasts: ToastState[]) => void> = []

// Notify all listeners
function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]))
}

// Add toast to global state
function addToast(toast: Omit<ToastState, 'id'> & { id?: string }) {
  const id = toast.id || Math.random().toString(36).substring(2, 9)
  const newToast: ToastState = {
    id,
    title: toast.title,
    description: toast.description,
    type: toast.type,
    duration: toast.duration
  }
  
  toasts.push(newToast)
  notifyListeners()

  // Auto remove after duration
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
}

// Remove toast from global state
function removeToast(id: string) {
  toasts = toasts.filter(toast => toast.id !== id)
  notifyListeners()
}

// Main toast function - compatible with shadcn/ui
export function toast(props: ToastProps) {
  const { title = '', description, type = 'default', variant, duration = 5000 } = props
  
  // Map variant to type for compatibility
  let toastType: ToastType = type
  if (variant === 'destructive') {
    toastType = 'error'
  } else if (type === 'default') {
    toastType = 'info'
  }

  addToast({
    title,
    description,
    type: toastType,
    duration
  })
}

// Hook to use toast functionality
export function useToast(): { toast: typeof toast; toasts: ToastState[]; dismiss: (id: string) => void } {
  const [toastList, setToastList] = React.useState<ToastState[]>([])

  React.useEffect(() => {
    // Subscribe to toast changes
    const listener = (newToasts: ToastState[]) => {
      setToastList(newToasts)
    }
    
    listeners.push(listener)
    
    // Initialize with current toasts
    setToastList([...toasts])
    
    // Cleanup
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  return {
    toast,
    toasts: toastList,
    dismiss: removeToast
  }
}

// Additional helper functions for compatibility
export const useToastHelpers = () => ({
  toast: {
    success: (title: string, description?: string) => 
      toast({ title, description, type: 'success' }),
    error: (title: string, description?: string) => 
      toast({ title, description, type: 'error' }),
    warning: (title: string, description?: string) => 
      toast({ title, description, type: 'warning' }),
    info: (title: string, description?: string) => 
      toast({ title, description, type: 'info' }),
  }
})