// Backend Integration Tests and Validation
// Test utilities and validation functions for backend integration

import { createLogger } from './logger.js'
import { backendConfig } from 'src/config/backend-config.js'
import {
  BackendErrorHandler,
  BackendHealthMonitor,
  // BackendConfigManager
} from './backend-integration-helpers.js'
import { shouldUseMockData, getEnvironmentInfo } from 'src/constants/api.js'

const logger = createLogger('BackendIntegrationTests')

/**
 * Backend Integration Test Suite
 * Comprehensive test suite for backend integration functionality
 */
export class BackendIntegrationTestSuite {
  constructor() {
    this.testResults = []
    this.isRunning = false
  }

  /**
   * Run all backend integration tests
   * @returns {Promise<Object>} Test results
   */
  async runAllTests() {
    logger.info('Starting backend integration test suite')
    this.isRunning = true
    this.testResults = []

    try {
      // Configuration Tests
      await this.runConfigurationTests()

      // Environment Tests
      await this.runEnvironmentTests()

      // API Tests
      await this.runApiTests()

      // Error Handling Tests
      await this.runErrorHandlingTests()

      // Health Check Tests
      await this.runHealthCheckTests()

      // Mock Data Tests
      await this.runMockDataTests()

      const summary = this.generateTestSummary()
      logger.info('Backend integration test suite completed', summary)

      return summary
    } catch (err) {
      logger.error('Backend integration test suite failed:', err)
      throw err
    } finally {
      this.isRunning = false
    }
  }

  /**
   * Run configuration tests
   * @returns {Promise<void>}
   */
  async runConfigurationTests() {
    logger.info('Running configuration tests')

    // Test 1: Configuration Loading
    await this.runTest('Configuration Loading', async () => {
      const config = backendConfig.getFullConfig()
      if (!config || typeof config !== 'object') {
        throw new Error('Configuration not loaded properly')
      }
      return { configKeys: Object.keys(config) }
    })

    // Test 2: Environment Detection
    await this.runTest('Environment Detection', async () => {
      const envInfo = getEnvironmentInfo()
      if (!envInfo.environment) {
        throw new Error('Environment not detected')
      }
      return { environment: envInfo.environment }
    })

    // Test 3: Mock Data Configuration
    await this.runTest('Mock Data Configuration', async () => {
      const mockEnabled = shouldUseMockData()
      const configMock = backendConfig.isMockEnabled()

      if (mockEnabled !== configMock) {
        throw new Error('Mock data configuration mismatch')
      }

      return {
        mockEnabled,
        configMock,
        isDevelopment: getEnvironmentInfo().environment === 'development',
      }
    })

    // Test 4: Configuration Validation
    await this.runTest('Configuration Validation', async () => {
      const validation = backendConfig.validateConfig()
      if (!validation.valid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`)
      }
      return { validation }
    })
  }

  /**
   * Run environment tests
   * @returns {Promise<void>}
   */
  async runEnvironmentTests() {
    logger.info('Running environment tests')

    // Test 1: Environment Variables
    await this.runTest('Environment Variables', async () => {
      const requiredVars = ['NODE_ENV']
      const missingVars = requiredVars.filter((varName) => !process.env[varName])

      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
      }

      return {
        nodeEnv: process.env.NODE_ENV,
        hasApiBaseUrl: !!process.env.VUE_APP_API_BASE_URL,
        hasMockDataFlag: !!process.env.VUE_APP_USE_MOCK_DATA,
      }
    })

    // Test 2: API Configuration
    await this.runTest('API Configuration', async () => {
      const apiConfig = backendConfig.getApiConfig()

      if (!apiConfig.baseUrl) {
        throw new Error('API base URL not configured')
      }

      if (apiConfig.timeout < 1000) {
        throw new Error('API timeout too low')
      }

      return { apiConfig }
    })

    // Test 3: Feature Flags
    await this.runTest('Feature Flags', async () => {
      const features = backendConfig.getFeatures()
      const featureKeys = Object.keys(features)

      if (featureKeys.length === 0) {
        throw new Error('No feature flags configured')
      }

      return { features, featureKeys }
    })
  }

  /**
   * Run API tests
   * @returns {Promise<void>}
   */
  async runApiTests() {
    logger.info('Running API tests')

    // Test 1: API Base Configuration
    await this.runTest('API Base Configuration', async () => {
      const envInfo = getEnvironmentInfo()

      if (!envInfo.baseUrl) {
        throw new Error('API base URL not configured')
      }

      // Test URL format
      try {
        new URL(envInfo.baseUrl)
      } catch {
        throw new Error(`Invalid API base URL format: ${envInfo.baseUrl}`)
      }

      return { baseUrl: envInfo.baseUrl }
    })

    // Test 2: API Timeout Configuration
    await this.runTest('API Timeout Configuration', async () => {
      const timeout = backendConfig.get('api.timeout')

      if (timeout < 1000 || timeout > 60000) {
        throw new Error(`API timeout out of range: ${timeout}ms`)
      }

      return { timeout }
    })

    // Test 3: API Retry Configuration
    await this.runTest('API Retry Configuration', async () => {
      const retryMax = backendConfig.get('api.retryMax')
      const retryDelay = backendConfig.get('api.retryDelay')

      if (retryMax < 0 || retryMax > 10) {
        throw new Error(`Invalid retry max value: ${retryMax}`)
      }

      if (retryDelay < 100 || retryDelay > 10000) {
        throw new Error(`Invalid retry delay value: ${retryDelay}ms`)
      }

      return { retryMax, retryDelay }
    })
  }

  /**
   * Run error handling tests
   * @returns {Promise<void>}
   */
  async runErrorHandlingTests() {
    logger.info('Running error handling tests')

    // Test 1: Error Classification
    await this.runTest('Error Classification', async () => {
      const testErrors = [
        { code: 'NETWORK_ERROR', expectedType: 'NETWORK_ERROR' },
        { code: 'ECONNABORTED', expectedType: 'TIMEOUT_ERROR' },
        { response: { status: 401 }, expectedType: 'AUTHENTICATION_ERROR' },
        { response: { status: 403 }, expectedType: 'AUTHORIZATION_ERROR' },
        { response: { status: 400 }, expectedType: 'VALIDATION_ERROR' },
        { response: { status: 500 }, expectedType: 'SERVER_ERROR' },
      ]

      const results = testErrors.map((error) => {
        const classified = BackendErrorHandler.classifyError(error)
        return {
          error,
          classified,
          expected: error.expectedType,
          correct: classified === error.expectedType,
        }
      })

      const incorrect = results.filter((r) => !r.correct)
      if (incorrect.length > 0) {
        throw new Error(`Error classification failed: ${JSON.stringify(incorrect)}`)
      }

      return { results }
    })

    // Test 2: Error Information Extraction
    await this.runTest('Error Information Extraction', async () => {
      const testError = {
        message: 'Test error',
        code: 'TEST_ERROR',
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid request' },
        },
        config: {
          url: '/test',
          method: 'POST',
          timeout: 5000,
        },
      }

      const errorInfo = BackendErrorHandler.extractErrorInfo(testError)

      if (!errorInfo.message || !errorInfo.status || !errorInfo.config) {
        throw new Error('Error information extraction incomplete')
      }

      return { errorInfo }
    })

    // Test 3: Retryable Error Detection
    await this.runTest('Retryable Error Detection', async () => {
      const retryableErrors = [
        { code: 'NETWORK_ERROR' },
        { code: 'ECONNABORTED' },
        { response: { status: 500 } },
      ]

      const nonRetryableErrors = [
        { response: { status: 401 } },
        { response: { status: 403 } },
        { response: { status: 400 } },
      ]

      const retryableResults = retryableErrors.map((error) =>
        BackendErrorHandler.isRetryableError(error),
      )

      const nonRetryableResults = nonRetryableErrors.map((error) =>
        BackendErrorHandler.isRetryableError(error),
      )

      if (retryableResults.some((result) => !result)) {
        throw new Error('Some retryable errors not detected as retryable')
      }

      if (nonRetryableResults.some((result) => result)) {
        throw new Error('Some non-retryable errors detected as retryable')
      }

      return {
        retryableResults,
        nonRetryableResults,
      }
    })
  }

  /**
   * Run health check tests
   * @returns {Promise<void>}
   */
  async runHealthCheckTests() {
    logger.info('Running health check tests')

    // Test 1: Health Check Configuration
    await this.runTest('Health Check Configuration', async () => {
      const healthConfig = backendConfig.getHealthCheckConfig()

      if (!healthConfig.interval || !healthConfig.timeout) {
        throw new Error('Health check configuration incomplete')
      }

      if (healthConfig.interval < 10000 || healthConfig.timeout < 1000) {
        throw new Error('Health check timing configuration too aggressive')
      }

      return { healthConfig }
    })

    // Test 2: Health Status Management
    await this.runTest('Health Status Management', async () => {
      const initialStatus = BackendHealthMonitor.getHealthStatus()

      if (typeof initialStatus.isHealthy !== 'boolean') {
        throw new Error('Initial health status invalid')
      }

      return { initialStatus }
    })
  }

  /**
   * Run mock data tests
   * @returns {Promise<void>}
   */
  async runMockDataTests() {
    logger.info('Running mock data tests')

    // Test 1: Mock Data Configuration
    await this.runTest('Mock Data Configuration', async () => {
      const mockConfig = backendConfig.getMockConfig()

      if (typeof mockConfig.enabled !== 'boolean') {
        throw new Error('Mock data enabled flag invalid')
      }

      if (mockConfig.delay < 0 || mockConfig.delay > 10000) {
        throw new Error('Mock data delay out of range')
      }

      if (mockConfig.errorRate < 0 || mockConfig.errorRate > 1) {
        throw new Error('Mock data error rate out of range')
      }

      return { mockConfig }
    })

    // Test 2: Mock Data Availability
    await this.runTest('Mock Data Availability', async () => {
      // Test if mock data modules are available
      try {
        const authMockData = await import('src/data/auth-mock-data.js')
        const menuMockData = await import('src/data/menu-mock-data.js')
        const dashboardMockData = await import('src/data/index-page-mock-data.js')
        const hasarMockData = await import('src/data/mock-hasar-dosya-data.js')

        const mockModules = {
          auth: !!authMockData,
          menu: !!menuMockData,
          dashboard: !!dashboardMockData,
          hasar: !!hasarMockData,
        }

        const missingModules = Object.entries(mockModules)
          .filter(([, available]) => !available)
          .map(([name]) => name)

        if (missingModules.length > 0) {
          throw new Error(`Missing mock data modules: ${missingModules.join(', ')}`)
        }

        return { mockModules }
      } catch (error) {
        throw new Error(`Mock data modules not available: ${error.message}`)
      }
    })
  }

  /**
   * Run individual test
   * @param {string} testName - Test name
   * @param {Function} testFunction - Test function
   * @returns {Promise<void>}
   */
  async runTest(testName, testFunction) {
    const startTime = Date.now()

    try {
      logger.info(`Running test: ${testName}`)
      const result = await testFunction()
      const duration = Date.now() - startTime

      this.testResults.push({
        name: testName,
        status: 'passed',
        duration,
        result,
        error: null,
      })

      logger.info(`Test passed: ${testName} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - startTime

      this.testResults.push({
        name: testName,
        status: 'failed',
        duration,
        result: null,
        error: error.message,
      })

      logger.error(`Test failed: ${testName} (${duration}ms)`, error)
    }
  }

  /**
   * Generate test summary
   * @returns {Object} Test summary
   */
  generateTestSummary() {
    const total = this.testResults.length
    const passed = this.testResults.filter((r) => r.status === 'passed').length
    const failed = this.testResults.filter((r) => r.status === 'failed').length
    const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0)

    return {
      total,
      passed,
      failed,
      success: failed === 0,
      totalDuration,
      averageDuration: total > 0 ? totalDuration / total : 0,
      results: this.testResults,
    }
  }

  /**
   * Get test results
   * @returns {Array} Test results
   */
  getTestResults() {
    return [...this.testResults]
  }

  /**
   * Check if tests are running
   * @returns {boolean} Whether tests are running
   */
  isTestRunning() {
    return this.isRunning
  }
}

/**
 * Backend Integration Validator
 * Validates backend integration setup and configuration
 */
export class BackendIntegrationValidator {
  /**
   * Validate complete backend integration setup
   * @returns {Promise<Object>} Validation result
   */
  static async validateSetup() {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: [],
    }

    try {
      // Validate configuration
      const configValidation = backendConfig.validateConfig()
      if (!configValidation.valid) {
        validation.errors.push(...configValidation.errors)
        validation.valid = false
      }
      validation.warnings.push(...configValidation.warnings)

      // Validate environment
      const envInfo = getEnvironmentInfo()
      if (!envInfo.environment) {
        validation.errors.push('Environment not properly configured')
        validation.valid = false
      }

      // Validate API configuration
      if (!envInfo.baseUrl) {
        validation.errors.push('API base URL not configured')
        validation.valid = false
      }

      // Validate mock data setup
      if (shouldUseMockData()) {
        validation.recommendations.push(
          'Mock data is enabled - ensure backend is available for production',
        )
      }

      // Validate timeout settings
      const timeout = backendConfig.get('api.timeout')
      if (timeout > 30000) {
        validation.warnings.push(
          'API timeout is very high (> 30s) - may cause poor user experience',
        )
      }

      // Validate retry settings
      const retryMax = backendConfig.get('api.retryMax')
      if (retryMax > 5) {
        validation.warnings.push('High retry count may cause delays - consider reducing')
      }
    } catch (error) {
      validation.errors.push(`Validation failed: ${error.message}`)
      validation.valid = false
    }

    return validation
  }

  /**
   * Validate API endpoints
   * @param {Array} endpoints - List of endpoints to validate
   * @returns {Promise<Object>} Validation result
   */
  static async validateEndpoints(endpoints = []) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      endpointResults: [],
    }

    for (const endpoint of endpoints) {
      try {
        // Basic endpoint validation
        if (!endpoint.path || !endpoint.method) {
          validation.errors.push(`Invalid endpoint configuration: ${JSON.stringify(endpoint)}`)
          validation.valid = false
          continue
        }

        // Validate endpoint path format
        if (!endpoint.path.startsWith('/')) {
          validation.warnings.push(`Endpoint path should start with '/': ${endpoint.path}`)
        }

        // Validate HTTP method
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        if (!validMethods.includes(endpoint.method.toUpperCase())) {
          validation.errors.push(`Invalid HTTP method: ${endpoint.method}`)
          validation.valid = false
        }

        validation.endpointResults.push({
          endpoint: endpoint.path,
          method: endpoint.method,
          valid: true,
        })
      } catch (error) {
        validation.errors.push(`Endpoint validation failed for ${endpoint.path}: ${error.message}`)
        validation.valid = false

        validation.endpointResults.push({
          endpoint: endpoint.path,
          method: endpoint.method,
          valid: false,
          error: error.message,
        })
      }
    }

    return validation
  }
}

// Create test suite instance
export const backendTestSuite = new BackendIntegrationTestSuite()

export default {
  BackendIntegrationTestSuite,
  BackendIntegrationValidator,
  backendTestSuite,
}
