import type { SubscriptionOffers } from './SubscriptionOffersTypes'

export function getMockedSubscriptionOffers() {
  const Subscription = [{
    offerName: 'Gestion Smart',
    offerLabel: 'Mon Expert en Gestion (MEG) en version start (inclu dans Pulse)',
    logoName: 'meg',
    globalOfferId: '0909484872764664525621',
    offerPrice: 0,
    providers: [],
    approvalRequired: true
  },
  {
    offerName: 'Gestion Premium',
    offerLabel: 'Mon expert en gestion en version premium',
    logoName: 'meg',
    globalOfferId: '0909484872764664525622',
    offerPrice: 0,
    providers: [],
    approvalRequired: true
  },
  {
    offerName: 'Mes Modules de Compta',
    offerLabel: 'Loop collaboratif (myPulse compta)',
    logoName: 'loop-color',
    globalOfferId: '0909484872764664525623',
    offerPrice: 0,
    providers: [],
    approvalRequired: true
  },
  {
    offerName: 'Externalisation de la paie',
    offerLabel: 'Gestion de la paie par KPMG, pour le clients, sur Silae',
    logoName: 'silae-color',
    globalOfferId: '0909484872764664525624',
    offerPrice: 0,
    providers: [],
    approvalRequired: true
  },
  {
    offerName: 'Mes modules de paie',
    offerLabel: 'Gestion de la paie par le client , sous supervision kpmg, sur Silae',
    logoName: 'silae-color',
    globalOfferId: '0909484872764664525625',
    offerPrice: 0,
    providers: [],
    approvalRequired: true
  },
  {
    offerName: 'Ma Banque',
    offerLabel: 'Visualisation des données bancaires',
    logoName: 'iconpulse-color',
    globalOfferId: '0909484872764664525626',
    offerPrice: 0,
    providers: [],
    approvalRequired: true
  }] satisfies SubscriptionOffers[] as SubscriptionOffers[]

  return Subscription
}
