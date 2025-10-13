/**
 * API Type Definitions
 * Backend: Spring 2 + JDK 1.8
 * 
 * Defines interfaces for API requests and responses
 */

/**
 * Base API Response Structure
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Request success status
 * @property {*} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} [error] - Error message if failed
 */

/**
 * Dispatch Request Parameters
 * @typedef {Object} DispatchRequest
 * @property {string} cmd - Command type
 * @property {string} callid - Unique call ID
 * @property {string} token - Authentication token
 * @property {string} jp - JSON payload as string
 */

/**
 * Dispatch Response
 * @typedef {Object} DispatchResponse
 * @property {boolean} success - Operation success
 * @property {*} result - Backend response data
 * @property {string} [message] - Response message
 * @property {number} [code] - Response code
 */

/**
 * Hasar File Data
 * @typedef {Object} HasarFileData
 * @property {string} dosyaNo - File number
 * @property {string} policeNo - Policy number
 * @property {string} hasarTarihi - Damage date
 * @property {string} hasarYeri - Damage location
 * @property {string} hasarSebebi - Damage reason
 * @property {number} hasarTutari - Damage amount
 * @property {string} durum - Status
 * @property {Object} ihbarVeren - Reporter information
 * @property {Object} degerKaybi - Value loss data
 * @property {Array} evrakList - Document list
 */

/**
 * Hasar Search Parameters
 * @typedef {Object} HasarSearchParams
 * @property {string} [dosyaNo] - File number
 * @property {string} [policeNo] - Policy number
 * @property {string} [tarihBaslangic] - Start date
 * @property {string} [tarihBitis] - End date
 * @property {string} [durum] - Status filter
 * @property {number} [page] - Page number
 * @property {number} [limit] - Items per page
 */

/**
 * Evrak (Document) Data
 * @typedef {Object} EvrakData
 * @property {string} type - Document type
 * @property {string} name - Document name
 * @property {string} [description] - Document description
 * @property {string} [uploadDate] - Upload date
 * @property {string} [status] - Document status
 */

/**
 * Deger Kaybi (Value Loss) Data
 * @typedef {Object} DegerKaybiData
 * @property {number} teklifEdilenTutar - Proposed amount
 * @property {number} vekaletTutari - Proxy amount
 * @property {number} anlasmaSağlananTutar - Agreement amount
 * @property {string} anlasmaTarihi - Agreement date
 * @property {string} durum - Status
 * @property {string} [notes] - Notes
 */

/**
 * User Profile Data
 * @typedef {Object} UserProfile
 * @property {string} id - User ID
 * @property {string} userCode - User code
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} department - Department
 * @property {string} role - User role
 * @property {Array<string>} permissions - User permissions
 * @property {string} lastLogin - Last login date
 */

/**
 * Login Data
 * @typedef {Object} LoginData
 * @property {string} userCode - User code
 * @property {string} password - Password
 * @property {string} captcha - Captcha code
 */

/**
 * Password Change Data
 * @typedef {Object} PasswordChangeData
 * @property {string} currentPassword - Current password
 * @property {string} newPassword - New password
 * @property {string} confirmPassword - Confirm new password
 */

/**
 * Dashboard Data
 * @typedef {Object} DashboardData
 * @property {number} totalFiles - Total hasar files
 * @property {number} openFiles - Open files
 * @property {number} closedFiles - Closed files
 * @property {number} totalAmount - Total amount
 * @property {Array} recentFiles - Recent files
 * @property {Array} charts - Chart data
 */

/**
 * Menu Item
 * @typedef {Object} MenuItem
 * @property {string} id - Menu item ID
 * @property {string} title - Menu title
 * @property {string} icon - Menu icon
 * @property {string} [path] - Route path
 * @property {string} [component] - Component name
 * @property {boolean} [requiresAuth] - Requires authentication
 * @property {Array<string>} [permissions] - Required permissions
 * @property {Array<MenuItem>} [children] - Child menu items
 */

/**
 * Task Data
 * @typedef {Object} TaskData
 * @property {string} id - Task ID
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} status - Task status
 * @property {string} priority - Task priority
 * @property {string} assignedTo - Assigned user
 * @property {string} dueDate - Due date
 * @property {string} createdAt - Creation date
 */

/**
 * API Error
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} status - HTTP status code
 * @property {string} [code] - Error code
 * @property {*} [details] - Error details
 */

/**
 * Language Options
 * @typedef {Object} LanguageOption
 * @property {string} code - Language code (tr, en)
 * @property {string} name - Language name
 * @property {string} flag - Flag emoji or icon
 */

/**
 * Session Data
 * @typedef {Object} SessionData
 * @property {string} sessionId - Session ID (JSESSIONID)
 * @property {string} language - User language preference
 * @property {boolean} isValid - Session validity
 * @property {string} expiresAt - Session expiration
 * @property {Object} user - User data
 */

/**
 * Backend Command Types
 * @typedef {Object} CommandTypes
 * @property {string} IS_DOSYAKAPALI - Check if file is closed
 * @property {string} SEARCH_HASAR_FILES - Search hasar files
 * @property {string} GET_HASAR_FILE_DETAILS - Get file details
 * @property {string} SAVE_HASAR_FILE - Save file data
 * @property {string} ADD_EVRAK - Add document
 * @property {string} GET_EVRAK_LIST - Get document list
 * @property {string} UPDATE_DEGER_KAYBI - Update value loss
 * @property {string} GET_DASHBOARD_DATA - Get dashboard data
 * @property {string} GET_USER_PROFILE - Get user profile
 * @property {string} UPDATE_USER_PROFILE - Update user profile
 * @property {string} CHANGE_PASSWORD - Change password
 * @property {string} LOGIN - User login
 * @property {string} LOGOUT - User logout
 * @property {string} CHECK_SESSION - Check session
 * @property {string} GET_MENU_ITEMS - Get menu items
 * @property {string} GET_TASK_LIST - Get task list
 * @property {string} SET_LANGUAGE - Set language
 */

/**
 * Available command types
 */
export const COMMAND_TYPES = {
  IS_DOSYAKAPALI: 'isDosyakapali',
  SEARCH_HASAR_FILES: 'searchHasarFiles',
  GET_HASAR_FILE_DETAILS: 'getHasarFileDetails',
  SAVE_HASAR_FILE: 'saveHasarFile',
  ADD_EVRAK: 'addEvrak',
  GET_EVRAK_LIST: 'getEvrakList',
  UPDATE_DEGER_KAYBI: 'updateDegerKaybi',
  GET_DASHBOARD_DATA: 'getDashboardData',
  GET_USER_PROFILE: 'getUserProfile',
  UPDATE_USER_PROFILE: 'updateUserProfile',
  CHANGE_PASSWORD: 'changePassword',
  LOGIN: 'login',
  LOGOUT: 'logout',
  CHECK_SESSION: 'checkSession',
  GET_MENU_ITEMS: 'getMenuItems',
  GET_TASK_LIST: 'getTaskList',
  SET_LANGUAGE: 'setLanguage'
}

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

/**
 * API Error Codes
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  SESSION_EXPIRED: 'SESSION_EXPIRED'
}

/**
 * Default API Configuration
 */
export const DEFAULT_API_CONFIG = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  maxRetries: 3
}

export default {
  COMMAND_TYPES,
  HTTP_STATUS,
  ERROR_CODES,
  DEFAULT_API_CONFIG
}
