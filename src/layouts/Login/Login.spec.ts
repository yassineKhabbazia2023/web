/**
 * @jest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount, flushPromises } from '@vue/test-utils'
import Login from './'

const createWrapper = () => mount(Login)

describe('login', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })

  it('can read the copyrights', async () => {
    await flushPromises()
    await vi.dynamicImportSettled()
    const copyrightsLink = wrapper.find('.support + p .link')
    const getLoginCopyrightDrawerClasses = () => wrapper.find('[data-testid="login-copyright-drawer"]').classes()

    expect(getLoginCopyrightDrawerClasses()).not.toContainEqual('open')
    await copyrightsLink.trigger('click')
    expect(getLoginCopyrightDrawerClasses()).toContainEqual('open')
  })
})
