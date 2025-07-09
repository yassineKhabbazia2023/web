import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { shallowMount, flushPromises } from '@vue/test-utils'
import * as SubscriptionServices from '@entities/services/subscription'
import { nextTick } from 'vue'
import { getActiveOffersMocked } from './Offers.mocks'
import {
  getMockedEntity,
  CurrentUserManagerMock,
  hasPermissionMock,
  getStoreMock,
  getMockedUser,
} from '@pulse/common/mocks'
import { useSelectedEntityStore, useUserStore } from '@pulse/common/stores'

import Offers from '.'

// Mocks
const activeOffersMocked = getActiveOffersMocked()
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
const userStoreMock = getStoreMock(useUserStore)

const fetchAccountSubscriptionsMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/subscription', () => ({
  fetchAccountSubscriptions: fetchAccountSubscriptionsMock,
}))
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 5,
    },
  }),
}))

const mockedEntity = getMockedEntity({
  accountId: 1,
  accountNumber: '3669209950',
  legalName: 'Restaurant Le Grand Bleu',
  color: 'orange',
})
const userMock = getMockedUser()

const createWrapper = (isCollab = true, hasPermission = true) => {
  userStoreMock.isCollab = isCollab
  hasPermissionMock.mockImplementation((_: string | string[]) => hasPermission)

  return shallowMount(Offers, {
    global: {
      stubs: {
        PBlockHeader: {
          name: 'PBlockHeader',
          template: '<div><slot /></div>',
          props: [
            'pTitle',
            'pDescription',
          ],
        },
        PButton: {
          template: '<div><slot /></div>',
        },
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
          props: [
            'pData',
          ],
        },
        OffersDrawer: {
          name: 'OffersDrawer',
          template: '<div><slot /></div>',
          methods: {
            initDrawerForCurrentAccount: vi.fn(),
          },
          props: [
            'modelValue',
          ],
        },
      },
    },
  })
}
describe('offers', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    fetchAccountSubscriptionsMock.mockResolvedValue(activeOffersMocked)
    userStoreMock.user = userMock
    selectedEntityStoreMock.selectedEntity = mockedEntity

    wrapper = createWrapper()
  })

  describe('display', () => {
    it('display the table containing the list of offers', () => {
      const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
      const columns = wrapper.findAllComponents({ name: 'PTableColumn' })
      const pTable = wrapper.findComponent({ name: 'PTable' })
      const rows = pTable.props('pData')

      expect(columns).toHaveLength(2)
      expect(rows).toHaveLength(activeOffersMocked.length)
      expect(offersDrawer.exists()).toBeFalsy()
    })

    it('should not display the activate offers button if the user does not have permission', async () => {
      const wrapper = createWrapper(true, false)
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
      const wrapper = createWrapper(false)
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

    it("should reload offers and close OffersDrawer when it emits 'offer-saved'", async () => {
      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )
      expect(fetchAccountSubscriptionsMock).toHaveBeenCalledOnce()

      await activateOffersButton.trigger('click')
      const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
      expect(offersDrawer.props('modelValue')).toBe(true)
      offersDrawer.vm.$emit('offer-saved')
      await flushPromises()

      const offersDrawerAfter = wrapper.findComponent({ name: 'OffersDrawer' })
      expect(fetchAccountSubscriptionsMock).toHaveBeenCalledTimes(2)
      expect(offersDrawerAfter.props('modelValue')).toBe(false)
      expect(offersDrawerAfter.exists()).toBe(true)
    })

    it('should catch the error and use logger.error when the API call fails', async () => {
      vi.spyOn(
        SubscriptionServices,
        'fetchAccountSubscriptions',
      ).mockRejectedValueOnce('Fetch API ERROR')
      createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'fetching account subscriptions',
        'Fetch API ERROR',
      )
    })
  })
})
