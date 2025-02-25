import { describe, it, vi, expect } from 'vitest'
import {
  getAllOffers,
  getOffer,
  getOffersBookLink,
  getPrincipalContacts,
  fetchCollaborators,
} from '.'
import { getMockedSubscriptionOffers , getMockedSubscriptionOffersServices } from '@entities/__mocks__/offer-subscription.mocks'
import { getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'
import type { ClientContact } from '@entities/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import { API_PREFIXES } from '@entities/common/config/services'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'

const mockedCollaborators = getMockedCollaborators()
const mockedPrincipalContacts: ClientContact[] = getMockedPrincipalContacts()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()

vi.mock('@entities/helper/helper', () => ({
  handleRequestError: vi.fn(),
}))

vi.mock('env-vars', () => ({
  VITE_CONFIG_OFFERS_BOOK: 'offers-book-test-link',
}))

vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn((url, _) => {
          if (/\b(offers)\/[\d]+/.test(url)) {
            return getOfferImplementation(url)
          }
          if (url === `${API_PREFIXES.OFFER}/offers`) {
            return getAllOffersImplementation()
          }
          if (/\bsignatory\b/i.test(url)) {
            return getPrincipalContactsImplementation()
          }
          if (url === `${API_PREFIXES.OFFER}/contacts`) {
            return getfetchCollaboratorsImplementation()
          }
        }),
      },
    }),
  }
})

const getAllOffersImplementation = () => {
  return Promise.resolve({
    data: subscriptionOffers,
  })
}

const getfetchCollaboratorsImplementation = () => {
  return Promise.resolve({
    data: {
      items: mockedCollaborators,
    },
  })
}

const getPrincipalContactsImplementation = () => {
  return Promise.resolve({
    data: mockedPrincipalContacts,
  })
}

const getOfferImplementation = (url: string) => {
  const offerId = +url.split('offers/')[1]
  const offer = subscriptionOffersServices.find(
    (item) => item.offerId === offerId,
  )
  if (offer) {
    return Promise.resolve({
      data: offer,
    })
  }
  return Promise.reject(new Error('Offer not found'))
}

describe('getAllOffers', () => {
  it('should return all available offers', async () => {
    const allOffers = await getAllOffers()
    expect(allOffers).toStrictEqual(subscriptionOffers)
  })
})

describe('getOffer', () => {
  it('should return details of a specific offer', async () => {
    const offer = await getOffer(1)
    const offerData = subscriptionOffersServices.find(
      (item) => item.offerId === 1,
    )

    expect(offer).toStrictEqual(offerData)
  })
  it("should throw an error if the offer doesn't exist", async () => {
    const offer = await getOffer(50)

    expect(offer).toBeUndefined()
  })
})

describe('fetchCollaborators', () => {
  it('should return list of collaborators', async () => {
    const collaborators = await fetchCollaborators()

    expect(collaborators).toStrictEqual(mockedCollaborators)
  })
})

describe('getOffersBookLink', () => {
  it('should return offers book link', async () => {
    const offersBookLink = await getOffersBookLink()

    expect(offersBookLink).toBe('offers-book-test-link')
  })
})

describe('getPrincipalContact', () => {
  it('should return principal contact details', async () => {
    const accountId = 5
    const principalContacts = await getPrincipalContacts(accountId)

    expect(principalContacts).toStrictEqual(mockedPrincipalContacts)
  })
})
