import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount, flushPromises } from '@vue/test-utils'
import SupportInfoCollab from '.'

const createWrapper = () => shallowMount(SupportInfoCollab)

describe('supportInfoCollab', () => {
  const wrapper: VueWrapper<any> = createWrapper()

  it('can read the phone number', async () => {
    await flushPromises()
    const phoneLink = wrapper.find('[data-testid="phone-link"]')

    expect(phoneLink.exists()).toBeTruthy()
    expect(phoneLink.attributes('href')).toMatch(/^tel:/)
  })
})
