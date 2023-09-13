import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import Header from './'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import helpers from '../../../tests/utils/helpers'

const { router, pinia, mockUser } = helpers()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => (mockUser)
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
  props: {
    menu: menuHeader
  },
  global: {
    plugins: [router],
    stubs: {
      PToolbox: true
    }
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
})
