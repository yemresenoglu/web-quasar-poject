/**
 * Main Project Index
 * Central export point for the entire application
 */

// Bootstrap Icons CSS'i App.vue'da yükleniyor

export { default as App } from './App.vue'


export { default as router } from './router/index.js'
export { default as routes } from './router/routes.js'

export { default as store } from './stores/index.js'

export * from './boot/axios.js'
export * from './boot/i18n.js'

export { default as MainLayout } from './layouts/MainLayout.vue'
