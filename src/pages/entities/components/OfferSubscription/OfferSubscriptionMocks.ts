import type { SubscriptionOfferServices } from '../SubscriptionOffers/SubscriptionOffersTypes'

export function getMockedSubscriptionOffersServices() {
  const Subscription: SubscriptionOfferServices[] = [
    {
      offerId: 1,
      offerName: 'Gestion Smart',
      offerLabel:
        'Mon Expert en Gestion (MEG) en version start (inclu dans Pulse)',
      offerPrice: 0,
      offerPriceType: 'free',
      logoName: 'meg',
      approvalRequired: true,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      providers: [
        {
          providerName: 'PULSE',
          providerEditor: 'KPMG',
          providerCategory: 'PULSE',
          logoName: 'iconpulse-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: 'free'
            }
          ]
        },
        {
          providerName: 'MEG',
          providerEditor: 'RCA',
          providerCategory: 'external',
          logoName: 'meg',
          products: [
            {
              productName: 'Accès MEG',
              productLabel: "Accès à l'outil MEG",
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: 'free'
            },
            {
              productName: 'Module caisse',
              productLabel: 'Module caisse de MEG',
              enabled: true,
              isOptionnal: true,
              price: 0.0,
              priceType: 'free'
            },
            {
              productName: 'Module facturation',
              productLabel: 'Module facturation de MEG',
              enabled: true,
              isOptionnal: true,
              price: 0.0,
              priceType: 'free'
            }
          ]
        }
      ]
    },
    {
      offerId: 2,
      offerName: 'Gestion Premium',
      offerLabel: 'Mon expert en gestion en version premium',
      offerPrice: 0,
      offerPriceType: 'free',
      logoName: 'meg',
      approvalRequired: false,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      providers: [
        {
          providerName: 'PULSE',
          providerEditor: 'KPMG',
          providerCategory: 'PULSE',
          logoName: 'iconpulse-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: 'free'
            }
          ]
        }
      ]
    },
    {
      offerId: 3,
      offerName: 'Mes Modules de Compta',
      offerLabel: 'Loop collaboratif (myPulse compta)',
      offerPrice: 0,
      offerPriceType: 'free',
      logoName: 'loop-color',
      approvalRequired: true,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      providers: [
        {
          providerName: 'PULSE',
          providerEditor: 'KPMG',
          providerCategory: 'PULSE',
          logoName: 'iconpulse-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: 'free'
            }
          ]
        }
      ]
    },
    {
      offerId: 4,
      offerName: 'Externalisation de la paie',
      offerLabel: 'Gestion de la paie par KPMG, pour le clients, sur Silae',
      offerPrice: 0,
      offerPriceType: 'free',
      logoName: 'silae-color',
      approvalRequired: true,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      providers: [
        {
          providerName: 'PULSE',
          providerEditor: 'KPMG',
          providerCategory: 'PULSE',
          logoName: 'iconpulse-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: 'free'
            }
          ]
        }
      ]
    }
  ] satisfies SubscriptionOfferServices[] as SubscriptionOfferServices[]

  return Subscription
}
