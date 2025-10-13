import { ref, computed } from 'vue'
import { createLogger } from 'src/utils/logger'

const logger = createLogger('ApiLoading')

const globalLoading = ref(false)
const loadingOperations = ref(new Set())

export function useApiLoading(operationName = 'default') {
  const isLoading = ref(false)
  const error = ref(null)
  const lastOperation = ref(null)

  const startLoading = () => {
    isLoading.value = true
    error.value = null
    globalLoading.value = true
    loadingOperations.value.add(operationName)
    lastOperation.value = new Date().toISOString()
    
    logger.debug(`Loading started: ${operationName}`)
  }

  const stopLoading = () => {
    isLoading.value = false
    loadingOperations.value.delete(operationName)
    if (loadingOperations.value.size === 0) {
      globalLoading.value = false
    }
    logger.debug(`Loading stopped: ${operationName}`)
  }

  const setError = (err) => {
    error.value = err
    stopLoading()
    logger.error(`Loading error for ${operationName}:`, err)
  }

  const clearError = () => {
    error.value = null
  }

  const executeWithLoading = async (operation, options = {}) => {
    const { 
      showGlobalLoading = true,
      autoHandleErrors = false,
      timeout = 30000 
    } = options

    try {
      startLoading()
      
      let timeoutId = null
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          throw new Error('Operation timeout')
        }, timeout)
      }

      const result = await operation()
      
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      stopLoading()
      return result
    } catch (err) {
      stopLoading()
      
      if (autoHandleErrors) {
        setError(err)
        return { success: false, error: err.message }
      } else {
        throw err
      }
    }
  }

  const reset = () => {
    isLoading.value = false
    error.value = null
    lastOperation.value = null
  }

  return {
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    lastOperation: computed(() => lastOperation.value),
    startLoading,
    stopLoading,
    setError,
    clearError,
    executeWithLoading,
    reset
  }
}

export const useGlobalLoading = () => {
  return {
    isLoading: computed(() => globalLoading.value),
    loadingOperations: computed(() => Array.from(loadingOperations.value)),
    hasLoadingOperations: computed(() => loadingOperations.value.size > 0)
  }
}

export const loadingStates = {
  search: ref(false),
  save: ref(false),
  delete: ref(false),
  load: ref(false),
  upload: ref(false),
  download: ref(false)
}

export const setLoadingState = (operation, loading) => {
  if (loadingStates[operation]) {
    loadingStates[operation].value = loading
  }
}

export const getLoadingState = (operation) => {
  return loadingStates[operation]?.value || false
}

export const useLoadingIndicator = () => {
  const { isLoading } = useGlobalLoading()
  return {
    showGlobalSpinner: computed(() => isLoading.value),
    loadingOperationsCount: computed(() => loadingOperations.value.size)
  }
}

export default {
  useApiLoading,
  useGlobalLoading,
  loadingStates,
  setLoadingState,
  getLoadingState,
  useLoadingIndicator
}
