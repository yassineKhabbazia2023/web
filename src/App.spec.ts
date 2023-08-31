import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import App from './App.vue'

const HOME_LAYOUT_TITLE = 'This is the Home layout'
const HOME_PAGE_TITLE = 'Home page'
const LOGIN_PAGE_TITLE = 'Login page'

const routes = [
  {
    path: '/',
    name: 'home',
    component: {
      template: `<p class="pageTitle">${HOME_PAGE_TITLE}</p>`
    }
  },
  {
    path: '/login',
    name: 'login',
    component: {
      template: `<p class="pageTitle">${LOGIN_PAGE_TITLE}</p>`
    },
    meta: {
      layout: 'Login'
    }
  },
  {
    path: '/entities',
    name: 'entities',
    component: {
      template: `<p class="pageTitle">${HOME_PAGE_TITLE}</p>`
    }
  },
  {
    path: '/mandate',
    name: 'mandats',
    component: {
      template: `<p class="pageTitle">${HOME_PAGE_TITLE}</p>`
    }
  },
  {
    path: '/ged',
    name: 'ged',
    component: {
      template: `<p class="pageTitle">${HOME_PAGE_TITLE}</p>`
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('app', () => {
  it('load the right page with the right layout according to the route', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    const getLayoutTitle = () => wrapper.find('h3')
    const getPageTitle = () => wrapper.find('.pageTitle')

    router.push({ name: 'home' })
    await wrapper.vm.$nextTick()
    await flushPromises()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    expect(getLayoutTitle().text()).toBe(HOME_LAYOUT_TITLE)
    expect(getPageTitle().text()).toBe(HOME_PAGE_TITLE)

    router.push({ name: 'login' })
    await wrapper.vm.$nextTick()
    await flushPromises()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    expect(getPageTitle().text()).toBe(LOGIN_PAGE_TITLE)
  })
})
