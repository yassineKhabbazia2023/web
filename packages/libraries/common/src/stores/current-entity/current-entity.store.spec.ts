import { setActivePinia, createPinia } from 'pinia'
import { useCurrentEntityStore } from './current-entity.store'
import { getMockedEntitySummary, getMockedSubscription } from '@common/__mocks__'
import { AccountType, SubscriptionOfferCode } from '@pulse/common/enums'

const currentEntityMock = getMockedEntitySummary()

describe('test currentEntityStore', () => {
  let currentEntityStore: ReturnType<typeof useCurrentEntityStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    currentEntityStore = useCurrentEntityStore()
  })

  it('should set currentEntity properly when call setCurrentEntity()', () => {
    currentEntityStore.setCurrentEntity(currentEntityMock)

    expect(currentEntityStore.currentEntity).toStrictEqual(currentEntityMock)
  })

  it('should set clarity visibility correctly when calling setCurrentEntityClarityVisibility()', () => {
    currentEntityStore.setCurrentEntity(currentEntityMock)

    currentEntityStore.setCurrentEntityClarityVisibility(true)
    expect(currentEntityStore.currentEntity?.isClarityVisible).toBe(true)

    currentEntityStore.setCurrentEntityClarityVisibility(false)
    expect(currentEntityStore.currentEntity?.isClarityVisible).toBe(false)
  })

  it('should do nothing when setting clarity visibility if currentEntity is undefined', () => {
    currentEntityStore.currentEntity = undefined
    expect(() => {
      currentEntityStore.setCurrentEntityClarityVisibility(true)
    }).not.toThrow()
    expect(currentEntityStore.currentEntity).toBeUndefined()
  })

  it('should reset currentEntity to undefined when calling reset()', () => {
    currentEntityStore.setCurrentEntity(currentEntityMock)
    expect(currentEntityStore.currentEntity).toBeDefined()

    currentEntityStore.reset()
    expect(currentEntityStore.currentEntity).toBeUndefined()
  })

  describe('currentAccountType', () => {
    it('should return REGULAR by default when no entity is set', () => {
      expect(currentEntityStore.currentAccountType).toBe(AccountType.REGULAR)
    })

    it('should return REGULAR when entity has REGULAR type', () => {
      currentEntityStore.setCurrentEntity(getMockedEntitySummary({ accountType: AccountType.REGULAR }))

      expect(currentEntityStore.currentAccountType).toBe(AccountType.REGULAR)
    })

    it('should return PROSPECT when entity has PROSPECT type', () => {
      currentEntityStore.setCurrentEntity(getMockedEntitySummary({ accountType: AccountType.PROSPECT }))

      expect(currentEntityStore.currentAccountType).toBe(AccountType.PROSPECT)
    })

    it('should normalize raw backend account types to REGULAR (e.g. "client")', () => {
      currentEntityStore.setCurrentEntity(getMockedEntitySummary({ accountType: 'client' as unknown as AccountType }))

      expect(currentEntityStore.currentAccountType).toBe(AccountType.REGULAR)
    })
  })

  describe('hasOffer', () => {
    const tests = [{
      offerCode: SubscriptionOfferCode.PENNYLANE,
      currentEntity: undefined,
      description: 'should return false when not entity is selected',
      expectedHasOffer: false,
    }, {
      offerCode: SubscriptionOfferCode.PENNYLANE,
      currentEntity: {
        ...currentEntityMock,
        subscriptions: [
          getMockedSubscription(),
        ],
      },
      description: 'should return false when current entity does not contain Pennylane offer',
      expectedHasOffer: false,
    }, {
      offerCode: SubscriptionOfferCode.PENNYLANE,
      currentEntity: {
        ...currentEntityMock,
        subscriptions: [
          getMockedSubscription(),
          getMockedSubscription({
            offerCode: SubscriptionOfferCode.PENNYLANE,
          }),
        ],
      },
      description: 'should return true when current entity contains validated Pennylane offer',
      expectedHasOffer: true,
    }, {
      offerCode: SubscriptionOfferCode.PENNYLANE,
      currentEntity: {
        ...currentEntityMock,
        subscriptions: [
          getMockedSubscription(),
          getMockedSubscription({
            offerCode: SubscriptionOfferCode.PENNYLANE,
            status: 'pending',
          }),
        ],
      },
      description: 'should return false when current entity contains non validated Pennylane offer',
      expectedHasOffer: false,
    }]
    it.each(tests)('$description', ({
      currentEntity,
      offerCode,
      expectedHasOffer,
    }) => {
      currentEntityStore.setCurrentEntity(currentEntity)
      const hasOffer = currentEntityStore.hasOffer(offerCode)

      expect(hasOffer).toBe(expectedHasOffer)
    })
  })
})
