import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
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
        plugins: [router],
        stubs: {
          PCol: { template: '<div class="el-col"><slot /></div>' },
          PRow: { template: '<div class="el-row"><slot /></div>' },
          PImage: { template: '<img />' },
          PButton: { template: '<button><slot /></button>' },
          PDrawer: { template: '<div><slot /></div>' }
        }
      }
    })
    const getLayoutTitle = () => wrapper.find('h3')
    const getPageTitle = () => wrapper.find('.pageTitle')

    router.push({ name: 'home' })
    await vi.dynamicImportSettled()
    expect(getLayoutTitle().text()).toBe(HOME_LAYOUT_TITLE)
    expect(getPageTitle().text()).toBe(HOME_PAGE_TITLE)

    router.push({ name: 'login' })
    await vi.dynamicImportSettled()
    expect(getPageTitle().text()).toBe(LOGIN_PAGE_TITLE)
  })
})
