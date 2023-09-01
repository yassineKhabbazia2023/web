import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
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

const createWrapper = () => mount(App, {
  global: {
    plugins: [router],
    stubs: {
      PCol: { template: '<div class="el-col"><slot /></div>' },
      PRow: { template: '<div class="el-row"><slot /></div>' },
      PImage: { template: '<img />' },
      PButton: { template: '<button><slot /></button>' },
      PDrawer: { template: '<div><slot /></div>' },
      PHeader: {
        template: `<div class="el-menu--header">
          <slot name="logo" />
          <slot name="menu" />
          <slot name="header-right" />
        </div>`
      },
      PHeaderTabs: { template: '<div class="el-menu"><slot /></div>' },
      PAvatar: { template: '<div class="el-avatar"><slot /></div>' },
      PToolbox: { template: '<div><slot /></div>' },
      PNavbar: { template: '<div><slot /></div>' }
    }
  }
})

describe('app', () => {
  it('load the right page with the right layout according to the route', async () => {
    const wrapper: VueWrapper<any> = createWrapper()

    router.push({ name: 'home' })
    await flushPromises()
    await vi.dynamicImportSettled()
    const getLayoutTitle = () => wrapper.find('h3')
    const getHomePageTitle = () => wrapper.find('p')
    const elHeader = wrapper.find('el-header')
    const elAside = wrapper.find('el-aside')
    const getPageTitle = () => wrapper.find('.pageTitle')

    expect(getLayoutTitle().text()).toBe(HOME_LAYOUT_TITLE)
    expect(getHomePageTitle().text()).toBe(HOME_PAGE_TITLE)
    expect(elHeader.exists()).toBeTruthy()
    expect(elAside.exists()).toBeTruthy()

    router.push({ name: 'login' })
    await vi.dynamicImportSettled()
    expect(getPageTitle().text()).toBe(LOGIN_PAGE_TITLE)
  })
})
