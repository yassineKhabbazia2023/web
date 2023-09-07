import { shallowRef, type Component, type DefineComponent } from 'vue'
import { createPinia } from 'pinia'
import api from './api'
import i18n from './i18n'
import store from './stores'
import { type RouteRecordRaw } from 'vue-router'

export const commonApi = api
export const commoni18n = shallowRef(i18n)
export const commonStore = store
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes = shallowRef([] as RouteRecordRaw[])
