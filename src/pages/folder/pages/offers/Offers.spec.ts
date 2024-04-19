import { describe, it, expect, beforeEach, vi } from 'vitest'
import { type VueWrapper, mount } from '@vue/test-utils'
import Offers from '.'
import { getActiveOffersMocked } from './OffersMocks'

const activeOffersMocked = getActiveOffersMocked()

// Mocks
vi.mock('@/services/subscription', () => ({
  fetchAccountSubscriptions: vi.fn(() => Promise.resolve(activeOffersMocked)),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 5,
    },
  }),
}))

const createWrapper = (): VueWrapper => mount(Offers)

describe('offers', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it("should emit the 'activate-offers' event when the 'Activate Offers' button is clicked", async () => {
    const activateOffersButton = wrapper.find('[data-testid=folder-offer-activate-offers-button]')

    await activateOffersButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('activate-offers')
  })

  it('display the table containing the list of offers', () => {
    const rows = wrapper.findAll('tr.el-table__row')

    expect(rows).toHaveLength(activeOffersMocked.length)
  })
})
