import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount, flushPromises } from '@vue/test-utils'
import SupportInfo from '.'

const createWrapper = () => mount(SupportInfo)

describe('supportInfo', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('can read the copyrights', async () => {
    await flushPromises()
    await vi.dynamicImportSettled()
    const copyrightLink = wrapper.find('[data-testid="copyright-link"]')
    const copyrightDrawer = wrapper.findComponent({ name: 'PDrawer' })

    expect(copyrightDrawer.props('modelValue')).toBeFalsy()
    await copyrightLink.trigger('click')
    expect(copyrightDrawer.props('modelValue')).toBeTruthy()
  })
})
