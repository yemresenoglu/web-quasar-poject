/**
 * Vitest Global Setup
 * 
 * This file runs before all tests and sets up the global test environment.
 * It configures Quasar, mocks, and global utilities needed for testing.
 */

import { config } from '@vue/test-utils'
import { Quasar, Notify, Dialog } from 'quasar'
import { vi } from 'vitest'

// Configure Quasar for tests
config.global.plugins = [
  [Quasar, {
    plugins: {
      Notify,
      Dialog
    },
    config: {}
  }]
]

// Add i18n mock
config.global.mocks = {
  $t: (key) => key,
  $i18n: {
    locale: 'tr-TR'
  }
}

// Mock window.matchMedia (for Quasar responsive features)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
})

// Mock window.print
Object.defineProperty(window, 'print', {
  writable: true,
  value: vi.fn()
})

// Note: Console methods are NOT mocked globally
// Individual tests can mock console as needed
// This allows logger tests to work properly

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  sessionStorageMock.getItem.mockClear()
  sessionStorageMock.setItem.mockClear()
  sessionStorageMock.removeItem.mockClear()
  sessionStorageMock.clear.mockClear()
})

