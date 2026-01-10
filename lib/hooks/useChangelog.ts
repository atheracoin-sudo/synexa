'use client'

import { useState, useEffect } from 'react'
import { changelogManager, ChangelogVersion, WhatsNewItem } from '@/lib/changelog'

export function useChangelog(userId: string = 'demo_user') {
  const [versions, setVersions] = useState<ChangelogVersion[]>([])
  const [latestVersion, setLatestVersion] = useState<ChangelogVersion | null>(null)
  const [whatsNewItems, setWhatsNewItems] = useState<WhatsNewItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [shouldShowWhatsNew, setShouldShowWhatsNew] = useState(false)
  const [newFeatures, setNewFeatures] = useState<{ [key: string]: { title: string; daysLeft: number } }>({})

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = () => {
    const allVersions = changelogManager.getChangelogVersions()
    const latest = changelogManager.getLatestVersion()
    const whatsNew = changelogManager.getWhatsNewItems()
    const unread = changelogManager.getUnreadVersionsCount(userId)
    const showModal = changelogManager.shouldShowWhatsNew(userId)
    const features = changelogManager.getNewFeatures()

    setVersions(allVersions)
    setLatestVersion(latest)
    setWhatsNewItems(whatsNew)
    setUnreadCount(unread)
    setShouldShowWhatsNew(showModal)
    setNewFeatures(features)
  }

  const markVersionAsSeen = (versionId: string) => {
    changelogManager.markVersionAsSeen(userId, versionId)
    loadData() // Refresh data
  }

  const markLatestVersionAsSeen = () => {
    if (latestVersion) {
      markVersionAsSeen(latestVersion.id)
    }
  }

  const getVersion = (versionId: string) => {
    return changelogManager.getVersion(versionId)
  }

  const hasSeenVersion = (versionId: string) => {
    return changelogManager.hasSeenLatestVersion(userId)
  }

  const getUpdateTypeColor = (type: 'new' | 'improved' | 'fixed') => {
    return changelogManager.getUpdateTypeColor(type)
  }

  const getUpdateTypeText = (type: 'new' | 'improved' | 'fixed') => {
    return changelogManager.getUpdateTypeText(type)
  }

  const getCategoryIcon = (category: string) => {
    return changelogManager.getCategoryIcon(category as any)
  }

  const formatDate = (dateString: string) => {
    return changelogManager.formatDate(dateString)
  }

  const getVersionSummary = (versionId: string) => {
    return changelogManager.getVersionSummary(versionId)
  }

  const isFeatureNew = (featureId: string) => {
    return featureId in newFeatures
  }

  const getFeatureNewBadge = (featureId: string) => {
    return newFeatures[featureId] || null
  }

  return {
    // Data
    versions,
    latestVersion,
    whatsNewItems,
    unreadCount,
    shouldShowWhatsNew,
    newFeatures,

    // Actions
    markVersionAsSeen,
    markLatestVersionAsSeen,
    loadData,

    // Utilities
    getVersion,
    hasSeenVersion,
    getUpdateTypeColor,
    getUpdateTypeText,
    getCategoryIcon,
    formatDate,
    getVersionSummary,
    isFeatureNew,
    getFeatureNewBadge
  }
}






