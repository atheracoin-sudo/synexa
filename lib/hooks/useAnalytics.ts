'use client'

import { useState, useEffect, useCallback } from 'react'
import { analyticsManager, AnalyticsData } from '@/lib/analytics'

export function useAnalytics(userId: string) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Load analytics data
  const loadAnalytics = useCallback(() => {
    try {
      const data = analyticsManager.getAnalyticsData(userId)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Initial load
  useEffect(() => {
    if (userId) {
      loadAnalytics()
    }
  }, [userId, loadAnalytics])

  // Log activity
  const logActivity = useCallback((type: string, metadata?: Record<string, any>) => {
    analyticsManager.logActivity(userId, type, metadata)
    loadAnalytics() // Refresh data
  }, [userId, loadAnalytics])

  // Get daily activity
  const getDailyActivity = useCallback((days: number = 7) => {
    return analyticsManager.getDailyActivity(userId, days)
  }, [userId])

  // Get most productive day
  const getMostProductiveDay = useCallback(() => {
    return analyticsManager.getMostProductiveDay(userId)
  }, [userId])

  // Get growth metrics
  const getGrowthMetrics = useCallback(() => {
    return analyticsManager.getGrowthMetrics(userId)
  }, [userId])

  // Get detailed breakdown
  const getDetailedBreakdown = useCallback((category: string) => {
    return analyticsManager.getDetailedBreakdown(userId, category)
  }, [userId])

  return {
    analyticsData,
    loading,
    logActivity,
    getDailyActivity,
    getMostProductiveDay,
    getGrowthMetrics,
    getDetailedBreakdown,
    refresh: loadAnalytics
  }
}





