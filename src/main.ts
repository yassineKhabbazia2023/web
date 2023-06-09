import { createApp, h, shallowRef, type Component, type DefineComponent } from 'vue'
// eslint-disable-next-line
// @ts-ignore
import singleSpaVue from 'single-spa-vue'
import { createPinia } from 'pinia'
import api from './api'
import i18n from './i18n'
import store from './stores'
import { type RouteRecordRaw } from 'vue-router'

// This is an empty component in order to load Common as an registered application in Single SPA for
// serving commonStore, commontApi, widgets, routes, etc.
const RenderLess = () => ''

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(RenderLess, {
        // single-spa props are available on the "this" object.
        // Forward them to your component as needed.
        // https://single-spa.js.org/docs/building-applications#lifecyle-props
        // props: {
        // name: this.name
        // },
      })
    }
  },
  handleInstance: (app: any) => {
    app.use(createPinia()).use(commoni18n)
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
export const commonApi = api
export const commoni18n = i18n
export const commonStore = store
export const commonPinia = createPinia()
export const widgets = shallowRef([] as Component[] | DefineComponent[])
export const routes = shallowRef([] as RouteRecordRaw[])
