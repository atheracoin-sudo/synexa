'use client'

import { DeviceType } from '@/app/(app)/preview/page'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {
  DevicePhoneMobileIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface PhoneFrameProps {
  device: DeviceType
  dimensions: { width: number; height: number }
  hasScreens: boolean
  selectedScreen?: { id: string; name: string; type: string } | null
}

export function PhoneFrame({ device, dimensions, hasScreens, selectedScreen }: PhoneFrameProps) {
  const router = useRouter()

  const handleGoToStudio = () => {
    router.push('/studio')
  }

  // Calculate frame size with padding for device chrome
  const frameWidth = dimensions.width + 40
  const frameHeight = dimensions.height + 80

  if (!hasScreens) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <DevicePhoneMobileIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Mobil önizleme hazır değil
          </h2>
          <p className="text-muted-foreground mb-6">
            Studio'da en az 1 ekran oluştur ve 'Preview'e gönder.
          </p>
          <button
            onClick={handleGoToStudio}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Studio
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Screen Info */}
      {selectedScreen && (
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">{selectedScreen.name}</h3>
          <p className="text-sm text-muted-foreground">
            {dimensions.width} × {dimensions.height} • {device}
          </p>
        </div>
      )}

      {/* Phone Frame */}
      <div
        className={cn(
          'relative bg-gray-900 rounded-3xl shadow-2xl',
          device === 'iPhone' && 'bg-gray-900',
          device === 'Android' && 'bg-gray-800',
          device === 'Responsive' && 'bg-gray-700 rounded-lg'
        )}
        style={{
          width: frameWidth,
          height: frameHeight,
          maxWidth: '90vw',
          maxHeight: '70vh'
        }}
      >
        {/* Device Chrome */}
        {device !== 'Responsive' && (
          <>
            {/* Top notch/camera (iPhone style) */}
            {device === 'iPhone' && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full" />
            )}
            
            {/* Android status bar */}
            {device === 'Android' && (
              <div className="absolute top-2 left-4 right-4 h-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                  <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                  <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-white opacity-60 rounded-sm" />
                  <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Screen Content */}
        <div
          className={cn(
            'absolute bg-white rounded-2xl overflow-hidden',
            device === 'Responsive' && 'rounded-lg'
          )}
          style={{
            top: device === 'Responsive' ? 20 : 40,
            left: 20,
            right: 20,
            bottom: device === 'Responsive' ? 20 : 40,
            width: dimensions.width,
            height: dimensions.height
          }}
        >
          {/* Mock Screen Content */}
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg" />
              <div className="w-6 h-6 bg-muted rounded-full" />
            </div>

            {/* Mock Content */}
            <div className="space-y-4">
              <div className="h-8 bg-white rounded-lg shadow-sm" />
              <div className="h-6 bg-white/70 rounded-lg w-3/4" />
              <div className="h-6 bg-white/70 rounded-lg w-1/2" />
              
              <div className="mt-8 space-y-3">
                <div className="h-16 bg-white rounded-xl shadow-sm p-4">
                  <div className="h-3 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-2 bg-muted/60 rounded w-2/3" />
                </div>
                <div className="h-16 bg-white rounded-xl shadow-sm p-4">
                  <div className="h-3 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-2 bg-muted/60 rounded w-3/4" />
                </div>
                <div className="h-16 bg-white rounded-xl shadow-sm p-4">
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-2 bg-muted/60 rounded w-1/2" />
                </div>
              </div>
            </div>

            {/* Mock Bottom Navigation */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white rounded-full shadow-lg p-2 flex items-center justify-around">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="w-8 h-8 bg-muted rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Device Home Indicator (iPhone) */}
        {device === 'iPhone' && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60" />
        )}
      </div>
    </div>
  )
}