import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { defineStore, setActivePinia } from 'pinia'
import Navbar from '.'
import helpers from '../../../tests/utils/helpers'

const { router, pinia, mockUser } = helpers()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => (mockUser)
  }),
  commonPinia: () => pinia
}))

const createWrapper = () => mount(Navbar, {
  shallow: true,
  global: {
    plugins: [router]
  }
})

describe('navbar', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('should display navbar section', () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const aside = wrapper.find('.aside')

    expect(aside.exists()).toBeTruthy()
  })
})
