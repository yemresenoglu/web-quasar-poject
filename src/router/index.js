import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { i18n } from 'src/boot/i18n'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Update document title on route change
  Router.afterEach((to) => {
    const baseTitle = 'SOMPO Sigorta'
    
    // Get titleKey from route meta
    const titleKey = to.meta?.titleKey
    
    if (titleKey && i18n.global) {
      // Use i18n translation
      const pageTitle = i18n.global.t(titleKey)
      document.title = `${pageTitle} - ${baseTitle}`
    } else if (to.meta?.title) {
      // Fallback to meta.title
      document.title = `${to.meta.title} - ${baseTitle}`
    } else {
      // Default title
      document.title = baseTitle
    }
  })

  return Router
})
