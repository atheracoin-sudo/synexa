'use client'

import { useState } from 'react'
import { EnvironmentCard } from '@/components/health/EnvironmentCard'
import { PingTestCard } from '@/components/health/PingTestCard'
import { CommonFixesCard } from '@/components/health/CommonFixesCard'
import { HeartPulse } from 'lucide-react'

export type TestStatus = 'idle' | 'running' | 'success' | 'failed' | 'timeout'

export interface EnvironmentCheck {
  apiKey: 'Found' | 'Missing'
  baseUrl: 'Set' | 'Missing'
  runtime: 'Node' | 'Edge'
  region: string
}

export interface PingTest {
  lastCheck: string | null
  status: TestStatus
}

export default function HealthPage() {
  // Mock environment data
  const [environmentData] = useState<EnvironmentCheck>({
    apiKey: 'Found',
    baseUrl: 'Set',
    runtime: 'Node',
    region: 'Auto'
  })

  // Ping test state
  const [pingTest, setPingTest] = useState<PingTest>({
    lastCheck: '2024-01-15 14:32:15',
    status: 'success'
  })

  const handleRunTest = async (result: { success: boolean; error?: string; duration: number }) => {
    setPingTest(prev => ({ ...prev, status: 'running' }))
    
    // Wait a moment to show loading state
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let status: TestStatus = 'success'
    if (!result.success) {
      if (result.error?.includes('timeout') || result.error?.includes('zaman aşımı')) {
        status = 'timeout'
      } else {
        status = 'failed'
      }
    }
    
    setPingTest({
      lastCheck: new Date().toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      status
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <HeartPulse className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bağlantı & Dağıtım Durumu</h1>
          <p className="text-muted-foreground mt-1">
            API bağlantısı, environment ayarları ve yanıt sürelerini kontrol et.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environment Check Card */}
        <EnvironmentCard data={environmentData} />

        {/* API Ping Test Card */}
        <PingTestCard 
          pingTest={pingTest}
          onRunTest={handleRunTest}
        />
      </div>

      {/* Common Fixes Card - Full Width */}
      <CommonFixesCard />
    </div>
  )
}