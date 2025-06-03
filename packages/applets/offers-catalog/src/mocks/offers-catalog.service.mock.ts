import offersCatalogResponseMock from './offers-catalog.service.mock.json'
import type { OfferDescription, OfferCategory, OfferSubCategory, OffersCatalogResponse } from '../types/offers-catalog.types'

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
