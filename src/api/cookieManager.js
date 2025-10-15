import { createLogger } from 'src/utils/logger.js'
import { API_CONFIG } from 'src/constants/api.js'

const logger = createLogger('CookieManager')

class CookieManager {
  constructor() {
    this.cookies = new Map()
    this.domain = new URL(API_CONFIG.CURRENT_BASE_URL).hostname
    this.path = '/sigorta'
    this.loadCookiesFromDocument()
  }

  loadCookiesFromDocument() {
    if (typeof document === 'undefined') return

    const cookieString = document.cookie
    if (!cookieString) return

    const cookies = cookieString.split(';').map((cookie) => cookie.trim())

    cookies.forEach((cookie) => {
      const [name, value] = cookie.split('=')
      if (name && value) {
        this.cookies.set(name.trim(), decodeURIComponent(value.trim()))
      }
    })

    logger.info('Cookies loaded from document:', Array.from(this.cookies.entries()))
  }

  getCookie(name) {
    return this.cookies.get(name) || null
  }

  setCookie(name, value, options = {}) {
    const cookieOptions = {
      path: this.path,
      domain: this.domain,
      secure: false, // Backend doesn't use secure cookies
      sameSite: 'Lax',
      ...options,
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`

    // Add options
    if (cookieOptions.path) cookieString += `; Path=${cookieOptions.path}`
    if (cookieOptions.domain) cookieString += `; Domain=${cookieOptions.domain}`
    if (cookieOptions.secure) cookieString += `; Secure`
    if (cookieOptions.sameSite) cookieString += `; SameSite=${cookieOptions.sameSite}`
    if (cookieOptions.expires) cookieString += `; Expires=${cookieOptions.expires.toUTCString()}`
    if (cookieOptions.maxAge) cookieString += `; Max-Age=${cookieOptions.maxAge}`
    if (cookieOptions.httpOnly) cookieString += `; HttpOnly`

    // Set in document
    if (typeof document !== 'undefined') {
      document.cookie = cookieString
    }

    // Store in memory
    this.cookies.set(name, value)

    logger.info('Cookie set:', { name, value, options: cookieOptions })
  }

  removeCookie(name) {
    const pastDate = new Date(0).toUTCString()
    this.setCookie(name, '', { expires: pastDate })
    this.cookies.delete(name)
    logger.info('Cookie removed:', name)
  }

  getSessionId() {
    return this.getCookie('JSESSIONID')
  }

  setSessionId(sessionId) {
    this.setCookie('JSESSIONID', sessionId, {
      httpOnly: true,
      path: '/sigorta',
    })
  }

  getUserSessionLang() {
    return this.getCookie('userSessionLang') || 'tr'
  }

  setUserSessionLang(lang) {
    this.setCookie('userSessionLang', lang, { path: '/sigorta' })
  }

  getCookieHeader() {
    const cookiePairs = Array.from(this.cookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ')
    return cookiePairs || ''
  }

  hasValidSession() {
    return !!this.getSessionId()
  }

  clearAllCookies() {
    const cookieNames = Array.from(this.cookies.keys())
    cookieNames.forEach((name) => this.removeCookie(name))
    logger.info('All cookies cleared')
  }

  getCookieInfo() {
    return {
      sessionId: this.getSessionId(),
      userLang: this.getUserSessionLang(),
      hasValidSession: this.hasValidSession(),
      allCookies: Object.fromEntries(this.cookies),
      cookieHeader: this.getCookieHeader(),
    }
  }
}

const cookieManager = new CookieManager()

export default cookieManager
export { CookieManager }
