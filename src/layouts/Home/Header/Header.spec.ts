import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import Header from './'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import helpers from '../../../tests/utils/helpers'
import { nextTick } from 'vue'

const { router, pinia, mockUser } = helpers()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => (mockUser),
    actions: {
      logout: () => vi.fn()
    }
  }),
  commonPinia: () => pinia
}))

const menuBottomMenu = [
  {
    icon: 'PIColumnsGap',
    name: 'Dashboard',
    path: '',
    component: {
      render: () => 'Dashboard'
    }
  }
]

const menuHeader = menuBottomMenu.map(({ name, path, icon }) => ({
  text: name,
  icon,
  path
}))

const createWrapper = () => mount(Header, {
  attachTo: document.body,
  props: {
    menu: menuHeader
  },
  global: {
    plugins: [router]
  }
})

describe('header', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('should display header section', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    router.push({ name: 'My entities' })
    await waitForAsyncImports(50)
    const header = wrapper.find('.el-menu--header')
    const logo = wrapper.find('.menu-item--logo')

    expect(header.exists()).toBeTruthy()
    expect(logo.exists()).toBeTruthy()
  })

  it('should disconnect user while clicking on logout button', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spyRouterPush = vi.spyOn(router, 'push')
    await waitForAsyncImports(50)
    await wrapper.find('.el-avatar').trigger('click')
    await nextTick()
    expect(document.body.innerHTML).contains('p-toolbox-item')

    const logoutButton = document.getElementsByClassName('p-toolbox-item')[0] as HTMLElement
    await logoutButton.click()
    await nextTick()
    expect(sessionStorage.getItem('token')).toBeNull()
    expect(spyRouterPush).toHaveBeenCalledWith({ name: 'login' })
  })

  it.todo('should behaves correctly when user is not set and isAuthenticated is true')
})
