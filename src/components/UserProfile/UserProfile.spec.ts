import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import UserProfile from './'

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(UserProfile, {
    props: {
      hasDrawerOpened: true,
    },
    global: {
      stubs: ['MyInformation'],
    },
  })

describe('userProfile', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('has the my information tab activated by default', () => {
    const drawer = document.querySelector('.p-drawer') as HTMLElement
    const activeTab = drawer.querySelector('.el-tabs__item.is-active') as HTMLElement
    expect(activeTab.textContent).toContain('My Information')
  })
})
