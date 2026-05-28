import offersCatalogResponseMock from './offers-catalog.service.mocks.json'
import type {
  OfferDescription,
  OfferCategory,
  OfferSubCategory,
  OffersCatalogResponse,
  OfferCatalogReferent,
  OfferCatalogDocument,
  OfferCatalogDetailsResponse,
  OfferRecommendation,
  OffersRecommendationsResponse,
} from '../types/offers-catalog.types'

export function getOfferMock(
  override: Partial<OfferDescription> = {},
  subCategoryName = '',
  categoryName = '',
): OfferDescription {
  const emptyOffer: OfferDescription = {
    id: 2,
    title: '',
    shortDescription: '',
    imageUrl: '',
    pdfUrl: '',
    subCategoryId: 3,
    isBestOffer: false,
    akuiteoProduct: '',
    searchKeywords: '',
    internalLink: '',
    priorityTargets: [],
    subCategory: {
      subCategoryId: 4,
      name: subCategoryName,
      category: {
        categoryId: 5,
        name: categoryName,
      },
    },
    tags: [],
  }

  return {
    ...emptyOffer,
    ...override,
  }
}

export function getOffersMock(): OfferDescription[] {
  const offers = offersCatalogResponseMock.offers

  return offers
}

export function getOfferCategoriesMock(): OfferCategory[] {
  const offerCategories: OfferCategory[] = offersCatalogResponseMock.categories

  return offerCategories
}

export function getOfferSubCategoriesMock(): OfferSubCategory[] {
  const offerSubCategories: OfferSubCategory[] = offersCatalogResponseMock.subCategories

  return offerSubCategories
}

export function getOffersCatalogResponseMock(): OffersCatalogResponse {
  const offers = getOffersMock()
  const categories = getOfferCategoriesMock()
  const subCategories = getOfferSubCategoriesMock()

  const offersCatalogResponseMock = {
    offers,
    categories,
    subCategories,
  }

  return offersCatalogResponseMock
}

export function getOfferCatalogReferentMock(override: Partial<OfferCatalogReferent> = {}): OfferCatalogReferent {
  const defaultMock: OfferCatalogReferent = {
    firstName: '',
    lastName: '',
    email: '',
    region: {
      regionId: 0,
      name: '',
    },
  }

  return {
    ...defaultMock,
    ...override,
  }
}

export function getOfferCatalogReferentListMock() {
  const list: OfferCatalogReferent[] = [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    region: {
      regionId: 16,
      name: 'North Hub',
    },
  }, {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    region: {
      regionId: 16,
      name: 'South Hub',
    },
  }, {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    region: {
      regionId: 321,
      name: 'East Hub',
    },
  }]

  return list
}

export function getOfferCatalogDocumentMock(override: Partial<OfferCatalogDocument> = {}): OfferCatalogDocument {
  const defaultMock: OfferCatalogDocument = {
    id: 0,
    documentName: '',
    category: '',
    link: '',
  }

  return {
    ...defaultMock,
    ...override,
  }
}

export function getOfferCatalogDocumentListMock() {
  const list: OfferCatalogDocument[] = [
    {
      id: 1,
      documentName: 'Product Brochure',
      category: 'Marketing',
      link: 'https://example.com/product-brochure.pdf',
    },
    {
      id: 2,
      documentName: 'Technical Specification',
      category: 'Technical',
      link: 'https://example.com/technical-specification.pdf',
    },
    {
      id: 3,
      documentName: 'User Guide',
      category: 'Support',
      link: 'https://example.com/user-guide.pdf',
    },
    {
      id: 1,
      documentName: 'Special offers',
      category: 'Marketing',
      link: 'https://example.com/special-offers.pdf',
    },
  ]

  return list
}

export function getOfferCatalogDetailsResponseMock(
  override: Partial<OfferCatalogDetailsResponse> = {},
): OfferCatalogDetailsResponse {
  const defaultMock: OfferCatalogDetailsResponse = {
    id: 0,
    title: '',
    shortDescription: '',
    imageUrl: '',
    pdfUrl: '',
    subCategoryId: 17,
    isBestOffer: false,
    akuiteoProduct: '',
    searchKeywords: '',
    internalLink: '',
    priorityTargets: [],
    subCategory: {
      subCategoryId: 0,
      name: '',
      category: {
        categoryId: 0,
        name: '',
      },
    },
    tags: [],
    referents: [],
    attachments: [],
  }

  return {
    ...defaultMock,
    ...override,
  }
}

export function getOfferRecommendationMock(
  override: Partial<OfferRecommendation> = {},
): OfferRecommendation {
  const defaultMock: OfferRecommendation = {
    id: '1',
    similarity_score: 85,
    title: 'Offer Title',
    short_description: 'Offer Description',
    search_keywords: 'keyword1, keyword2',
  }

  return {
    ...defaultMock,
    ...override,
  }
}

export function getOffersRecommendationsResponseMock(
  override: Partial<OffersRecommendationsResponse> = {},
): OffersRecommendationsResponse {
  const defaultMock: OffersRecommendationsResponse = {
    recommendations: [
      getOfferRecommendationMock({ id: '1', similarity_score: 95 }),
      getOfferRecommendationMock({ id: '2', similarity_score: 80 }),
    ],
    total_count: 2,
    id_offer_response: 'response-123',
  }

  return {
    ...defaultMock,
    ...override,
  }
}
