import { mount } from '@vue/test-utils'
import Header from '.'
import { expect, describe, it, vi } from 'vitest'

const waitForAsyncOperations = async () => {
  await vi.dynamicImportSettled()
}

describe('header.vue', () => {

  it('renders translations correctly', async () => {
    const wrapper = mount(Header)
    await waitForAsyncOperations()
    expect(wrapper.find('.header__title').text()).toBe('Banking flows')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('emits click event when button is clicked', async () => {
    const wrapper = mount(Header)
    await waitForAsyncOperations()
    expect(wrapper.vm.openDrawer).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    console.log('READ THIS !! :', wrapper.html())
    expect(wrapper.vm.openDrawer).toBeTruthy()
  })
})
