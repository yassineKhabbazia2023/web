import type { SubscriptionContact } from '@entities/services/subscription/subscriptionTypes'
import { ContactType } from '@pulse/common/enums'
import { SubscriptionPriceType } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import type { CollaboratorRole, SubscriptionOfferServices, SubscriptionOffer, SubscriptionOfferProduct } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

export function getCollaboratorRoleMock(override: Partial<CollaboratorRole> = {}): CollaboratorRole {
  return {
    functionId: 1,
    functionName: 'Expert comptable',
    ...override,
  }
}

export function getSubscriptionContactMock(override: Partial<SubscriptionContact> = {}) {
  const defaultSubscriptionContact: SubscriptionContact = {
    contactId: 543,
    firstName: 'Leonard',
    lastName: 'Striga',
    email: 'leo@mail.test',
    type: ContactType.COLLABORATOR,
  }

  return {
    ...defaultSubscriptionContact,
    ...override,
  }
}

export function getSubscriptionOffersServiceMock(override: Partial<SubscriptionOfferServices> = {}) {
  const defaultSubscription: SubscriptionOfferServices = {
    offerId: 1,
    offerName: 'Gestion Smart',
    offerLabel:
        'Mon Expert en Gestion (MEG) en version start (inclus dans RYDGE)',
    offerPrice: 0,
    offerCode: 'MEG Smart',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'meg',
    approvalRequired: true,
    offersBookLink: 'test link',
    offerDescription: 'test description',
    intranetLink: 'test-link',
    functions: [
      getCollaboratorRoleMock(),
    ],
    providers: [
      {
        providerName: ProviderName.RYDGE,
        providerEditor: 'RYDGE',
        providerCategory: 'RYDGE',
        logoName: 'brand-color',
        products: [
          {
            productName: 'GED Compta',
            productLabel: 'GED Comptabilité',
            enabled: true,
            isOptionnal: false,
            price: 0.0,
            priceType: SubscriptionPriceType.free,
            productConfigurationId: 1,
          },
        ],
      },
      {
        providerName: ProviderName.MEG,
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
            priceType: SubscriptionPriceType.free,
            productConfigurationId: 2,
          },
          {
            productName: 'Module caisse',
            productLabel: 'Module caisse de MEG',
            enabled: true,
            isOptionnal: true,
            price: 0.0,
            priceType: SubscriptionPriceType.free,
            productConfigurationId: 3,
          },
          {
            productName: 'Module facturation',
            productLabel: 'Module facturation de MEG',
            enabled: true,
            isOptionnal: true,
            price: 0.0,
            priceType: SubscriptionPriceType.free,
            productConfigurationId: 4,
          },
        ],
      },
    ],
  }

  return {
    ...defaultSubscription,
    ...override,
  }
}

export function getMockedSubscriptionOffersServices() {
  const subscriptionOffersServiceMock0 = getSubscriptionOffersServiceMock()
  const Subscription: SubscriptionOfferServices[] = [
    subscriptionOffersServiceMock0,
    {
      offerId: 2,
      offerName: 'Gestion Premium',
      offerLabel: 'Mon expert en gestion en version premium',
      offerPrice: 0,
      offerCode: 'MEG Premium',
      offerPriceType: SubscriptionPriceType.free,
      logoName: 'meg',
      approvalRequired: false,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      functions: [],
      providers: [
        {
          providerName: ProviderName.RYDGE,
          providerEditor: 'RYDGE',
          providerCategory: 'RYDGE',
          logoName: 'brand-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: SubscriptionPriceType.free,
              productConfigurationId: 5,
            },
          ],
        },
      ],
    },
    {
      offerId: 3,
      offerName: 'Mes Modules de Compta',
      offerLabel: 'Loop collaboratif (RYDGE compta)',
      offerPrice: 0,
      offerCode: 'Loop compta',
      offerPriceType: SubscriptionPriceType.free,
      logoName: 'loop-color',
      approvalRequired: true,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      functions: [],
      providers: [
        {
          providerName: ProviderName.RYDGE,
          providerEditor: 'RYDGE',
          providerCategory: 'RYDGE',
          logoName: 'brand-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: false,
              price: 0.0,
              priceType: SubscriptionPriceType.free,
              productConfigurationId: 6,
            },
          ],
        },
      ],
    },
    {
      offerId: 4,
      offerName: 'Externalisation de la paie',
      offerLabel: 'Gestion de la paie par RYDGE, pour le clients, sur Silae',
      offerPrice: 0,
      offerCode: 'Silae Externalisation',
      offerPriceType: SubscriptionPriceType.free,
      logoName: 'silae-color',
      approvalRequired: true,
      offersBookLink: 'test link',
      offerDescription: 'test description',
      intranetLink: 'test-link',
      functions: [],
      providers: [
        {
          providerName: ProviderName.RYDGE,
          providerEditor: 'RYDGE',
          providerCategory: 'RYDGE',
          logoName: 'brand-color',
          products: [
            {
              productName: 'GED Compta',
              productLabel: 'GED Comptabilité',
              enabled: true,
              isOptionnal: true,
              price: 0.0,
              priceType: SubscriptionPriceType.exact,
              productConfigurationId: 7,
            },
          ],
        },
      ],
    },
  ] satisfies SubscriptionOfferServices[] as SubscriptionOfferServices[]

  return Subscription
}

export function getMockedSubscriptionOffers() {
  const Subscription = [{
    offerId: 1,
    offerName: 'Gestion Smart',
    offerLabel: 'Mon Expert en Gestion (MEG) en version start (inclus dans RYDGE)',
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
    offerLabel: 'Loop collaboratif (RYDGE compta)',
    offerPrice: 0,
    offerCode: 'Loop compta',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'loop-color',
  },
  {
    offerId: 4,
    offerName: 'Externalisation de la paie',
    offerLabel: 'Gestion de la paie par RYDGE, pour le clients, sur Silae',
    offerPrice: 0,
    offerCode: 'Loop collaboratif',
    offerPriceType: SubscriptionPriceType.free,
    logoName: 'silae-color',
  },
  {
    offerId: 5,
    offerName: 'Mes modules de paie',
    offerLabel: 'Gestion de la paie par le client, sous supervision RYDGE, sur Silae',
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
