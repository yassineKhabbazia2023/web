/**
 * @jest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount, flushPromises } from '@vue/test-utils'
import Login from './'

const createWrapper = () => shallowMount(Login)

describe('login', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })

  it('can read the copyrights', async () => {
    await flushPromises()
    await vi.dynamicImportSettled()
    const loginCopyrightLink = wrapper.find('[data-testid="login-copyright-link"]')
    const loginDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(loginDrawer.props('modelValue')).toBeFalsy()
    await loginCopyrightLink.trigger('click')
    expect(loginDrawer.props('modelValue')).toBeTruthy()
  })
})
