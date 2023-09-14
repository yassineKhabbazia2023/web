import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { VueWrapper, mount } from '@vue/test-utils'
import { commonPinia as pinia } from '@kpmg/common'
import App from './App.vue'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

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

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        activeEntity: {
          name: 'Entity Name',
          idAccount: 'AccountNumber',
          icon: 'PICupHot',
          color: 'orange'
        }
      }
    })
  }),
  commonPinia: () => createPinia()
}))

const createWrapper = () => mount(App, {
  global: {
    plugins: [router, createTestingPinia()],
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
  setActivePinia(pinia)
  it('load the right page with the right layout according to the route', async () => {
    const wrapper: VueWrapper<any> = createWrapper()

    router.push({ name: 'home' })
    await waitForAsyncImports(200)
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
    await waitForAsyncImports(200)
    expect(getPageTitle().text()).toBe(LOGIN_PAGE_TITLE)
  })
})
