import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Header from '.'
import { expect, describe, it, vi } from 'vitest'

const createWrapper = () =>
  wrapperFactory(Header)

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ([])
  })
}))

describe('header.vue', () => {
  const wrapper = createWrapper()
  it('renders translations correctly', () => {
    expect(wrapper.find('.header__title').text()).toBe('Banking flows')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('emits click event when button is clicked', async () => {
    expect(wrapper.vm.openDrawer).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.vm.openDrawer).toBeTruthy()
  })
})
