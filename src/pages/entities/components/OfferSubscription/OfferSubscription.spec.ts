import { beforeEach, describe, it, expect } from 'vitest'
import OfferSubscription from '.'
import { type VueWrapper, mount } from '@vue/test-utils'
import { getMockedSubscriptionOffersServices } from './OfferSubscriptionMocks'

function getProviderCardComponent(wrapper: VueWrapper) {
  return wrapper.findComponent('[data-testid="provider-card"]') as VueWrapper
}

describe('offerSubscription', () => {
  const offerId = 1
  const productId = 'product-id'
  const subscriptionOffers = getMockedSubscriptionOffersServices()
  const subscriptionOffer = subscriptionOffers[0]
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(OfferSubscription, {
      props: {
        subscriptionOffer,
        offerId,
        selectedProducts: []
      }
    })
  })
  describe('props', () => {
    it('should contain card', () => {
      const providerCards = wrapper.findAll('[data-testid="provider-card"]')

      expect(providerCards).toHaveLength(subscriptionOffer?.providers.length ?? 0)
    })
  })
  describe('interactions', () => {
    it('should emit "select-product" when user has selected a product', () => {
      const providerCard = getProviderCardComponent(wrapper)
      providerCard.vm.$emit('select-product', offerId, productId)

      expect(wrapper.emitted('select-product')).toStrictEqual([[offerId, productId]])
    })
    it('should emit "deselect-product" when user has deselected a product', () => {
      const providerCard = getProviderCardComponent(wrapper)
      providerCard.vm.$emit('deselect-product', offerId, productId)

      expect(wrapper.emitted('deselect-product')).toStrictEqual([[offerId, productId]])
    })
  })
})
