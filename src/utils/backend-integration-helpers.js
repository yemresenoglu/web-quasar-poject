// Backend Integration Helpers
// Centralized error handling and fallback strategies for backend integration

import { createLogger } from './logger.js'
import { shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

const logger = createLogger('BackendIntegration')

/**
 * Backend Integration Error Types
 */
export const BackendErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

/**
 * Backend Integration Error Handler
 * Provides centralized error handling with fallback strategies
 */
export class BackendErrorHandler {
  /**
   * Handle API errors with fallback strategy
   * @param {Error} error - The error object
   * @param {string} operation - Operation name for logging
   * @param {Function} fallbackFunction - Fallback function to execute
   * @param {Object} context - Additional context for logging
   * @returns {Object} Error result with fallback data
   */
  static async handleError(error, operation, fallbackFunction, context = {}) {
    const errorType = this.classifyError(error)
    const errorInfo = this.extractErrorInfo(error)

    logger.error(`Backend ${operation} failed:`, {
      errorType,
      errorInfo,
      context,
      environment: getEnvironmentInfo().environment,
    })

    // Try fallback function
    if (fallbackFunction && typeof fallbackFunction === 'function') {
      try {
        logger.info(`Attempting fallback for ${operation}`)
        const fallbackResult = await fallbackFunction()

        logger.info(`Fallback successful for ${operation}`, {
          fallbackResult: !!fallbackResult,
          context,
        })

        return {
          success: true,
          data: fallbackResult,
          source: 'fallback',
          originalError: errorInfo,
        }
      } catch (fallbackError) {
        logger.error(`Fallback also failed for ${operation}:`, fallbackError)

        return {
          success: false,
          error: fallbackError.message,
          source: 'fallback_failed',
          originalError: errorInfo,
        }
      }
    }

    return {
      success: false,
      error: errorInfo.message,
      source: 'no_fallback',
      originalError: errorInfo,
    }
  }

  /**
   * Classify error type based on error properties
   * @param {Error} error - The error object
   * @returns {string} Error type
   */
  static classifyError(error) {
    if (!error) return BackendErrorTypes.UNKNOWN_ERROR

    // Network errors
    if (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('ERR_NETWORK')
    ) {
      return BackendErrorTypes.NETWORK_ERROR
    }

    // Timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return BackendErrorTypes.TIMEOUT_ERROR
    }

    // HTTP status based errors
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          return BackendErrorTypes.AUTHENTICATION_ERROR
        case 403:
          return BackendErrorTypes.AUTHORIZATION_ERROR
        case 400:
        case 422:
          return BackendErrorTypes.VALIDATION_ERROR
        case 500:
        case 502:
        case 503:
        case 504:
          return BackendErrorTypes.SERVER_ERROR
        default:
          return BackendErrorTypes.SERVER_ERROR
      }
    }

    return BackendErrorTypes.UNKNOWN_ERROR
  }

  /**
   * Extract error information for logging
   * @param {Error} error - The error object
   * @returns {Object} Error information
   */
  static extractErrorInfo(error) {
    if (!error) return { message: 'Unknown error' }

    return {
      message: error.message || 'Unknown error',
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
      },
    }
  }

  /**
   * Check if error is retryable
   * @param {Error} error - The error object
   * @returns {boolean} Whether the error is retryable
   */
  static isRetryableError(error) {
    const errorType = this.classifyError(error)

    const retryableErrors = [
      BackendErrorTypes.NETWORK_ERROR,
      BackendErrorTypes.TIMEOUT_ERROR,
      BackendErrorTypes.SERVER_ERROR,
    ]

    return retryableErrors.includes(errorType)
  }

  /**
   * Get retry delay based on error type and attempt number
   * @param {string} errorType - The error type
   * @param {number} attemptNumber - Current attempt number (1-based)
   * @returns {number} Delay in milliseconds
   */
  static getRetryDelay(errorType, attemptNumber) {
    const baseDelay = 1000 // 1 second

    switch (errorType) {
      case BackendErrorTypes.NETWORK_ERROR:
        return baseDelay * Math.pow(2, attemptNumber - 1) // Exponential backoff
      case BackendErrorTypes.TIMEOUT_ERROR:
        return baseDelay * attemptNumber // Linear backoff
      case BackendErrorTypes.SERVER_ERROR:
        return baseDelay * 2 // Fixed 2 second delay
      default:
        return baseDelay
    }
  }
}

/**
 * Backend Integration Retry Handler
 * Provides retry functionality with exponential backoff
 */
export class BackendRetryHandler {
  /**
   * Execute function with retry logic
   * @param {Function} fn - Function to execute
   * @param {Object} options - Retry options
   * @param {number} options.maxRetries - Maximum number of retries (default: 3)
   * @param {number} options.baseDelay - Base delay in ms (default: 1000)
   * @param {Function} options.retryCondition - Custom retry condition function
   * @returns {Promise} Function result
   */
  static async executeWithRetry(fn, options = {}) {
    const {
      maxRetries = 3,
      // baseDelay = 1000, // Unused for now
      retryCondition = BackendErrorHandler.isRetryableError,
    } = options

    let lastError

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const result = await fn()

        if (attempt > 1) {
          logger.info(`Operation succeeded on attempt ${attempt}`)
        }

        return result
      } catch (error) {
        lastError = error

        // Check if we should retry
        if (attempt > maxRetries || !retryCondition(error)) {
          logger.error(`Operation failed after ${attempt} attempts`, {
            error: BackendErrorHandler.extractErrorInfo(error),
            maxRetries,
          })
          throw error
        }

        // Calculate delay for next attempt
        const errorType = BackendErrorHandler.classifyError(error)
        const delay = BackendErrorHandler.getRetryDelay(errorType, attempt)

        logger.warn(`Operation failed on attempt ${attempt}, retrying in ${delay}ms`, {
          error: BackendErrorHandler.extractErrorInfo(error),
          nextAttempt: attempt + 1,
          maxRetries,
        })

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}

/**
 * Backend Integration Fallback Manager
 * Manages fallback strategies for different operations
 */
export class BackendFallbackManager {
  /**
   * Execute operation with fallback strategy
   * @param {Function} primaryOperation - Primary operation function
   * @param {Function} fallbackOperation - Fallback operation function
   * @param {Object} options - Fallback options
   * @param {boolean} options.alwaysTryFallback - Always try fallback even on success
   * @returns {Promise} Operation result
   */
  static async executeWithFallback(primaryOperation, fallbackOperation, options = {}) {
    const { alwaysTryFallback = false } = options

    try {
      const result = await primaryOperation()

      if (alwaysTryFallback) {
        // Try fallback operation for comparison or validation
        try {
          await fallbackOperation()
          logger.info('Fallback operation completed for comparison', {
            primarySuccess: true,
            fallbackSuccess: true,
          })
        } catch (fallbackError) {
          logger.warn('Fallback operation failed during comparison', fallbackError)
        }
      }

      return {
        success: true,
        data: result,
        source: 'primary',
      }
    } catch (primaryError) {
      logger.warn('Primary operation failed, attempting fallback', {
        error: BackendErrorHandler.extractErrorInfo(primaryError),
      })

      try {
        const fallbackResult = await fallbackOperation()

        return {
          success: true,
          data: fallbackResult,
          source: 'fallback',
          originalError: BackendErrorHandler.extractErrorInfo(primaryError),
        }
      } catch (fallbackError) {
        logger.error('Both primary and fallback operations failed', {
          primaryError: BackendErrorHandler.extractErrorInfo(primaryError),
          fallbackError: BackendErrorHandler.extractErrorInfo(fallbackError),
        })

        throw primaryError // Throw the original error
      }
    }
  }
}

/**
 * Backend Integration Health Monitor
 * Monitors backend health and provides status information
 */
export class BackendHealthMonitor {
  static healthStatus = {
    isHealthy: true,
    lastCheck: null,
    consecutiveFailures: 0,
    responseTime: null,
  }

  /**
   * Check backend health
   * @param {Function} healthCheckFunction - Health check function
   * @returns {Promise<Object>} Health status
   */
  static async checkHealth(healthCheckFunction) {
    const startTime = Date.now()

    try {
      await healthCheckFunction()
      const responseTime = Date.now() - startTime

      this.healthStatus = {
        isHealthy: true,
        lastCheck: new Date().toISOString(),
        consecutiveFailures: 0,
        responseTime,
      }

      logger.info('Backend health check passed', { responseTime })

      return {
        healthy: true,
        responseTime,
        timestamp: this.healthStatus.lastCheck,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      this.healthStatus = {
        isHealthy: false,
        lastCheck: new Date().toISOString(),
        consecutiveFailures: this.healthStatus.consecutiveFailures + 1,
        responseTime,
      }

      logger.error('Backend health check failed', {
        error: BackendErrorHandler.extractErrorInfo(error),
        responseTime,
        consecutiveFailures: this.healthStatus.consecutiveFailures,
      })

      return {
        healthy: false,
        responseTime,
        timestamp: this.healthStatus.lastCheck,
        error: BackendErrorHandler.extractErrorInfo(error),
      }
    }
  }

  /**
   * Get current health status
   * @returns {Object} Current health status
   */
  static getHealthStatus() {
    return { ...this.healthStatus }
  }

  /**
   * Check if backend is currently healthy
   * @returns {boolean} Whether backend is healthy
   */
  static isHealthy() {
    return this.healthStatus.isHealthy
  }
}

/**
 * Backend Integration Configuration Manager
 * Manages backend integration configuration and settings
 */
export class BackendConfigManager {
  /**
   * Get integration configuration
   * @returns {Object} Integration configuration
   */
  static getConfig() {
    const envInfo = getEnvironmentInfo()

    return {
      environment: envInfo.environment,
      useMockData: shouldUseMockData(),
      baseUrl: envInfo.baseUrl,
      timeout: envInfo.timeout,
      enableLogging: envInfo.enableLogging,
      retryConfig: {
        maxRetries: 3,
        baseDelay: 1000,
        enableRetry: true,
      },
      fallbackConfig: {
        enableFallback: true,
        alwaysTryFallback: false,
      },
      healthCheckConfig: {
        enableHealthCheck: true,
        healthCheckInterval: 30000, // 30 seconds
        healthCheckTimeout: 5000, // 5 seconds
      },
    }
  }

  /**
   * Update integration configuration
   * @param {Object} updates - Configuration updates
   */
  static updateConfig(updates) {
    // This would typically update environment variables or config files
    logger.info('Backend configuration updated', updates)
  }
}

export default {
  BackendErrorHandler,
  BackendRetryHandler,
  BackendFallbackManager,
  BackendHealthMonitor,
  BackendConfigManager,
  BackendErrorTypes,
}
