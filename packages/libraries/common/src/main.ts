import { shallowRef } from 'vue'
import { createPinia } from 'pinia'
import type { App, Component, DefineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import api from './api'
import { i18n } from './i18n/i18n.setup'
import { DataStreamHubConnection } from './DataStreams/DataStreamHubConnection'
import { fetchUrlTerms } from './services'
import { refreshClientToken, createNewPassword, updatePassword, login } from './services/authentication.service'

export * from './unauthorized-callback'
export * from './utils'
export const commonApi = api
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes: RouteRecordRaw[] = []

export { DataStreamHubConnection }
export { fetchUrlTerms }
export { refreshClientToken, createNewPassword, updatePassword, login }

export default {
  install(app: App, _options: any) {
    app
      .use(i18n)
      .use(commonPinia)
  },
}
