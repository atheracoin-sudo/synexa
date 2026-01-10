'use client'

import { useEffect } from 'react'

export default function AgentsPage() {
  useEffect(() => {
    // Redirect to simple version for MVP
    window.location.href = '/agents/simple'
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}