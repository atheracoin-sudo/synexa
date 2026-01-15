'use client'

import { EnvironmentCheck } from '@/app/(app)/health/page'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  XCircle,
  Server,
  Key,
  Link,
  Cpu,
  Globe
} from 'lucide-react'

interface EnvironmentCardProps {
  data: EnvironmentCheck
}

export function EnvironmentCard({ data }: EnvironmentCardProps) {
  const checks = [
    {
      label: 'API Key',
      value: data.apiKey,
      icon: Key,
      isGood: data.apiKey === 'Found'
    },
    {
      label: 'Base URL',
      value: data.baseUrl,
      icon: Link,
      isGood: data.baseUrl === 'Set'
    },
    {
      label: 'Runtime',
      value: data.runtime,
      icon: Cpu,
      isGood: true // Runtime is informational
    },
    {
      label: 'Region',
      value: data.region,
      icon: Globe,
      isGood: true // Region is informational
    }
  ]

  const allGood = checks.filter(check => check.label === 'API Key' || check.label === 'Base URL').every(check => check.isGood)

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          allGood ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        )}>
          <Server className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Environment Check</h2>
          <p className="text-sm text-muted-foreground">
            {allGood ? 'Tüm ayarlar doğru yapılandırılmış' : 'Bazı ayarlar eksik veya hatalı'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <check.icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{check.label}:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-medium",
                check.isGood && (check.label === 'API Key' || check.label === 'Base URL') 
                  ? "text-green-600" 
                  : check.label === 'API Key' || check.label === 'Base URL'
                  ? "text-red-600"
                  : "text-foreground"
              )}>
                {check.value}
              </span>
              
              {(check.label === 'API Key' || check.label === 'Base URL') && (
                check.isGood ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {!allGood && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Uyarı:</strong> Eksik environment değişkenleri API çalışmasını engelleyebilir.
          </p>
        </div>
      )}
    </div>
  )
}