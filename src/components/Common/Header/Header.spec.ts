import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Header from '.'
import { expect, describe, it } from 'vitest'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

const createWrapper = () =>
  wrapperFactory(Header)

describe('header.vue', () => {
  const wrapper = createWrapper()
  it('renders translations correctly', async () => {
    await waitForAsyncImports(30)
    expect(wrapper.find('.header__title').text()).toBe('Banking flows')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('emits click event when button is clicked', async () => {
    await waitForAsyncImports(30)
    expect(wrapper.vm.openDrawer).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.vm.openDrawer).toBeTruthy()
  })
})
