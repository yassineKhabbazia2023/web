import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import Header from './'
import helpers from '@/tests/utils/helpers'
import { nextTick } from 'vue'
import { PToolbox } from '@kpmg/styleguide'
import type { HeaderMenu } from './HeaderTypes'
import { commonStore as store } from '@kpmg/common'
const { router, pinia, mockUser, fetchUserData } = helpers()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => (mockUser),
    getters: {
      isAuthenticated: () => true
    },
    actions: {
      logout: () => vi.fn()
    }
  }),
  commonPinia: () => pinia,
  dataProvider: () => {
    return { fetchUserData }
  }
}))

const headerMenu: HeaderMenu[] = [{
  pIcon: 'PIColumnsGap',
  pText: 'Dashboard',
  pPath: ''
}, {
  pIcon: 'PIFiles',
  pText: 'subscriptions',
  pPath: ''
}]

const createWrapper = (): VueWrapper<any> => mount(Header, {
  attachTo: document.body,
  props: {
    headerMenu
  },
  global: {
    plugins: [router]
  }
})

describe('header', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    setActivePinia(pinia)
    wrapper = createWrapper()
  })
  it('should display header section', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    router.push({ name: 'My entities' })
    const header = wrapper.find('.el-menu--header')
    const logo = wrapper.find('.menu-item--logo')

    expect(header.exists()).toBeTruthy()
    expect(logo.exists()).toBeTruthy()
  })

  it('should contain proper menu items', async () => {
    const menuItems = wrapper.findAll('.el-menu-item')

    expect(menuItems).toHaveLength(headerMenu.length)

    menuItems.forEach((menuItem, index) => {
      expect(menuItem.text()).toBe(headerMenu.at(index)?.pText)
    })
  })

  it('should disconnect user while clicking on logout button', async () => {
    const spyRouterPush = vi.spyOn(router, 'push')
    await wrapper.find('.el-avatar').trigger('click')
    await nextTick()
    expect(document.body.innerHTML).contains('p-toolbox-item')

    const PToolboxWrapper = wrapper.findComponent(PToolbox)
    PToolboxWrapper.vm.$emit('p-toolbox-item-clicked', 'logout')
    await nextTick()
    expect(sessionStorage.getItem('token')).toBeNull()
    expect(spyRouterPush).toHaveBeenCalledWith({ name: 'login' })
  })

  it('should display initial user even the data in store is empty and token on sessionStorage is valid', async () => {
    const myStore = store()
    myStore.$patch({
      user: null
    })
    wrapper = createWrapper()
    await nextTick()
    const initialContainer = wrapper.findComponent('[data-ut="userInitial"]')
    await nextTick()
    expect(initialContainer.text()).toBe('JD')
  })
})
