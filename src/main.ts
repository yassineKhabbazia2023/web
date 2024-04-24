import { shallowRef, ref, reactive } from 'vue'
import { createPinia } from 'pinia'
import type { Component, DefineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import api from './api'
import i18n from './i18n'
import store from './stores'
import { TokenService, isTokenExpired } from './token'
import { useDataProvider } from './composables/useDataProvider'
import { DataStreamHubConnection } from './DataStreams/DataStreamHubConnection'
import { sanitizeUrl } from '@braintree/sanitize-url'
import debounce from 'lodash.debounce'

export * from './stores/types'
export * from './utils'
export const commonApi = api
export const commoni18n = shallowRef(i18n)
export const commonStore = store
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes = ref([] as RouteRecordRaw[])
export const hasTokenExpired = isTokenExpired
export const dataProvider = useDataProvider
export const tokenService = reactive(TokenService.getInstance())

export { DataStreamHubConnection }
export { debounce }
export { sanitizeUrl }
