import { shallowRef } from 'vue'
import { createPinia } from 'pinia'
import type { App, Component, DefineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import api from './api'
import { i18n } from './i18n/i18n.setup'
import AmplitudeService from './services/amplitude/amplitude.service'
import { DataStreamHubConnection } from './DataStreams/DataStreamHubConnection'
import { fetchUrlTerms } from './services'
import { msalInstance } from './msal'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { refreshClientToken, createNewPassword, isInvitationTokenValid, login } from './services/authentication.service'

export * from './unauthorized-callback'
export * from './utils'
export const commonApi = api
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes: RouteRecordRaw[] = []
export const amplitudeService = AmplitudeService.getInstance()

export { DataStreamHubConnection }
export { fetchUrlTerms }
export { sanitizeUrl }
export { msalInstance }
export { refreshClientToken, createNewPassword, isInvitationTokenValid, login }

export default {
  install(app: App) {
    app
      .use(i18n)
      .use(commonPinia)
  },
}
