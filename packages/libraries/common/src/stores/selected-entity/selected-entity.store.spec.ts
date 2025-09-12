import { setActivePinia, createPinia } from 'pinia'
import { useSelectedEntityStore } from './selected-entity.store'
import { getMockedEntitySummary, getMockedSubscription } from '@common/__mocks__'
import { SubscriptionOfferCode } from '@pulse/common/enums'

const selectedEntityMock = getMockedEntitySummary()

describe('test selectedEntityStore', () => {
  let selectedEntityStore: ReturnType<typeof useSelectedEntityStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    selectedEntityStore = useSelectedEntityStore()
  })

  it('should set selectedEntity properly when call setSelectedEntity()', () => {
    selectedEntityStore.setSelectedEntity(selectedEntityMock)

    expect(selectedEntityStore.selectedEntity).toStrictEqual(selectedEntityMock)
  })

  it('should set clarity visibility correctly when calling setSelectedEntityClarityVisibility()', () => {
    selectedEntityStore.setSelectedEntity(selectedEntityMock)

    selectedEntityStore.setSelectedEntityClarityVisibility(true)
    expect(selectedEntityStore.selectedEntity?.isClarityVisible).toBe(true)

    selectedEntityStore.setSelectedEntityClarityVisibility(false)
    expect(selectedEntityStore.selectedEntity?.isClarityVisible).toBe(false)
  })

  it('should do nothing when setting clarity visibility if selectedEntity is undefined', () => {
    selectedEntityStore.selectedEntity = undefined
    expect(() => {
      selectedEntityStore.setSelectedEntityClarityVisibility(true)
    }).not.toThrow()
    expect(selectedEntityStore.selectedEntity).toBeUndefined()
  })

  it('should reset selectedEntity to undefined when calling reset()', () => {
    selectedEntityStore.setSelectedEntity(selectedEntityMock)
    expect(selectedEntityStore.selectedEntity).toBeDefined()

    selectedEntityStore.reset()
    expect(selectedEntityStore.selectedEntity).toBeUndefined()
  })

  describe('hasOffer', () => {
    const tests = [{
      offerCode: SubscriptionOfferCode.PENNYLANE,
      selectedEntity: undefined,
      description: 'should return false when not entity is selected',
      expectedHasOffer: false,
    }, {
      offerCode: SubscriptionOfferCode.PENNYLANE,
      selectedEntity: {
        ...selectedEntityMock,
        subscriptions: [
          getMockedSubscription(),
        ],
      },
      description: 'should return false when selected entity does not contain Pennylane offer',
      expectedHasOffer: false,
    }, {
      offerCode: SubscriptionOfferCode.PENNYLANE,
      selectedEntity: {
        ...selectedEntityMock,
        subscriptions: [
          getMockedSubscription(),
          getMockedSubscription({
            offerCode: SubscriptionOfferCode.PENNYLANE,
          }),
        ],
      },
      description: 'should return false when selected entity does not contain Pennylane offer',
      expectedHasOffer: true,
    }]
    it.each(tests)('$description', ({
      selectedEntity,
      offerCode,
      expectedHasOffer,
    }) => {
      selectedEntityStore.setSelectedEntity(selectedEntity)
      const hasOffer = selectedEntityStore.hasOffer(offerCode)

      expect(hasOffer).toBe(expectedHasOffer)
    })
  })
})
