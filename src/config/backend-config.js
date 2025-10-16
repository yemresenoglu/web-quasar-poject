// Backend Configuration
// Centralized configuration management for backend integration

import { getEnvironmentInfo } from 'src/constants/api.js'

/**
 * Backend Configuration Manager
 * Provides centralized configuration management for backend integration
 */
export class BackendConfig {
  constructor() {
    this.config = this.loadConfiguration()
  }

  /**
   * Load configuration from environment variables and defaults
   * @returns {Object} Configuration object
   */
  loadConfiguration() {
    const envInfo = getEnvironmentInfo()

    return {
      // Environment Settings
      environment: envInfo.environment,
      isDevelopment: envInfo.environment === 'development',
      isProduction: envInfo.environment === 'production',

      // API Configuration
      api: {
        baseUrl: envInfo.baseUrl,
        timeout: parseInt(process.env.VUE_APP_API_TIMEOUT) || 30000,
        retryMax: parseInt(process.env.VUE_APP_BACKEND_RETRY_MAX) || 3,
        retryDelay: parseInt(process.env.VUE_APP_BACKEND_RETRY_DELAY) || 1000,
        enableRetry: process.env.VUE_APP_BACKEND_RETRY_ENABLED !== 'false',
      },

      // Mock Data Configuration
      mock: {
        enabled:
          process.env.VUE_APP_USE_MOCK_DATA === 'true' || envInfo.environment === 'development',
        delay: parseInt(process.env.VUE_APP_MOCK_DELAY) || 500,
        errorRate: parseFloat(process.env.VUE_APP_MOCK_ERROR_RATE) || 0,
        enableRandomErrors: process.env.VUE_APP_MOCK_RANDOM_ERRORS === 'true',
      },

      // Authentication Configuration
      auth: {
        sessionTimeout: parseInt(process.env.VUE_APP_AUTH_SESSION_TIMEOUT) || 28800000, // 8 hours
        refreshThreshold: parseInt(process.env.VUE_APP_AUTH_REFRESH_THRESHOLD) || 300000, // 5 minutes
        captchaEnabled: process.env.VUE_APP_CAPTCHA_ENABLED === 'true',
        enableAutoRefresh: process.env.VUE_APP_AUTH_AUTO_REFRESH !== 'false',
      },

      // Health Check Configuration
      healthCheck: {
        enabled: process.env.VUE_APP_BACKEND_HEALTH_CHECK_ENABLED !== 'false',
        interval: parseInt(process.env.VUE_APP_BACKEND_HEALTH_CHECK_INTERVAL) || 30000,
        timeout: parseInt(process.env.VUE_APP_BACKEND_HEALTH_CHECK_TIMEOUT) || 5000,
        endpoint: process.env.VUE_APP_BACKEND_HEALTH_CHECK_ENDPOINT || '/health',
      },

      // Logging Configuration
      logging: {
        enabled:
          process.env.VUE_APP_ENABLE_LOGGING === 'true' || envInfo.environment === 'development',
        level:
          process.env.VUE_APP_LOG_LEVEL ||
          (envInfo.environment === 'development' ? 'debug' : 'error'),
        enablePerformance: process.env.VUE_APP_LOG_PERFORMANCE === 'true',
        enableNetwork: process.env.VUE_APP_LOG_NETWORK === 'true',
      },

      // Debug Configuration
      debug: {
        enabled: process.env.VUE_APP_DEBUG_MODE === 'true' || envInfo.environment === 'development',
        enableApiLogging: process.env.VUE_APP_DEBUG_API_LOGGING === 'true',
        enableStateLogging: process.env.VUE_APP_DEBUG_STATE_LOGGING === 'true',
        enableErrorTracking: process.env.VUE_APP_DEBUG_ERROR_TRACKING === 'true',
      },

      // Feature Flags
      features: {
        enableOfflineMode: process.env.VUE_APP_FEATURE_OFFLINE_MODE === 'true',
        enableRealTimeUpdates: process.env.VUE_APP_FEATURE_REALTIME_UPDATES !== 'false',
        enableNotifications: process.env.VUE_APP_FEATURE_NOTIFICATIONS !== 'false',
        enableAnalytics: process.env.VUE_APP_FEATURE_ANALYTICS === 'true',
      },
    }
  }

  /**
   * Get configuration value by path
   * @param {string} path - Configuration path (e.g., 'api.timeout')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = null) {
    return path.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : defaultValue
    }, this.config)
  }

  /**
   * Set configuration value by path
   * @param {string} path - Configuration path (e.g., 'api.timeout')
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {}
      return obj[key]
    }, this.config)
    target[lastKey] = value
  }

  /**
   * Get API configuration
   * @returns {Object} API configuration
   */
  getApiConfig() {
    return this.get('api', {})
  }

  /**
   * Get mock data configuration
   * @returns {Object} Mock data configuration
   */
  getMockConfig() {
    return this.get('mock', {})
  }

  /**
   * Get authentication configuration
   * @returns {Object} Authentication configuration
   */
  getAuthConfig() {
    return this.get('auth', {})
  }

  /**
   * Get health check configuration
   * @returns {Object} Health check configuration
   */
  getHealthCheckConfig() {
    return this.get('healthCheck', {})
  }

  /**
   * Get logging configuration
   * @returns {Object} Logging configuration
   */
  getLoggingConfig() {
    return this.get('logging', {})
  }

  /**
   * Get debug configuration
   * @returns {Object} Debug configuration
   */
  getDebugConfig() {
    return this.get('debug', {})
  }

  /**
   * Get feature flags
   * @returns {Object} Feature flags
   */
  getFeatures() {
    return this.get('features', {})
  }

  /**
   * Check if feature is enabled
   * @param {string} feature - Feature name
   * @returns {boolean} Whether feature is enabled
   */
  isFeatureEnabled(feature) {
    return this.get(`features.${feature}`, false)
  }

  /**
   * Check if mock data is enabled
   * @returns {boolean} Whether mock data is enabled
   */
  isMockEnabled() {
    return this.get('mock.enabled', false)
  }

  /**
   * Check if debug mode is enabled
   * @returns {boolean} Whether debug mode is enabled
   */
  isDebugEnabled() {
    return this.get('debug.enabled', false)
  }

  /**
   * Check if logging is enabled
   * @returns {boolean} Whether logging is enabled
   */
  isLoggingEnabled() {
    return this.get('logging.enabled', false)
  }

  /**
   * Get full configuration object
   * @returns {Object} Full configuration
   */
  getFullConfig() {
    return { ...this.config }
  }

  /**
   * Update configuration
   * @param {Object} updates - Configuration updates
   */
  updateConfig(updates) {
    this.config = { ...this.config, ...updates }
  }

  /**
   * Reset configuration to defaults
   */
  resetConfig() {
    this.config = this.loadConfiguration()
  }

  /**
   * Validate configuration
   * @returns {Object} Validation result
   */
  validateConfig() {
    const errors = []
    const warnings = []

    // Validate API configuration
    if (!this.get('api.baseUrl')) {
      errors.push('API base URL is required')
    }

    if (this.get('api.timeout') < 1000) {
      warnings.push('API timeout is very low (< 1 second)')
    }

    // Validate authentication configuration
    if (this.get('auth.sessionTimeout') < 3600000) {
      warnings.push('Session timeout is very low (< 1 hour)')
    }

    // Validate mock configuration
    if (this.get('mock.errorRate') > 1) {
      errors.push('Mock error rate cannot be greater than 1 (100%)')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }
}

// Create singleton instance
export const backendConfig = new BackendConfig()

// Export default configuration
export default backendConfig
