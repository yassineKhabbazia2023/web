import { describe, it, expect, beforeEach } from 'vitest'
import {
  addSelectedProduct,
  removeSelectedProduct,
  getInitialSelectedProducts,
  getPostSubscriptionRequest,
  getFirstDayOfYear,
} from './OffersDrawerUtils'
import type { SelectedProduct } from '@entities/common/types'
import { getMockedSubscriptionOffersServices } from '../../OfferSubscription/OfferSubscriptionMocks'
import { getMockedStepNotes } from '@entities/common/components/StepNote/StepNotesMock'
import type { PostSubscriptionRequest } from '@entities/services/subscription'
import { getMockedCollaborators } from '@entities/services/contact/contactMocks'
import { getMockedPrincipalContacts } from '../../PrincipalContact/PrincipalContactMocks'

const notes = getMockedStepNotes()
describe('offersDrawerUtils', () => {
  let selectedProducts: SelectedProduct[]
  let originalLength: number

  beforeEach(() => {
    selectedProducts = [
      {
        offerId: 101,
        productConfigurationId: 1,
      },
      {
        isMandatory: true,
        offerId: 101,
        productConfigurationId: 11,
      },
    ]
    originalLength = selectedProducts.length
  })

  describe('addSelectedProduct', () => {
    it('should add selectedProduct in list when not present', () => {
      addSelectedProduct(selectedProducts, 102, 2)
      expect(selectedProducts.at(-1)?.offerId).toBe(102)
    })
    it('should not add selectedProduct in list when already present', () => {
      addSelectedProduct(selectedProducts, 101, 1)
      expect(selectedProducts).toHaveLength(originalLength)
    })
  })

  describe('removeSelectedProduct', () => {
    it('should remove selectedProduct in list when already present', () => {
      removeSelectedProduct(selectedProducts, 101, 1)
      expect(selectedProducts).toHaveLength(originalLength - 1)
    })
    it('should not remove selectedProduct in list when not present', () => {
      removeSelectedProduct(selectedProducts, 102, 2)
      expect(selectedProducts).toHaveLength(originalLength)
    })
    it('should not remove selectedProduct in list when isMandatory', () => {
      removeSelectedProduct(selectedProducts, 101, 11)
      expect(selectedProducts).toHaveLength(originalLength)
    })
  })

  describe('getInitialSelectedProducts', () => {
    it('should return not optional and free product list', () => {
      const offerServices = getMockedSubscriptionOffersServices().at(0)
      const selectedProducts = getInitialSelectedProducts(offerServices)
      const expectedSelectedProducts: SelectedProduct[] = [
        {
          isMandatory: true,
          offerId: 1,
          productConfigurationId: 1,
        },
        {
          isMandatory: true,
          offerId: 1,
          productConfigurationId: 2,
        },
        {
          isMandatory: false,
          offerId: 1,
          productConfigurationId: 3,
        },
        {
          isMandatory: false,
          offerId: 1,
          productConfigurationId: 4,
        },
      ]
      expect(selectedProducts).toStrictEqual(expectedSelectedProducts)
    })
  })

  describe('getPostSubscriptionRequest', () => {
    const accountId = 5
    const userEmail = 'user@email.com'
    const collaborators = getMockedCollaborators()
    const clients = getMockedPrincipalContacts()
    const currentSubscriptionOffer = getMockedSubscriptionOffersServices().at(0)
    const selectedProducts = getInitialSelectedProducts(
      currentSubscriptionOffer,
    )

    it('should return not optional and free product list', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest(
        accountId,
        userEmail,
        collaborators,
        clients,
        currentSubscriptionOffer,
        selectedProducts,
        notes,
      )
      const collaboratorsIds = collaborators.map(({ id }) => id)
      const clientsIds = clients.map(({ contactId }) => contactId)
      const contacts = [...clientsIds, ...collaboratorsIds]

      const expectedPostSubscriptionRequest: PostSubscriptionRequest = {
        accountId,
        offerId: 1,
        productConfigurations: [1, 2, 3, 4],
        contacts,
        notes,
        applicant: 'user@email.com',
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest,
      )
    })
    it('should return empty undefined if currentSubscriptionOffer in undefined', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest(
        accountId,
        userEmail,
        collaborators,
        clients,
        undefined,
        selectedProducts,
        notes,
      )
      expect(postSubscriptionRequest).toBeUndefined()
    })
  })

  describe('getFirstDayOfYear', () => {
    it('should return the first day of the current year', () => {
      const expectedDay = new Date(new Date().getFullYear(), 0, 1).toISOString()
      expect(expectedDay).toStrictEqual(getFirstDayOfYear())
    })
  })
})
