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
    const copyrightsLink = wrapper.find('[data-testid="legal-links-notices"]')
    const isDrawerOpen = () => wrapper.find('.p-drawer.open')

    expect(isDrawerOpen().exists()).toBeFalsy()

    await copyrightsLink.trigger('click')
    expect(isDrawerOpen().exists()).toBeTruthy()
  })
})
