import offersCatalogResponseMock from './offers-catalog.service.mocks.json'
import type { OfferDescription, OfferCategory, OfferSubCategory, OffersCatalogResponse } from '../types/offers-catalog.types'

export function getOfferMock(
  override: Partial<OfferDescription> = {},
  subCategoryName = '',
  categoryName = '',
): OfferDescription {
  const emptyOffer: OfferDescription = {
    id: 13,
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
      subCategoryId: 17,
      name: subCategoryName,
      category: {
        categoryId: 19,
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
