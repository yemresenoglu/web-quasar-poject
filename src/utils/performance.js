/**
 * Performance Monitoring Utility
 * 
 * Tracks Core Web Vitals and reports performance metrics
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals'
import { createLogger } from './logger'

const logger = createLogger('Performance')

/**
 * Report Web Vital metric
 * @param {Object} metric - Web Vital metric object
 */
function reportWebVital(metric) {
  const { name, value, rating, delta, id } = metric
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    logger.info(`${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      id
    })
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to your analytics service
    // Example: Google Analytics
    if (window.gtag) {
      window.gtag('event', name, {
        value: Math.round(value),
        metric_id: id,
        metric_value: value,
        metric_delta: delta,
        metric_rating: rating
      })
    }
    
    // Example: Custom analytics endpoint
    // fetch('/api/analytics/vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' }
    // })
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  // Only run in browser
  if (typeof window === 'undefined') return
  
  logger.info('📊 Performance monitoring initialized')
  
  // Track Core Web Vitals
  onCLS(reportWebVital)  // Cumulative Layout Shift
  onFCP(reportWebVital)  // First Contentful Paint
  onFID(reportWebVital)  // First Input Delay
  onINP(reportWebVital)  // Interaction to Next Paint
  onLCP(reportWebVital)  // Largest Contentful Paint
  onTTFB(reportWebVital) // Time to First Byte
}

/**
 * Measure custom performance metrics
 * @param {string} name - Metric name
 * @param {Function} fn - Function to measure
 */
export async function measurePerformance(name, fn) {
  const startTime = performance.now()
  
  try {
    const result = await fn()
    const duration = performance.now() - startTime
    
    logger.info(`⏱️ ${name}:`, `${Math.round(duration)}ms`)
    
    // Mark in Performance API
    if (performance.mark) {
      performance.mark(`${name}-start`)
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    logger.error(`❌ ${name} failed:`, `${Math.round(duration)}ms`, error)
    throw error
  }
}

/**
 * Get performance entries
 * @param {string} type - Entry type (navigation, resource, mark, measure)
 * @returns {Array} Performance entries
 */
export function getPerformanceEntries(type) {
  if (typeof performance === 'undefined') return []
  
  if (type) {
    return performance.getEntriesByType(type)
  }
  
  return performance.getEntries()
}

/**
 * Clear performance entries
 */
export function clearPerformanceEntries() {
  if (typeof performance === 'undefined') return
  
  if (performance.clearMarks) {
    performance.clearMarks()
  }
  
  if (performance.clearMeasures) {
    performance.clearMeasures()
  }
  
  if (performance.clearResourceTimings) {
    performance.clearResourceTimings()
  }
  
  logger.info('🧹 Performance entries cleared')
}

/**
 * Get memory usage (Chrome only)
 * @returns {Object|null} Memory usage info
 */
export function getMemoryUsage() {
  if (typeof performance === 'undefined') return null
  if (!performance.memory) return null
  
  return {
    usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
    totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
    jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
  }
}

/**
 * Log current performance metrics
 */
export function logPerformanceMetrics() {
  const memory = getMemoryUsage()
  const navigation = getPerformanceEntries('navigation')[0]
  const resources = getPerformanceEntries('resource')
  
  logger.info('📊 Performance Metrics:', {
    memory,
    navigation: navigation ? {
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd),
      loadComplete: Math.round(navigation.loadEventEnd),
      domInteractive: Math.round(navigation.domInteractive)
    } : null,
    resourceCount: resources.length
  })
}

export default {
  initPerformanceMonitoring,
  measurePerformance,
  getPerformanceEntries,
  clearPerformanceEntries,
  getMemoryUsage,
  logPerformanceMetrics
}

