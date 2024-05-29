
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import LoginCollab from '.'

const createWrapper = () => mount(LoginCollab)

describe('loginCollab', () => {
  it('can read the copyrights', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await flushPromises()
    await vi.dynamicImportSettled()
    const copyrightsLink = wrapper.find('.support + p .link')
    const getLoginCopyrightDrawerClasses = () => wrapper.find('[data-testid="login-copyright-drawer"]').classes()

    expect(getLoginCopyrightDrawerClasses()).not.toContainEqual('open')
    await copyrightsLink.trigger('click')
    expect(getLoginCopyrightDrawerClasses()).toContainEqual('open')
  })
})
