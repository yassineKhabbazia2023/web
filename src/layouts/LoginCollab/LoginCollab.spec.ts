
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import LoginCollab from '.'

const createWrapper = () => shallowMount(LoginCollab)

describe('loginCollab', () => {
  it('can read the copyrights', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    await flushPromises()
    await vi.dynamicImportSettled()
    const loginCollabCopyrightLink = wrapper.find('[data-testid="login-collab-copyright-link"]')
    const loginCollabDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(loginCollabDrawer.props('modelValue')).toBeFalsy()
    await loginCollabCopyrightLink.trigger('click')
    expect(loginCollabDrawer.props('modelValue')).toBeTruthy()
  })
})
