import { shallowRef, ref, type Component, type DefineComponent } from 'vue'
import { createPinia } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import api from './api'
import i18n from './i18n'
import store, { isTokenExpired } from './stores'
import { useDataProvider } from './composables/useDataProvider'
import { DataStreamHubConnection } from './DataStreams/DataStreamHubConnection'

export * from './stores/types'
export const commonApi = api
export const commoni18n = shallowRef(i18n)
export const commonStore = store
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes = ref([] as RouteRecordRaw[])
export const hasTokenExpired = isTokenExpired
export const dataProvider = useDataProvider

export { DataStreamHubConnection }
