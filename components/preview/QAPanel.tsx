'use client'

import { useState, useEffect } from 'react'
import { QACheck } from '@/app/(app)/preview/page'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  AlertTriangle,
  MousePointer,
  Type,
  Eye,
  Shield,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface QAPanelProps {
  checks: QACheck[]
}

const checkIcons = {
  'Tap targets check': MousePointer,
  'Font scaling': Type,
  'Contrast check': Eye,
  'Safe area check': Shield
}

export function QAPanel({ checks }: QAPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [shouldAutoCollapse, setShouldAutoCollapse] = useState(false)

  const okCount = checks.filter(check => check.status === 'OK').length
  const warnCount = checks.filter(check => check.status === 'Warn').length

  // Auto-collapse on smaller screen heights
  useEffect(() => {
    const checkScreenHeight = () => {
      const shouldCollapse = window.innerHeight < 700 // Auto-collapse below 700px height
      setShouldAutoCollapse(shouldCollapse)
      if (shouldCollapse && isExpanded) {
        setIsExpanded(false)
      }
    }

    checkScreenHeight()
    window.addEventListener('resize', checkScreenHeight)
    return () => window.removeEventListener('resize', checkScreenHeight)
  }, [isExpanded])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="border-t border-border bg-background">
      {/* Header - Always visible */}
      <div className="p-4 pb-0">
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-foreground">Mobile QA Checks</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">{okCount} OK</span>
              </div>
              {warnCount > 0 && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-muted-foreground">{warnCount} Warnings</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {shouldAutoCollapse && (
              <span className="text-xs text-muted-foreground">Auto-collapsed</span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {checks.map((check) => {
              const Icon = checkIcons[check.name as keyof typeof checkIcons] || CheckCircle
              const isOK = check.status === 'OK'
              
              return (
                <div
                  key={check.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                    isOK 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full',
                    isOK ? 'bg-green-100' : 'bg-yellow-100'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {check.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {isOK ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-600" />
                      )}
                      <span className="text-xs font-medium">
                        {check.status}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              QA checks are automatically run when screens are updated. 
              <button className="text-primary hover:underline ml-1">
                Learn more about mobile accessibility
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}