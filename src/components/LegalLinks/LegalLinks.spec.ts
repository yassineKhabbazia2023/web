import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import LegalLinks from '.'

const createWrapper = (): VueWrapper<any> => mount(LegalLinks)

describe('legalLinks', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('has links in the footer', () => {
    expect(wrapper.find('.legal-links').exists()).toBeTruthy()
  })
  it('can read the notices', async () => {
    await flushPromises()
    await vi.dynamicImportSettled()
    const noticeLink = wrapper.find('[data-testid="legal-links-notices"]')
    const cookiesNoticesDrawer = wrapper.find('[data-testid="cookies-notices-drawer"]')

    expect(cookiesNoticesDrawer.classes()).toContainEqual('close')

    await noticeLink.trigger('click')
    expect(cookiesNoticesDrawer.classes()).toContainEqual('open')
  })
})
