import { shallowRef } from 'vue'
import { createPinia } from 'pinia'
import type { App, Component, DefineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import api from './api'
import i18n from './i18n'
import AmplitudeService from './amplitude'
import { useDataProvider } from './composables/useDataProvider'
import { DataStreamHubConnection } from './DataStreams/DataStreamHubConnection'
import { fetchUrlTerms } from './services'
import { msalInstance } from './msal'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { refreshClientToken, createNewPassword, isInvitationTokenValid, login } from './services/authentication.service'

export * from './unauthorized-callback'
export * from './utils'
export const commonApi = api
export const commoni18n = shallowRef(i18n)
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes: RouteRecordRaw[] = []
export const dataProvider = useDataProvider
export const amplitudeService = new AmplitudeService()
import { type CommonAppOptions } from './types/CommonAppTypes'

export { DataStreamHubConnection }
export { fetchUrlTerms }
export { sanitizeUrl }
export { msalInstance }
export { refreshClientToken, createNewPassword, isInvitationTokenValid, login }

export default {
  install(app: App, { locale }: CommonAppOptions) {
    commoni18n.value.global.locale.value = locale

    app
      .use(commoni18n.value)
      .use(commonPinia)
  },
}
