import { SubscriptionPriceType } from './SubscriptionOffersEnums'
import type { SubscriptionOffer, SubscriptionOfferProduct } from './SubscriptionOffersTypes'

export function getMockedSubscriptionOffers() {
  const Subscription = [{
    offerId: 1,
    offerName: 'Gestion Smart',
    offerLabel: 'Mon Expert en Gestion (MEG) en version start (inclu dans Pulse)',
    offerPrice: 0,
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'meg'
  },
  {
    offerId: 2,
    offerName: 'Gestion Premium',
    offerLabel: 'Mon expert en gestion en version premium',
    offerPrice: 0,
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'meg'
  },
  {
    offerId: 3,
    offerName: 'Mes Modules de Compta',
    offerLabel: 'Loop collaboratif (myPulse compta)',
    offerPrice: 0,
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'loop-color'
  },
  {
    offerId: 4,
    offerName: 'Externalisation de la paie',
    offerLabel: 'Gestion de la paie par KPMG, pour le clients, sur Silae',
    offerPrice: 0,
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'silae-color'
  },
  {
    offerId: 5,
    offerName: 'Mes modules de paie',
    offerLabel: 'Gestion de la paie par le client , sous supervision kpmg, sur Silae',
    offerPrice: 0,
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'silae-color'
  },
  {
    offerId: 6,
    offerName: 'Ma Banque',
    offerLabel: 'Visualisation des données bancaires',
    offerPrice: 0,
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'iconpulse-color'
  }] satisfies SubscriptionOffer[] as SubscriptionOffer[]

  return Subscription
}

export function getMockedSubscriptionOfferProduct(override: Partial<SubscriptionOfferProduct> = {}) {
  const defaultSubscriptionOfferProduct: SubscriptionOfferProduct = {
    productName: 'product-name',
    productId: 'product-id',
    productLabel: 'product-label',
    enabled: false,
    isOptionnal: false,
    priceType: SubscriptionPriceType.free,
    price: 0
  }

  return {
    ...defaultSubscriptionOfferProduct,
    ...override
  }
}
