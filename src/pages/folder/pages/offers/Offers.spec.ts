import { describe, it, expect, beforeEach } from 'vitest'
import { type VueWrapper, mount } from '@vue/test-utils'
import Offers from '.'
import { getActiveOffersMocked } from './OffersMocks'

const activeOffersMocked = getActiveOffersMocked()
const createWrapper = (): VueWrapper => mount(Offers)

describe('offers', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it("should emit the 'activate-offers' event when the 'Activate Offers' button is clicked", async () => {
    const activateOffersButton = wrapper.find('[data-testid=activate-offers]')

    await activateOffersButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('activate-offers')
  })

  it('display the table containing the list of offers', () => {
    const rows = wrapper.findAll('tr.el-table__row')

    expect(rows).toHaveLength(activeOffersMocked.length)
  })
})
