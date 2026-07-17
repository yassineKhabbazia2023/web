import { shallowMount, flushPromises } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { subscriptionRequestMock } from '@entities/__mocks__/subscription.mocks'
import { getMockedEntity, getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { RouteParam } from '@pulse/common/enums'
import { fetchAccountSubscriptions } from '@entities/services/subscription'

import Offers from './Offers.vue'


const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const userStoreMock = getStoreMock(useUserStore)

const mockedEntity = getMockedEntity({
  accountId: 1,
  accountNumber: '3669209950',
  legalName: 'Restaurant Le Grand Bleu',
  color: 'orange',
})
const entitySummaryMock = getMockedEntitySummary(mockedEntity)

const userMock = getMockedUser()

let hasPermissionMock: MockInstance

beforeEach(() => {
  hasPermissionMock = armCurrentUserPermissions()
  vi.mocked(fetchAccountSubscriptions).mockResolvedValue(subscriptionRequestMock)
  vi.mocked(useRoute).mockReturnValue({
    params: {
      [RouteParam.ENTITY_ID]: 5,
    },
  } as unknown as RouteLocationNormalizedLoaded)
  userStoreMock.user = userMock
  currentEntityStoreMock.currentEntity = entitySummaryMock
})

const createWrapper = (isCollab = true, hasPermission = true) => {
  userStoreMock.isCollab = isCollab
  hasPermissionMock.mockReturnValue(hasPermission)

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
  describe('display', () => {
    // The identity i18n stub returns the raw key: the header assertions below
    // pin the key choice, not the translated wording.
    it('should not display the activate offers button if the user does not have permission', async () => {
      const wrapper = createWrapper(true, false)
      await flushPromises()

      const activateOffersButton = wrapper.find(
        '[data-testid=folder-offer-activate-offers-button]',
      )
      expect(activateOffersButton.exists()).toBe(false)
    })

    it('should display the correct header title and subtitle for the collaborator', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      const pBlockHeader = wrapper.findComponent({ name: 'PBlockHeader' })

      expect(pBlockHeader.props('pTitle')).toBe('collabHeaderTitle')
      expect(pBlockHeader.props('pDescription')).toBe('collabHeaderSubtitle')
    })

    it('should display the correct header title and subtitle for the client', async () => {
      const wrapper = createWrapper(false)
      await flushPromises()

      const pBlockHeader = wrapper.findComponent({ name: 'PBlockHeader' })

      expect(pBlockHeader.props('pTitle')).toBe('clientHeaderTitle')
      expect(pBlockHeader.props('pDescription')).toBe('clientHeaderSubtitle')
    })
  })
})
