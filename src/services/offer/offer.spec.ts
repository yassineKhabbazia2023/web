import { describe, it, vi, expect } from 'vitest'
import {
  getAllOffers,
  getOffer,
  getOffersBookLink,
  getPrincipalContact
} from '.'
import { getMockedSubscriptionOffers } from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersMocks'
import {
  getMockedSubscriptionOffersServices
} from '@/pages/entities/components/OfferSubscription/OfferSubscriptionMocks'
import { getMockedPrincipalContact } from '@/pages/entities/components/PrincipalContact/PrincipalContactMocks'
import type { User } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

const mockedPrincipalContact: User = getMockedPrincipalContact()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()

vi.mock('env-vars', () => ({
  VITE_CONFIG_OFFERS_BOOK: 'offers-book-test-link'
}))

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      offer: {
        get: vi.fn((url, _) => {
          if (url === 'offers') {
            return getAllOffersImplementation()
          }
          if (/^(offers)\/[\d]+/.test(url)) {
            return getOfferImplementation(url)
          }
        })
      }
    })
  }
})

const getAllOffersImplementation = () => {
  return Promise.resolve({
    data: subscriptionOffers
  })
}

const getOfferImplementation = (url: string) => {
  const offerId = +url.split('offers/')[1]
  const offer = subscriptionOffersServices.find(
    (item) => item.offerId === offerId
  )
  if (offer) {
    return Promise.resolve({
      data: offer
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
      (item) => item.offerId === 1
    )

    expect(offer).toStrictEqual(offerData)
  })
  it("should throw an error if the offer doesn't exist", async () => {
    const offer = await getOffer(50)

    expect(offer).toBeUndefined()
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
    const principalContact = await getPrincipalContact()

    expect(principalContact).toStrictEqual(mockedPrincipalContact)
  })
})
