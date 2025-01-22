import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount, flushPromises } from '@vue/test-utils'
import SupportInfo from '.'

const createWrapper = () => mount(SupportInfo)

describe('supportInfo', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('can read the phone number', async () => {
    await flushPromises()
    const phoneLink = wrapper.find('[data-testid="phone-link"]')

    expect(phoneLink.exists()).toBeTruthy()
    expect(phoneLink.attributes('href')).toMatch(/^tel:/)
  })

  it('can read the mail', async () => {
    await flushPromises()
    const emailLink = wrapper.find('[data-testid="email-link"]')

    expect(emailLink.exists()).toBeTruthy()
    expect(emailLink.attributes('href')).toMatch(/^mailto:/)
  })
})
