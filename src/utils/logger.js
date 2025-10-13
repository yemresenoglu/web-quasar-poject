/**
 * Centralized Logging Service
 * Provides consistent logging across the application
 */

export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

class Logger {
  constructor(context) {
    this.context = context
    this.isProduction = process.env.NODE_ENV === 'production'
    this.isDevelopment = process.env.NODE_ENV === 'development'
    
    // Log filtreleme sistemi
    this.filters = {
      general: true,       // Default category
      error: true,         // Error tracking
      performance: true,
      userBehavior: false, // Gereksiz logları kapat
      translation: false,
      monitoring: true
    }
    
    // Log seviyesi kontrolü
    this.logLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG
  }

  /**
   * Log seviyesini kontrol eder
   */
  shouldLog(level, category = 'general') {
    // Production'da sadece ERROR ve WARN
    if (this.isProduction && level > LogLevel.WARN) {
      return false
    }
    
    // Kategori filtresi
    if (category && !this.filters[category]) {
      return false
    }
    
    return level <= this.logLevel
  }

  /**
   * Log yazma (Browser modunda sadece console)
   */
  writeToFile(level, message, data) {
    // Browser modunda sadece console'a yaz
    this.writeToConsole(level, message, data)
  }

  /**
   * Console'a yazar
   */
  writeToConsole(level, message, data) {
    const prefix = this.getLogPrefix(level)
    const args = data ? [message, data] : [message]
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(prefix, ...args)
        break
      case LogLevel.WARN:
        console.warn(prefix, ...args)
        break
      case LogLevel.INFO:
        console.info(prefix, ...args)
        break
      case LogLevel.DEBUG:
        console.log(prefix, ...args)
        break
    }
  }

  /**
   * Log prefix'i oluşturur
   */
  getLogPrefix(level) {
    const levelEmoji = {
      [LogLevel.ERROR]: '🔴',
      [LogLevel.WARN]: '🟡',
      [LogLevel.INFO]: '🔵',
      [LogLevel.DEBUG]: '⚪'
    }
    
    return `${levelEmoji[level]} [${this.context}]`
  }

  /**
   * Log seviyesi adını döndürür
   */
  getLevelName(level) {
    const levelNames = {
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.DEBUG]: 'DEBUG'
    }
    
    return levelNames[level] || 'UNKNOWN'
  }

  error(message, data, category = 'general') {
    if (this.shouldLog(LogLevel.ERROR, category)) {
      this.writeToFile(LogLevel.ERROR, message, data)
    }
  }

  warn(message, data, category = 'general') {
    if (this.shouldLog(LogLevel.WARN, category)) {
      this.writeToFile(LogLevel.WARN, message, data)
    }
  }

  info(message, data, category = 'general') {
    if (this.shouldLog(LogLevel.INFO, category)) {
      this.writeToFile(LogLevel.INFO, message, data)
    }
  }

  log(message, data, category = 'general') {
    if (this.shouldLog(LogLevel.DEBUG, category)) {
      this.writeToFile(LogLevel.DEBUG, message, data)
    }
  }

  debug(message, data, category = 'general') {
    if (this.shouldLog(LogLevel.DEBUG, category)) {
      this.writeToFile(LogLevel.DEBUG, message, data)
    }
  }

  // Performance logging
  time(label) {
    if (this.shouldLog(LogLevel.DEBUG, 'performance')) {
      console.time(`⏱️ [${this.context}] ${label}`)
    }
  }

  timeEnd(label) {
    if (this.shouldLog(LogLevel.DEBUG, 'performance')) {
      console.timeEnd(`⏱️ [${this.context}] ${label}`)
    }
  }

  // Error tracking for production
  trackError(error, context = {}) {
    if (this.isProduction) {
      // Integration with error tracking service (Sentry, etc.)
      this.error('Tracked Error:', { 
        error: error.message, 
        stack: error.stack, 
        ...context 
      }, 'error')
    } else {
      this.error('Error:', error, context, 'error')
    }
  }

  /**
   * Log filtrelerini günceller
   */
  updateFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters }
  }

  /**
   * Log seviyesini günceller
   */
  setLogLevel(level) {
    this.logLevel = level
  }
}

// Create instances for different contexts
export const logger = new Logger('App')
export const createLogger = (context) => new Logger(context)

// Pre-configured loggers
export const storeLogger = createLogger('Store')
export const componentLogger = createLogger('Component')
export const serviceLogger = createLogger('Service')
export const performanceLogger = createLogger('Performance')
export const monitoringLogger = createLogger('Monitoring')

export default Logger 