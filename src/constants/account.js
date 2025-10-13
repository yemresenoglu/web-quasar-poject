/**
 * Account Menu Constants
 * Contains static configuration data for AccountMenu component
 * Note: DEPARTMENT_ITEMS and TASK_ITEMS are now managed in the Pinia store
 */

// Department options for profile form and selection
export const DEPARTMENT_OPTIONS = [
  { label: 'Arabuluculuk', value: 'arabuluculuk' },
  { label: 'Hukuk', value: 'hukuk' }
]

// Department items template for the store initialization
export const DEPARTMENT_ITEMS = [
  {
    id: 'arabuluculuk',
    name: 'Arabuluculuk',
    icon: 'bi bi-shield-check',
    selected: true
  },
  {
    id: 'hukuk',
    name: 'Hukuk',
    icon: 'bi bi-file-text',
    selected: false
  }
]

// Task items template for the store initialization
export const TASK_ITEMS = [
  {
    id: 'task-1',
    name: 'Arabulucu',
    description: 'Arabuluculuk görevlerini yürüt',
    icon: 'bi bi-shield-check',
    completed: true
  },
  {
    id: 'task-2',
    name: 'Avukat',
    description: 'Hukuki danışmanlık ve temsil görevleri',
    icon: 'bi bi-file-text',
    completed: false
  },
  {
    id: 'task-3',
    name: 'Dosya Yöneticisi',
    description: 'Dosya ve belge yönetimi görevleri',
    icon: 'bi bi-briefcase',
    completed: false
  },
  {
    id: 'task-4',
    name: 'Eksper',
    description: 'Uzmanlık ve değerlendirme görevleri',
    icon: 'bi bi-clipboard-check',
    completed: false
  }
]

// Loading state keys
export const LOADING_STATE_KEYS = {
  PROFILE: 'profile',
  PASSWORD: 'password',
  DEPARTMENT: 'department',
  LOGOUT: 'logout',
  NAVIGATION: 'navigation'
}

// Avatar configuration
export const AVATAR_CONFIG = {
  size: '72px',
  src: 'https://cdn.quasar.dev/img/boy-avatar.png',
  alt: 'Profile Avatar'
}

// Menu configuration
export const MENU_CONFIG = {
  offset: [20, 0],
  transitionDuration: 100,
  borderRadius: '18px'
}
