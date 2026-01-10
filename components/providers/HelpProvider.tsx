'use client'

import { useState, useEffect } from 'react'
import { GlobalHelpModal } from '@/components/help/GlobalHelpModal'

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  useEffect(() => {
    const handleOpenHelp = () => {
      setIsHelpOpen(true)
    }

    window.addEventListener('openGlobalHelp', handleOpenHelp)
    return () => window.removeEventListener('openGlobalHelp', handleOpenHelp)
  }, [])

  return (
    <>
      {children}
      <GlobalHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  )
}





