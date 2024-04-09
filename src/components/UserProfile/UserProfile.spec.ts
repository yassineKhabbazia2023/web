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

let wrapper: VueWrapper<any>

describe('userProfile', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has the my information tab activated by default', () => {
    const activeTab = wrapper.find('.el-tabs__item.is-active')
    expect(activeTab.text()).toContain('My Information')
  })
})
