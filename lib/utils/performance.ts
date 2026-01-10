/**
 * Performance optimization utilities
 */

// Debounce function for API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Throttle function for frequent operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Request queue for batching
class RequestQueue {
  private queue: Array<{
    request: () => Promise<any>
    resolve: (value: any) => void
    reject: (error: any) => void
  }> = []
  private processing = false
  private batchSize = 5
  private delay = 100 // ms

  add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject })
      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize)
      
      // Process batch in parallel
      const promises = batch.map(async ({ request, resolve, reject }) => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      await Promise.allSettled(promises)
      
      // Small delay between batches
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay))
      }
    }

    this.processing = false
  }
}

export const requestQueue = new RequestQueue()

// Memoization for expensive computations
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    
    return result
  }) as T
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics = new Map<string, number[]>()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      this.addMetric(label, duration)
    }
  }

  addMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    
    const values = this.metrics.get(label)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  getStats(label: string) {
    const values = this.metrics.get(label) || []
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]

    return {
      count: values.length,
      avg: Math.round(avg * 100) / 100,
      median: Math.round(median * 100) / 100,
      p95: Math.round(p95 * 100) / 100,
      min: sorted[0],
      max: sorted[sorted.length - 1]
    }
  }

  getAllStats() {
    const stats: Record<string, any> = {}
    for (const [label] of Array.from(this.metrics)) {
      stats[label] = this.getStats(label)
    }
    return stats
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()







