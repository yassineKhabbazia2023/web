import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'

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
      PNavbar: { template: '<div><slot /></div>' },
      PBottomMenu: { template: '<div class="el-menu--bottom"><slot /></div>' },
      PConfigProvider: { template: '<div><slot /></div>' },
      PContainer: { template: '<div class="el-container"><slot /></div>' },
      PAside: { template: '<div class="el-aside"><slot /></div>' },
      PCHeader: { template: '<div class="el-header"><slot /></div>' }
    }
  }
})

describe('app', () => {
  it('load the right page with the right layout according to the route', async () => {
    const wrapper: VueWrapper<any> = createWrapper()

    router.push({ name: 'home' })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()
    await flushPromises()
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
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()
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
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    const getHomePageTitle = () => wrapper.find('p')
    const elHeader = wrapper.find('.el-header')
    const elAside = wrapper.find('.el-aside')
    const bottomMenu = wrapper.find('.el-menu--bottom')
    const getPageTitle = () => wrapper.find('.pageTitle')

    expect(getHomePageTitle().text()).toBe(HOME_PAGE_TITLE)
    expect(elHeader.exists()).toBeTruthy()
    expect(elAside.exists()).toBeTruthy()
    expect(bottomMenu.exists()).toBeTruthy()

    router.push({ name: 'login' })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()
    await flushPromises()
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
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await flushPromises()
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
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
    await vi.dynamicImportSettled()
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
