import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { flushPromises, VueWrapper } from '@vue/test-utils'
import PHeaderTabs from '.'
import wrapperFactory from '@tests/utils/wrapperFactory'

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

const menu = [
  {
    icon: 'PISearch',
    text: 'Dashboard',
    path: '/'
  },
  {
    icon: 'PIArchive',
    text: 'Document',
    path: '/document'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const createWrapper = (props: any = {}) =>
  wrapperFactory(PHeaderTabs, {
    global: {
      plugins: [router]
    },
    props
  })

describe('pHeaderTabs', () => {
  it('has 2 items in the menu', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ menu })
    router.push({ name: 'dashboard' })
    await flushPromises()
    const items = wrapper.findAll('el-menu-item')

    expect(items).toHaveLength(menu.length)
  })
  it('can navigate', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ menu })
    router.push({ name: 'dashboard' })
    await flushPromises()
    expect(router.options.routes[0].path).toBe(menu[0].path)

    const documentItem = wrapper.findAll('el-menu-item')[1]
    documentItem.trigger('click')
    await flushPromises()
    expect(router.options.routes[1].path).toBe(menu[1].path)
  })
})
