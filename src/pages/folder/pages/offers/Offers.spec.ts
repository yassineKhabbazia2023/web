import { describe, it, expect, beforeEach, vi, type SpyInstance } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@kpmg/common'
import * as SubscriptionServices from '@/services/subscription'
import { mockHasPermission } from '@/../vitest.setup'
import { getActiveOffersMocked } from './OffersMocks'
import Offers from '.'

// Mocks
const activeOffersMocked = getActiveOffersMocked()
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

const createWrapper = (): VueWrapper =>
  mount(Offers, { plugins: [createTestingPinia()] })

describe('offers', () => {
  let wrapper: VueWrapper
  setActivePinia(pinia)
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('display', () => {
    it('display the table containing the list of offers', () => {
      const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
      const columns = wrapper.findAllComponents({ name: 'PTableColumn' })
      const rows = wrapper.findAll('tr.el-table__row')

      expect(columns).toHaveLength(3)
      expect(rows).toHaveLength(activeOffersMocked.length)
      expect(offersDrawer.exists()).toBeFalsy()
    })

    it('should not display the activate offers button if the user does not have permission', async () => {
      mockHasPermission.mockImplementation(() => false)
      wrapper = createWrapper()
      await flushPromises()
      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )
      expect(activateOffersButton.exists()).toBeFalsy()
    })
  })

  describe('events', () => {
    it('should display the offers drawer when clicking on the activate offers button', async () => {
      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )
      await activateOffersButton.trigger('click')
      const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })

      expect(offersDrawer.exists()).toBeTruthy()
      expect(offersDrawer.props('modelValue')).toBeTruthy()
    })

    it('should catch the error and display it in the console when the API call fails', async () => {
      const consoleErrorSpy: SpyInstance = vi.spyOn(console, 'error')
      vi.spyOn(
        SubscriptionServices,
        'fetchAccountSubscriptions',
      ).mockRejectedValueOnce('Fetch API ERROR')
      wrapper = createWrapper()
      await flushPromises()

      expect(consoleErrorSpy).toHaveBeenCalledOnce()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'fetching account subscriptions',
        'Fetch API ERROR',
      )
    })
  })
})
