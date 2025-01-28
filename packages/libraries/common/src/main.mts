import { shallowRef, reactive } from 'vue'
import { createPinia } from 'pinia'
import type { App, Component, DefineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import api from './api'
import i18n from './i18n'
import store from './stores'
import { TokenService, isTokenExpired } from './token'
import AmplitudeService from './amplitude'
import { useDataProvider } from './composables/useDataProvider'
import { useUserPermissions } from './composables/useUserPermissions'
import { DataStreamHubConnection } from './DataStreams/DataStreamHubConnection'
import { fetchUrlTerms } from './services'
import { msalInstance } from './msal'
import { sanitizeUrl } from '@braintree/sanitize-url'
import debounce from 'lodash.debounce'

export * from './utils'
export const commonApi = api
export const commoni18n = shallowRef(i18n)
export const commonStore = store
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes: RouteRecordRaw[] = []
export const hasTokenExpired = isTokenExpired
export const dataProvider = useDataProvider
export const userPermissions = useUserPermissions
export const tokenService = reactive(TokenService.getInstance())
export const amplitudeService = new AmplitudeService()
import { type CommonAppOptions } from './types/CommonAppTypes'

export { DataStreamHubConnection }
export { debounce }
export { fetchUrlTerms }
export { sanitizeUrl }
export { msalInstance }

export default {
  install(app: App, { locale }: CommonAppOptions) {
    commoni18n.value.global.locale.value = locale

    app
      .use(commoni18n.value)
      .use(commonPinia)
  },
}
