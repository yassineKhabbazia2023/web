import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { flushPromises, VueWrapper } from '@vue/test-utils'
import wrapperFactory from '@tests/utils/wrapperFactory'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import PHeaderTabs from '.'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: {
      template: '<p class="pageTitle">Dashboard</p>'
    }
  },
  {
    path: '/document',
    name: 'document',
    component: {
      template: '<p class="pageTitle">Document</p>'
    }
  }
]

const pHeaderTabsMenu = [
  {
    pIcon: 'PISearch',
    pText: 'Dashboard',
    pPath: '/'
  },
  {
    pIcon: 'PIArchive',
    pText: 'Document',
    pPath: '/document'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const i18n = createI18n({
  inheritLocale: true,
  useScope: 'local',
  legacy: false
})

const createWrapper = (props: any = {}) =>
  wrapperFactory(PHeaderTabs, {
    global: {
      plugins: [router, i18n],
      renderStubDefaultSlot: true
    },
    props
  })

describe('pHeaderTabs', () => {
  it('has 2 items in the menu', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ pHeaderTabsMenu })
    await nextTick()
    router.push({ name: 'dashboard' })
    await flushPromises()
    const items = wrapper.findAll('el-menu-item-stub')

    expect(items).toHaveLength(pHeaderTabsMenu.length)
  })
  it('can navigate', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ pHeaderTabsMenu })
    router.push({ name: 'dashboard' })
    await flushPromises()
    expect(router.options.routes[0].path).toBe(pHeaderTabsMenu[0].pPath)

    const documentItem = wrapper.findAll('el-menu-item-stub')[1]
    documentItem.trigger('click')
    await flushPromises()
    expect(router.options.routes[1].path).toBe(pHeaderTabsMenu[1].pPath)
  })
})
