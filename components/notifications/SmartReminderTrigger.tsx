'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { usePremium } from '@/lib/hooks/usePremium'

interface SmartReminderTriggerProps {
  userId: string
}

export function SmartReminderTrigger({ userId }: SmartReminderTriggerProps) {
  const { checkSmartReminders } = useNotifications(userId)
  const { analyticsData } = useAnalytics('user_1')
  const { userPlan } = usePremium()

  useEffect(() => {
    // Only check if analytics data is loaded
    if (!analyticsData) return

    // Check smart reminders every 30 minutes
    const checkReminders = () => {
      const userData = {
        lastActiveDate: localStorage.getItem('synexa_last_active') || new Date().toISOString(),
        incompleteProjects: getIncompleteProjectsCount(),
        chatMessages: analyticsData.usageMetrics?.chatMessages || 0,
        chatLimit: userPlan.limits?.chatMessages || 100,
        imageDesigns: analyticsData.usageMetrics?.imageDesigns || 0,
        codeProjects: analyticsData.usageMetrics?.codeProjects || 0
      }

      checkSmartReminders(userData)
    }

    // Initial check
    checkReminders()

    // Set up interval for periodic checks
    const interval = setInterval(checkReminders, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(interval)
  }, [checkSmartReminders, analyticsData, userPlan])

  // Update last active time
  useEffect(() => {
    const updateLastActive = () => {
      localStorage.setItem('synexa_last_active', new Date().toISOString())
    }

    // Update on component mount
    updateLastActive()

    // Update on user activity
    const events = ['click', 'keypress', 'scroll', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, updateLastActive, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateLastActive)
      })
    }
  }, [])

  // This component doesn't render anything
  return null
}

// Helper function to get incomplete projects count
function getIncompleteProjectsCount(): number {
  try {
    // Check for incomplete projects in localStorage
    const codeProjects = JSON.parse(localStorage.getItem('synexa_code_projects') || '[]')
    const imageProjects = JSON.parse(localStorage.getItem('synexa_image_projects') || '[]')
    
    const incompleteCode = codeProjects.filter((p: any) => p.status === 'draft' || p.status === 'incomplete').length
    const incompleteImages = imageProjects.filter((p: any) => p.status === 'draft' || p.status === 'incomplete').length
    
    return incompleteCode + incompleteImages
  } catch (error) {
    console.error('Failed to get incomplete projects count:', error)
    return 0
  }
}
