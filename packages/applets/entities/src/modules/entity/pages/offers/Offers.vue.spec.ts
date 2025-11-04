import { shallowMount, flushPromises } from '@vue/test-utils'
import { getActiveOffersMocked } from '@entities/__mocks__/offers.mocks'
import {
  getMockedEntity,
  CurrentUserManagerMock,
  hasPermissionMock,
  getStoreMock,
  getMockedUser,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'

import Offers from '.'

// Mocks
const activeOffersMocked = getActiveOffersMocked()

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
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
const entitySummaryMock = getMockedEntitySummary(mockedEntity)

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
    currentEntityStoreMock.currentEntity = entitySummaryMock

    wrapper = createWrapper()
  })

  describe('display', () => {
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
})
