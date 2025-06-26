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

export interface OfferCatalogDetailsResponse extends OfferDescription {
  referents: OfferCatalogReferent[]
}

export interface CatalogCard {
  title: string
  subtitle: string
  tags: string[]
}

export type CatalogTagStyle =
  'style1' |
  'style2' |
  'style3' |
  'style4' |
  'style5' |
  'style6' |
  'style7'
