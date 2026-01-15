'use client'

import { useState } from 'react'
import { PreviewHeader } from '@/components/preview/PreviewHeader'
import { PhoneFrame } from '@/components/preview/PhoneFrame'
import { QAPanel } from '@/components/preview/QAPanel'

export type DeviceType = 'iPhone' | 'Android' | 'Responsive'
export type Breakpoint = '390x844' | '360x800' | '768x1024'
export type Orientation = 'Portrait' | 'Landscape'

export interface QACheck {
  id: string
  name: string
  status: 'OK' | 'Warn'
}

// Mock data - in real app this would come from Studio state
const mockScreens = [
  { id: '1', name: 'Login Screen', type: 'screen' },
  { id: '2', name: 'Dashboard', type: 'screen' }
]

const qaChecks: QACheck[] = [
  { id: '1', name: 'Tap targets check', status: 'OK' },
  { id: '2', name: 'Font scaling', status: 'Warn' },
  { id: '3', name: 'Contrast check', status: 'OK' },
  { id: '4', name: 'Safe area check', status: 'OK' }
]

export default function PreviewPage() {
  const [device, setDevice] = useState<DeviceType>('iPhone')
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('390x844')
  const [orientation, setOrientation] = useState<Orientation>('Portrait')
  const [selectedScreen, setSelectedScreen] = useState<string | null>(
    mockScreens.length > 0 ? mockScreens[0].id : null
  )

  // Mock: Check if there are screens available from Studio
  const hasScreens = mockScreens.length > 0

  const handleRefresh = () => {
    // Mock refresh functionality
    console.log('Refreshing preview...')
  }

  const handleOpenInNewTab = () => {
    // Mock open in new tab functionality
    window.open('/preview', '_blank')
  }

  const getFrameDimensions = () => {
    const [width, height] = breakpoint.split('x').map(Number)
    return orientation === 'Portrait' ? { width, height } : { width: height, height: width }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Controls */}
      <div className="flex-shrink-0">
        <PreviewHeader
          device={device}
          breakpoint={breakpoint}
          orientation={orientation}
          onDeviceChange={setDevice}
          onBreakpointChange={setBreakpoint}
          onOrientationChange={setOrientation}
          onRefresh={handleRefresh}
          onOpenInNewTab={handleOpenInNewTab}
        />
      </div>

      {/* Main Preview Area - Flex-1 with proper overflow */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20 min-h-0 overflow-hidden">
        <PhoneFrame
          device={device}
          dimensions={getFrameDimensions()}
          hasScreens={hasScreens}
          selectedScreen={selectedScreen ? mockScreens.find(s => s.id === selectedScreen) : null}
        />
      </div>

      {/* Bottom QA Panel - Collapsible */}
      {hasScreens && (
        <div className="flex-shrink-0">
          <QAPanel checks={qaChecks} />
        </div>
      )}
    </div>
  )
}