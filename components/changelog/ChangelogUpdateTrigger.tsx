'use client'

import { useEffect } from 'react'
import { useChangelog } from '@/lib/hooks/useChangelog'
import { useNotifications } from '@/lib/hooks/useNotifications'

interface ChangelogUpdateTriggerProps {
  userId: string
}

export default function ChangelogUpdateTrigger({ userId }: ChangelogUpdateTriggerProps) {
  const { latestVersion, shouldShowWhatsNew, getVersionSummary } = useChangelog(userId)
  const { addNotification } = useNotifications(userId)

  useEffect(() => {
    // Temporarily disabled to prevent infinite loop
    // TODO: Fix dependency array issue
    return
    
    // Check if we should notify about the latest version
    if (latestVersion && shouldShowWhatsNew) {
      // Add notification for the latest version
      const summary = getVersionSummary(latestVersion?.id || '')
      
      addNotification({
        type: 'updates',
        priority: 'medium',
        title: 'Yeni özellikler eklendi 🚀',
        message: `${latestVersion?.title}: ${summary}`,
        icon: 'Sparkles',
        actionUrl: '/changelog',
        actionText: 'Gör',
        metadata: {
          versionId: latestVersion?.id || '',
          versionTitle: latestVersion?.title || '',
          summary
        }
      })
    }
  }, [latestVersion, shouldShowWhatsNew])

  // This component doesn't render anything, it just triggers notifications
  return null
}

// Hook for manually triggering feature notifications
export function useFeatureNotifications(userId: string) {
  const { addNotification } = useNotifications(userId)

  const notifyFeatureUpdate = (
    featureTitle: string, 
    featureDescription: string, 
    actionUrl?: string
  ) => {
    addNotification({
      type: 'updates',
      priority: 'low',
      title: `${featureTitle} artık kullanılabilir ✨`,
      message: featureDescription,
      icon: 'Sparkles',
      actionUrl: actionUrl || '/changelog',
      actionText: 'Keşfet',
      metadata: {
        featureTitle,
        featureDescription
      }
    })
  }

  const notifyVersionUpdate = (
    versionTitle: string,
    summary: string,
    versionId: string
  ) => {
    addNotification({
      type: 'updates',
      priority: 'medium',
      title: 'Yeni sürüm yayınlandı 🚀',
      message: `${versionTitle}: ${summary}`,
      icon: 'Sparkles',
      actionUrl: '/changelog',
      actionText: 'Gör',
      metadata: {
        versionId,
        versionTitle,
        summary
      }
    })
  }

  return {
    notifyFeatureUpdate,
    notifyVersionUpdate
  }
}
