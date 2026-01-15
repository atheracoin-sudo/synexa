'use client'

import { PingTest, TestStatus } from '@/app/(app)/health/page'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Wifi
} from 'lucide-react'

interface PingTestCardProps {
  pingTest: PingTest
  onRunTest: (result: { success: boolean; error?: string; duration: number }) => void
}

const getStatusConfig = (status: TestStatus) => {
  switch (status) {
    case 'success':
      return {
        label: 'Success',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
        description: 'API yanıt veriyor'
      }
    case 'failed':
      return {
        label: 'Failed',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: XCircle,
        description: 'API yanıt vermiyor'
      }
    case 'timeout':
      return {
        label: 'Timeout',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: Clock,
        description: 'Yanıt süresi çok uzun'
      }
    case 'running':
      return {
        label: 'Testing...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: RotateCcw,
        description: 'Test çalışıyor'
      }
    default:
      return {
        label: 'Not tested',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        icon: Wifi,
        description: 'Test henüz çalıştırılmadı'
      }
  }
}

export function PingTestCard({ pingTest, onRunTest }: PingTestCardProps) {
  const statusConfig = getStatusConfig(pingTest.status)
  const StatusIcon = statusConfig.icon

  const testChatAPI = async (): Promise<{ success: boolean; error?: string; duration: number }> => {
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'API test - lütfen kısa bir yanıt ver'
            }
          ]
        })
      })

      const duration = Date.now() - startTime

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`,
          duration
        }
      }

      const data = await response.json()
      
      if (!data.reply) {
        return {
          success: false,
          error: 'Geçersiz API yanıtı',
          duration
        }
      }

      return { success: true, duration }
    } catch (error: any) {
      const duration = Date.now() - startTime
      return {
        success: false,
        error: error.message || 'Network error',
        duration
      }
    }
  }

  const handleRunTest = async () => {
    const result = await testChatAPI()
    onRunTest(result)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          statusConfig.bgColor
        )}>
          <Wifi className={cn("w-6 h-6", statusConfig.color)} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">API Ping Test</h2>
          <p className="text-sm text-muted-foreground">
            API bağlantısını ve yanıt süresini test et
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Last Check */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="font-medium text-foreground">Last check:</span>
          <span className="text-sm text-muted-foreground">
            {pingTest.lastCheck || 'Never'}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="font-medium text-foreground">Status:</span>
          <div className="flex items-center gap-2">
            <StatusIcon className={cn(
              "w-4 h-4",
              statusConfig.color,
              pingTest.status === 'running' && "animate-spin"
            )} />
            <span className={cn("text-sm font-medium", statusConfig.color)}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Status Description */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {statusConfig.description}
          </p>
        </div>

        {/* Run Test Button */}
        <button
          onClick={handleRunTest}
          disabled={pingTest.status === 'running'}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors",
            pingTest.status === 'running'
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <RotateCcw className={cn(
            "w-4 h-4",
            pingTest.status === 'running' && "animate-spin"
          )} />
          {pingTest.status === 'running' ? 'Testing...' : 'Run Test'}
        </button>
      </div>

      {/* Additional Info for Failed/Timeout */}
      {(pingTest.status === 'failed' || pingTest.status === 'timeout') && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Sorun giderme:</strong> Environment ayarlarını kontrol edin veya aşağıdaki yaygın çözümleri deneyin.
          </p>
        </div>
      )}
    </div>
  )
}