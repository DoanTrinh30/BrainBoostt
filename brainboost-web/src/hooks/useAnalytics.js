import { useState, useEffect } from 'react'
import { analyticsService } from '../services/analyticsService'

export const useAnalytics = () => {
  const [stats, setStats] = useState(null)
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Lấy dữ liệu song song
      const [statsData, activityData, insightsData] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getWeeklyActivity(),
        analyticsService.getInsights()
      ])

      setStats(statsData)
      setWeeklyActivity(activityData || [])
      setInsights(insightsData)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { stats, weeklyActivity, insights, loading, error, refetch: fetchAnalyticsData }
}