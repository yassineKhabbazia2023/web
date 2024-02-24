import { describe, it, expect, beforeEach } from 'vitest'
import {
  addSelectedProduct,
  removeSelectedProduct,
  getInitialSelectedProducts,
  getPostSubscriptionRequest,
  getFirstDayOfYear,
  getMappedAPIData
} from './OffersDrawerUtils'
import type { SelectedProduct } from '../OffersDrawerTypes'
import type { Account } from '@/services/account'
import { getMockedSubscriptionOffersServices } from '../../OfferSubscription/OfferSubscriptionMocks'
import { getMockedPrincipalContact } from '../../PrincipalContact/PrincipalContactMocks'
import { getMockedAccount } from '@/services/account/accountMock'
import { PostSubscriptionRequest } from '@/pages/subscriptions/SubscriptionsTypes'

const account = getMockedAccount()
describe('offersDrawerUtils', () => {
  let selectedProducts: SelectedProduct[]
  let originalLength: number

  beforeEach(() => {
    selectedProducts = [
      {
        offerId: 101,
        productConfigurationId: 1
      },
      {
        isMandatory: true,
        offerId: 101,
        productConfigurationId: 11
      }
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
          productConfigurationId: 1
        },
        {
          isMandatory: true,
          offerId: 1,
          productConfigurationId: 2
        },
        {
          isMandatory: false,
          offerId: 1,
          productConfigurationId: 3
        },
        {
          isMandatory: false,
          offerId: 1,
          productConfigurationId: 4
        }
      ]
      expect(selectedProducts).toStrictEqual(expectedSelectedProducts)
    })
  })

  describe('getPostSubscriptionRequest', () => {
    const accountId = 5
    const userEmail = 'user@email.com'
    const principalContact = getMockedPrincipalContact()
    const currentSubscriptionOffer = getMockedSubscriptionOffersServices().at(0)
    const selectedProducts = getInitialSelectedProducts(
      currentSubscriptionOffer
    )
    const { contactId } = principalContact

    it('should return not optional and free product list', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest(
        accountId,
        userEmail,
        contactId,
        currentSubscriptionOffer,
        selectedProducts
      )
      const expectedPostSubscriptionRequest: PostSubscriptionRequest = {
        accountId,
        offerId: 1,
        productConfigurations: [1, 2, 3, 4],
        contacts: [1],
        notes: [],
        applicant: 'user@email.com'
      }
      expect(postSubscriptionRequest).toStrictEqual(
        expectedPostSubscriptionRequest
      )
    })
    it('should return empty undefined if currentSubscriptionOffer in undefined', () => {
      const postSubscriptionRequest = getPostSubscriptionRequest(
        accountId,
        userEmail,
        contactId,
        undefined,
        selectedProducts
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
  describe('getMappedAPIData', () => {
    it('should return the mapping of API data to the form when the correct values', () => {
      const expectedResult = {
        'legal.siret': account?.legal?.siret,
        'legal.legalFormCode': account?.legal?.legalFormCode,
        'legal.naf.nafCode': account?.legal?.naf?.at(0)?.nafCode,
        'legal.staffSizeRange': account?.legal?.staffSizeRange,
        'hub.hubName': account?.hub?.hubName,
        'accounting.fiscalExerciseStartDate':
          account?.accounting?.fiscalExerciseStartDate,
        'accounting.fiscalExerciseDuration':
          account?.accounting?.fiscalExerciseDuration,
        'accounting.accountingType': account?.accounting?.accountingType,
        'accounting.activityType': account?.accounting?.activityType,
        'accounting.fiscalSystem': account?.accounting?.fiscalSystem,
        'accounting.taxationSystem': account?.accounting?.taxationSystem,
        'vat.system': account?.vat?.system,
        'vat.intra': account?.vat?.intra,
        'vat.type': account?.vat?.type,
        'address.addressLine1': account?.address?.at(0)?.addressLine1,
        'address.addressLine2': account?.address?.at(0)?.addressLine2,
        'address.zipCode': '',
        'address.city': account?.address?.at(0)?.city,
        'address.country': account?.address?.at(0)?.country,
        email: '',
        'phone.phoneNumber': ''
      }
      expect(expectedResult).toStrictEqual(getMappedAPIData(account))
    })
    it('should return the mapping of API data to a form using default values if the API values are null', () => {
      const expectedResult = {
        'legal.siret': '',
        'legal.legalFormCode': '',
        'legal.naf.nafCode': '',
        'legal.staffSizeRange': '',
        'hub.hubName': '',
        'accounting.fiscalExerciseStartDate': getFirstDayOfYear(),
        'accounting.fiscalExerciseDuration': 12,
        'accounting.accountingType': 'Engagement',
        'accounting.activityType': 'Prestation de services',
        'accounting.fiscalSystem': 'BIC',
        'accounting.taxationSystem': 'Impôt sur le revenu',
        'vat.system': 'Réel normal - CA3 mensuelle',
        'vat.intra': '',
        'vat.type': 'Encaissement',
        'address.addressLine1': '',
        'address.addressLine2': '',
        'address.zipCode': '',
        'address.city': '',
        'address.country': '',
        email: '',
        'phone.phoneNumber': ''
      }
      expect(expectedResult).toStrictEqual(getMappedAPIData({} as Account))
    })
  })
})
