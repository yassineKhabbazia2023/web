import { SubscriptionPriceType } from './SubscriptionOffersEnums'
import type { SubscriptionOffer, SubscriptionOfferProduct } from './SubscriptionOffersTypes'

export function getMockedSubscriptionOffers() {
  const Subscription = [{
    offerId: 1,
    offerName: 'Gestion Smart',
    offerLabel: 'Mon Expert en Gestion (MEG) en version start (inclus dans Rydge)',
    offerPrice: 0,
    offerCode: 'MEG Smart',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'meg',
  },
  {
    offerId: 2,
    offerName: 'Gestion Premium',
    offerLabel: 'Mon expert en gestion en version premium',
    offerPrice: 0,
    offerCode: 'MEG Premium',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'meg',
  },
  {
    offerId: 3,
    offerName: 'Mes Modules de Compta',
    offerLabel: 'Loop collaboratif (Rydge compta)',
    offerPrice: 0,
    offerCode: 'Loop compta',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'loop-color',
  },
  {
    offerId: 4,
    offerName: 'Externalisation de la paie',
    offerLabel: 'Gestion de la paie par Rydge, pour le clients, sur Silae',
    offerPrice: 0,
    offerCode: 'Loop collaboratif',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'silae-color',
  },
  {
    offerId: 5,
    offerName: 'Mes modules de paie',
    offerLabel: 'Gestion de la paie par le client , sous supervision Rydge, sur Silae',
    offerPrice: 0,
    offerCode: 'Silae Externalisation',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'silae-color',
  }] satisfies SubscriptionOffer[] as SubscriptionOffer[]

  return Subscription
}

export function getMockedSubscriptionOfferProduct(override: Partial<SubscriptionOfferProduct> = {}) {
  const defaultSubscriptionOfferProduct: SubscriptionOfferProduct = {
    productName: 'product-name',
    productConfigurationId: 1,
    productLabel: 'product-label',
    enabled: false,
    isOptionnal: false,
    priceType: SubscriptionPriceType.free,
    price: 0,
  }

  return {
    ...defaultSubscriptionOfferProduct,
    ...override,
  }
}
