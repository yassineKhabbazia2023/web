import { describe, it, expect, beforeEach } from 'vitest'
import {
  addSelectedProduct, removeSelectedProduct, getInitialSelectedProducts, getPostSubscriptionRequest
} from './OffersDrawerUtils'
import type { SelectedProduct } from './OffersDrawerTypes'
import { getMockedSubscriptionOffersServices } from '../OfferSubscription/OfferSubscriptionMocks'
import { getMockedPrincipalContact } from '../PrincipalContact/PrincipalContactMocks'

describe('offersDrawerUtils', () => {
  let selectedProducts: SelectedProduct[]
  let originalLength: number

  beforeEach(() => {
    selectedProducts = [{
      offerId: 101,
      productId: 'product-1'
    }, {
      isMandatory: true,
      offerId: 101,
      productId: 'product-11'
    }]
    originalLength = selectedProducts.length
  })

  describe('addSelectedProduct', () => {
    it('should add selectedProduct in list when not present', () => {
      addSelectedProduct(selectedProducts, 102, 'product-2')
      expect(selectedProducts.at(-1)?.offerId).toBe(102)
    })
    it('should not add selectedProduct in list when already present', () => {
      addSelectedProduct(selectedProducts, 101, 'product-1')
      expect(selectedProducts).toHaveLength(originalLength)
    })
  })

  describe('removeSelectedProduct', () => {
    it('should remove selectedProduct in list when already present', () => {
      removeSelectedProduct(selectedProducts, 101, 'product-1')
      expect(selectedProducts).toHaveLength(originalLength - 1)
    })
    it('should not remove selectedProduct in list when not present', () => {
      removeSelectedProduct(selectedProducts, 102, 'product-2')
      expect(selectedProducts).toHaveLength(originalLength)
    })
    it('should not remove selectedProduct in list when isMandatory', () => {
      removeSelectedProduct(selectedProducts, 101, 'product-11')
      expect(selectedProducts).toHaveLength(originalLength)
    })
  })

  describe('getInitialSelectedProducts', () => {
    it('should return not optional and free product list', () => {
      const offerServices = getMockedSubscriptionOffersServices().at(0)
      const selectedProducts = getInitialSelectedProducts(offerServices)
      const expectedSelectedProducts: SelectedProduct[] = [{
        isMandatory: true,
        offerId: 1,
        productId: 'product-id-1'
      }, {
        isMandatory: true,
        offerId: 1,
        productId: 'product-id-2'
      }, {
        isMandatory: false,
        offerId: 1,
        productId: 'product-id-3'
      }, {
        isMandatory: false,
        offerId: 1,
        productId: 'product-id-4'
      }]
      expect(selectedProducts).toStrictEqual(expectedSelectedProducts)
    })
  })

  describe('getPostSubscriptionRequest', () => {
    const accountNumber = 'account-number'
    const accountId = 'account-id'
    const userEmail = 'user@email.com'
    const principalContact = getMockedPrincipalContact()
    const currentSubscriptionOffer = getMockedSubscriptionOffersServices().at(0)
    const selectedProducts = getInitialSelectedProducts(currentSubscriptionOffer)

    it('should return not optional and free product list', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest(
        accountNumber,
        accountId,
        userEmail,
        principalContact,
        currentSubscriptionOffer,
        selectedProducts
      )
      const expectedPostSubscriptionRequest = {
        account: {
          globalAccountId: accountId,
          accountNumber
        },
        applicant: 'user@email.com',
        approvalRequired: true,
        collaborators: [],
        globalOfferId: 'offer-id-1',
        notes: [],
        products: [
          'product-id-1',
          'product-id-2',
          'product-id-3',
          'product-id-4'
        ],
        users: [
          'cgreenall0@stumbleupon.com'
        ]
      }
      expect(postSubscriptionRequest).toStrictEqual(expectedPostSubscriptionRequest)
    })
    it('should return empty undefined if currentSubscriptionOffer in undefined', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest(
        accountNumber,
        accountId,
        userEmail,
        principalContact,
        undefined,
        selectedProducts
      )
      expect(postSubscriptionRequest).toBeUndefined()
    })
  })
})
