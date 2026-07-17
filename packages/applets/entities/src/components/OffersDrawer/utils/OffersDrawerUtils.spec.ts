import { getMockedStepNotes } from '@entities/__mocks__/step-notes.mocks'
import type { SelectedProduct, ContactWithRoles } from '@entities/types'
import type { ContactFunction, PostSubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'
import { getMockedSubscriptionOffersServices } from '@entities/__mocks__/offer-subscription.mocks'

import {
  addSelectedProduct,
  removeSelectedProduct,
  getInitialSelectedProducts,
  getPostSubscriptionRequest,
  getFirstDayOfYear,
  getFormattedContactFunctions,
} from './OffersDrawerUtils'

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
    const roleIdMock = 13
    const accountId = 5
    const userEmail = 'user@email.com'
    const collaborators = getMockedCollaborators()
    const selectedCollaboratorIds = collaborators.map(({ id }) => ({
      contactId: id,
      roleIds: [roleIdMock],
    }))

    const clients = getMockedPrincipalContacts()
    const currentSubscriptionOffer = getMockedSubscriptionOffersServices().at(0)
    const selectedProducts = getInitialSelectedProducts(
      currentSubscriptionOffer,
    )

    it('should return not optional and free product list', () => {
      const currentSubscriptionOfferWithoutCollaboratorRoles = {
        ...getMockedSubscriptionOffersServices().at(0)!,
        functions: [],
      }
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer: currentSubscriptionOfferWithoutCollaboratorRoles,
        selectedProducts,
        notes,
      })
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
        contactFunctions: undefined,
        planId: undefined,
        planPricingId: undefined,
        hubName: undefined,
        hasNoSiren: undefined,
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest,
      )
    })

    it('should not return contactFunctions when there is NOT ANY collaborator roles', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer,
        selectedProducts,
        notes,
      })
      const collaboratorsIds = collaborators.map(({ id }) => id)
      const clientsIds = clients.map(({ contactId }) => contactId)
      const contacts = [...clientsIds, ...collaboratorsIds]
      const contactFunctions = selectedCollaboratorIds.map(({ contactId }) => ({
        contactId,
        functionId: roleIdMock,
      }))

      const expectedPostSubscriptionRequest: PostSubscriptionRequest = {
        accountId,
        offerId: 1,
        productConfigurations: [1, 2, 3, 4],
        contacts,
        notes,
        applicant: 'user@email.com',
        contactFunctions,
        planId: undefined,
        planPricingId: undefined,
        hubName: undefined,
        hasNoSiren: undefined,
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest,
      )
    })

    it('should include planId when selectedPlanId is provided', () => {
      const selectedPlanId = 2
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer,
        selectedProducts,
        notes,
        selectedPlanId,
      })
      const collaboratorsIds = collaborators.map(({ id }) => id)
      const clientsIds = clients.map(({ contactId }) => contactId)
      const contacts = [...clientsIds, ...collaboratorsIds]
      const contactFunctions = selectedCollaboratorIds.map(({ contactId }) => ({
        contactId,
        functionId: roleIdMock,
      }))

      const expectedPostSubscriptionRequest: PostSubscriptionRequest = {
        accountId,
        offerId: 1,
        productConfigurations: [1, 2, 3, 4],
        contacts,
        notes,
        applicant: 'user@email.com',
        contactFunctions,
        planId: selectedPlanId,
        planPricingId: undefined,
        hubName: undefined,
        hasNoSiren: undefined,
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest,
      )
    })

    it('should include planPricingId when selectedPricingId is provided', () => {
      const selectedPlanId = 2
      const selectedPricingId = 5
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer,
        selectedProducts,
        notes,
        selectedPlanId,
        selectedPricingId,
      })
      const collaboratorsIds = collaborators.map(({ id }) => id)
      const clientsIds = clients.map(({ contactId }) => contactId)
      const contacts = [...clientsIds, ...collaboratorsIds]
      const contactFunctions = selectedCollaboratorIds.map(({ contactId }) => ({
        contactId,
        functionId: roleIdMock,
      }))

      const expectedPostSubscriptionRequest: PostSubscriptionRequest = {
        accountId,
        offerId: 1,
        productConfigurations: [1, 2, 3, 4],
        contacts,
        notes,
        applicant: 'user@email.com',
        contactFunctions,
        planId: selectedPlanId,
        planPricingId: selectedPricingId,
        hubName: undefined,
        hasNoSiren: undefined,
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest,
      )
    })

    it('should include hubName when provided', () => {
      const hubName = 'Hub Normandie Seine Baie de Somme'
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        hubName,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer,
        selectedProducts,
        notes,
      })
      const collaboratorsIds = collaborators.map(({ id }) => id)
      const clientsIds = clients.map(({ contactId }) => contactId)
      const contacts = [...clientsIds, ...collaboratorsIds]
      const contactFunctions = selectedCollaboratorIds.map(({ contactId }) => ({
        contactId,
        functionId: roleIdMock,
      }))

      const expectedPostSubscriptionRequest: PostSubscriptionRequest = {
        accountId,
        offerId: 1,
        productConfigurations: [1, 2, 3, 4],
        contacts,
        notes,
        applicant: 'user@email.com',
        contactFunctions,
        planId: undefined,
        planPricingId: undefined,
        hubName,
        hasNoSiren: undefined,
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest,
      )
    })

    it('should return empty undefined if currentSubscriptionOffer in undefined', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer: undefined,
        selectedProducts,
        notes,
      })
      expect(postSubscriptionRequest).toBeUndefined()
    })

    it('should include hasNoSiren when provided', () => {
      const currentSubscriptionOfferWithoutCollaboratorRoles = {
        ...getMockedSubscriptionOffersServices().at(0)!,
        functions: [],
      }
      const postSubscriptionRequest = getPostSubscriptionRequest({
        accountId,
        userEmail,
        collaboratorsWithRoles: selectedCollaboratorIds,
        clients,
        currentSubscriptionOffer: currentSubscriptionOfferWithoutCollaboratorRoles,
        selectedProducts,
        notes,
        hasNoSiren: true,
      })

      expect(postSubscriptionRequest?.hasNoSiren).toBe(true)
    })
  })

  describe('getFirstDayOfYear', () => {
    it('should return the first day of the current year', () => {
      const expectedDay = new Date(new Date().getFullYear(), 0, 1).toISOString()
      expect(expectedDay).toStrictEqual(getFirstDayOfYear())
    })
  })

  describe('getFormattedContactFunctions', () => {
    it('should return formatted data', () => {
      const collaboratorsWithRoles: ContactWithRoles[] = [{
        contactId: 1,
        roleIds: [2, 3],
      }, {
        contactId: 4,
        roleIds: [5],
      }, {
        contactId: 6,
        roleIds: [],
      }]
      const expectedFormattedContactsWithRole: ContactFunction[] = [{
        contactId: 1,
        functionId: 2,
      }, {
        contactId: 1,
        functionId: 3,
      }, {
        contactId: 4,
        functionId: 5,
      }]
      const contactFunctions = getFormattedContactFunctions(collaboratorsWithRoles)
      expect(contactFunctions).toStrictEqual(expectedFormattedContactsWithRole)
    })
  })
})
