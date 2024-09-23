import { describe, it, expect, beforeEach, vi, type MockInstance } from 'vitest'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { commonPinia as pinia, commonStore } from '@pulse/Common'
import * as SubscriptionServices from '@entities/services/subscription'
import { nextTick } from 'vue'
import { mockHasPermission } from '@entities/../vitest.setup'
import { getActiveOffersMocked } from './OffersMocks'
import Offers from '.'

// Mocks
const activeOffersMocked = getActiveOffersMocked()
vi.mock('@entities/services/subscription', () => ({
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

      expect(columns).toHaveLength(2)
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

    it('should display the correct header title and subtitle for the collaborator', async () => {
      await flushPromises()
      const pBlockHeader = wrapper.findComponent({ name: 'PBlockHeader' })

      expect(pBlockHeader.props('pTitle')).toBe('Offer activation')
      expect(pBlockHeader.props('pDescription')).toBe('Manage the offers enabled and activatable for this folder.')
    })

    it('should display the correct header title and subtitle for the client', async () => {
      const store = commonStore()
      // @ts-expect-error: Getter is read only
      store.isCollab = false
      await nextTick()
      const pBlockHeader = wrapper.findComponent({ name: 'PBlockHeader' })

      expect(pBlockHeader.props('pTitle')).toBe('Activated offers')
      expect(pBlockHeader.props('pDescription')).toBe('Digital offers activated for this entity.')
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

    it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )
      await activateOffersButton.trigger('click')
      const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
      offersDrawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(offersDrawer.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should catch the error and display it in the console when the API call fails', async () => {
      const consoleErrorSpy: MockInstance = vi.spyOn(console, 'error')
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
