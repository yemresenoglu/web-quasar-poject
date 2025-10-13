import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import path from 'path'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// https://vitest.dev/config/
export default defineConfig({
  root: projectRoot,
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/__tests__/setup.js',
    // Only include tests inside src/ directory
    include: ['./src/**/*.spec.js'],
    // Aggressively exclude everything else
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/.quasar/**',
      '**/build/**',
      '**/coverage/**',
      '**/.git/**',
      '**/.vscode/**',
      '**/AppData/**',
      '**/Programs/**',
      '**/Application Data/**',
      '**/Local Settings/**',
      '**/cursor/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.spec.js',
        'src/**/*.test.js',
        'dist/',
        '**/*.config.js',
        '**/mockData.js'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  },
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
      'src': path.resolve(projectRoot, './src'),
      'components': path.resolve(projectRoot, './src/components'),
      'layouts': path.resolve(projectRoot, './src/layouts'),
      'pages': path.resolve(projectRoot, './src/pages'),
      'assets': path.resolve(projectRoot, './src/assets'),
      'boot': path.resolve(projectRoot, './src/boot'),
      'stores': path.resolve(projectRoot, './src/stores'),
      'utils': path.resolve(projectRoot, './src/utils'),
      'constants': path.resolve(projectRoot, './src/constants'),
      'i18n': path.resolve(projectRoot, './src/i18n'),
      'router': path.resolve(projectRoot, './src/router'),
      'composables': path.resolve(projectRoot, './src/composables')
    }
  }
})
