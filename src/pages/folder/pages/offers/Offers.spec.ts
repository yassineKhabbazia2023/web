import { describe, it, expect, beforeEach, vi, type SpyInstance } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonStore, commonPinia as pinia } from '@kpmg/common'
import * as SubscriptionServices from '@/services/subscription'
import { getActiveOffersMocked } from './OffersMocks'
import Offers from '.'

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
vi.mock('@kpmg/common', () => ({
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
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
      const columns = wrapper.findAllComponents({ name: 'PTableColumn' })
      const rows = wrapper.findAll('tr.el-table__row')

      expect(columns).toHaveLength(3)
      expect(rows).toHaveLength(activeOffersMocked.length)
    })

    it('should not display the actions column and activate the offers button for the client', async () => {
      const store = commonStore()
      // @ts-expect-error: Getter is read only
      store.isCollab = false
      await flushPromises()
      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )
      const columns = wrapper.findAllComponents({ name: 'PTableColumn' })

      expect(columns).toHaveLength(2)
      expect(activateOffersButton.exists()).toBeFalsy()
    })
  })

  describe('events', () => {
    it("should emit the 'activate-offers' event when the 'Activate Offers' button is clicked", async () => {
      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )

      await activateOffersButton.trigger('click')
      expect(wrapper.emitted()).toHaveProperty('activate-offers')
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
