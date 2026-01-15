'use client'

import { DeviceType, Breakpoint, Orientation } from '@/app/(app)/preview/page'
import { cn } from '@/lib/utils'
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

interface PreviewHeaderProps {
  device: DeviceType
  breakpoint: Breakpoint
  orientation: Orientation
  onDeviceChange: (device: DeviceType) => void
  onBreakpointChange: (breakpoint: Breakpoint) => void
  onOrientationChange: (orientation: Orientation) => void
  onRefresh: () => void
  onOpenInNewTab: () => void
}

const devices: { id: DeviceType; label: string; icon?: any }[] = [
  { id: 'iPhone', label: 'iPhone', icon: DevicePhoneMobileIcon },
  { id: 'Android', label: 'Android', icon: DevicePhoneMobileIcon },
  { id: 'Responsive', label: 'Responsive', icon: ComputerDesktopIcon }
]

const breakpoints: { id: Breakpoint; label: string; description: string }[] = [
  { id: '390x844', label: '390×844', description: 'iPhone 14 Pro' },
  { id: '360x800', label: '360×800', description: 'Android Standard' },
  { id: '768x1024', label: '768×1024', description: 'iPad Portrait' }
]

const orientations: { id: Orientation; label: string }[] = [
  { id: 'Portrait', label: 'Portrait' },
  { id: 'Landscape', label: 'Landscape' }
]

export function PreviewHeader({
  device,
  breakpoint,
  orientation,
  onDeviceChange,
  onBreakpointChange,
  onOrientationChange,
  onRefresh,
  onOpenInNewTab
}: PreviewHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Device Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Device:</span>
              <div className="flex items-center bg-muted rounded-lg p-1">
                {devices.map((deviceOption) => (
                  <button
                    key={deviceOption.id}
                    onClick={() => onDeviceChange(deviceOption.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      device === deviceOption.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {deviceOption.icon && <deviceOption.icon className="w-4 h-4" />}
                    {deviceOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Breakpoint Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Size:</span>
              <select
                value={breakpoint}
                onChange={(e) => onBreakpointChange(e.target.value as Breakpoint)}
                className="px-3 py-1.5 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {breakpoints.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.label} ({bp.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Orientation Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Orientation:</span>
              <div className="flex items-center bg-muted rounded-lg p-1">
                {orientations.map((orientationOption) => (
                  <button
                    key={orientationOption.id}
                    onClick={() => onOrientationChange(orientationOption.id)}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      orientation === orientationOption.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {orientationOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={onOpenInNewTab}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}