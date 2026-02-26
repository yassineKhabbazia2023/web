import { getMockedSubscriptionOffers, getMockedSubscriptionOffersServices } from '@entities/__mocks__/offer-subscription.mocks'
import { envVarsMock } from '@pulse/common/mocks'
import { API_PREFIXES } from '@pulse/common/constants'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '@entities/types'

import {
  getAllOffers,
  getOffer,
  getOffersBookLink,
} from '.'

const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()

vi.mock('@entities/helpers/entity.helper', () => ({
  handleRequestError: vi.fn(),
}))

vi.mock('env-vars', () => envVarsMock)

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

describe('getOffersBookLink', () => {
  it('should return offers book link', async () => {
    const offersBookLink = await getOffersBookLink()

    expect(offersBookLink).toBe(envVarsMock.VITE_CONFIG_OFFERS_BOOK)
  })
})

