export interface OfferCategory {
  categoryId: number
  name: string
}

export interface OfferSubCategory {
  subCategoryId: number
  name: string
  category: OfferCategory
}

export interface OfferDescription {
  id: number
  title: string
  shortDescription: string
  imageUrl: string
  pdfUrl: string
  subCategoryId: number
  isBestOffer: boolean,
  akuiteoProduct: string
  searchKeywords: string
  priorityTargets: string[]
  internalLink: string
  subCategory: OfferSubCategory,
  tags: string[]
  similarityScore?: number
}

export interface OfferWithSearchTerms extends OfferDescription {
  searchTerms: string
}

export interface OffersCatalogResponse {
  offers: OfferDescription[]
  categories: OfferCategory[]
  subCategories: OfferSubCategory[]
}

export interface OfferCatalogReferentRegion {
  regionId: number
  name: string
}

export interface OfferCatalogReferent {
  firstName: string
  lastName: string
  email: string
  region: OfferCatalogReferentRegion
}

export interface OfferCatalogDocument {
  id: number
  documentName: string
  category: string
  link: string
}

export interface OfferCatalogDetailsResponse extends OfferDescription {
  referents: OfferCatalogReferent[]
  attachments: OfferCatalogDocument[]
}

export interface CatalogCard {
  title: string
  subtitle: string
  tags: string[]
}

export interface OfferRecommendation {
  id: string
  similarity_score: number
  title: string
  short_description: string
  search_keywords: string
}

export interface OffersRecommendationsResponse {
  recommendations: OfferRecommendation[]
  total_count: number
  id_offer_response: string
}
