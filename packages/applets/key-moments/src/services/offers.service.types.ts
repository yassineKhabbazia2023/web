/**
 * The wording of one offer cited by a visible recommendation, as the
 * publication freezes it.
 *
 * Composed at publication from the catalogue, which the microservice never
 * reads: what the client will read is resolved at the moment it is frozen. An
 * offer the catalogue no longer carries can therefore not be published at all,
 * which is what `unresolvedOfferIds` names.
 *
 * Carries nothing of the recommendations citing it — the microservice builds
 * those from the list it stores.
 */
export interface PublishedOfferPayload {
  offerId: number
  title: string
  shortDescription?: string
  categoryName?: string
  subCategoryName?: string
  /** A file name, never an absolute URL */
  imageUrl?: string
  /** A file name, never an absolute URL */
  pdfUrl?: string
}

export interface CatalogCategoryPayload {
  categoryId: number
  name: string
}

export interface CatalogSubCategoryPayload {
  subCategoryId: number
  name: string
  category: CatalogCategoryPayload
}

/**
 * What this module reads of the catalogue, and nothing more.
 *
 * Declared here rather than borrowed from `@pulse/offers-catalog`: this module
 * depends on no applet, the same way `common/services/key-moments` redeclares a
 * route instead of depending on the one that owns it.
 */
export interface CatalogOfferPayload {
  id: number
  title: string
  shortDescription?: string
  imageUrl?: string
  pdfUrl?: string
  subCategory: CatalogSubCategoryPayload
  tags?: string[]
  searchKeywords?: string
  priorityTargets?: string[]
}

export interface OffersCatalogPayload {
  offers: CatalogOfferPayload[]
  categories: CatalogCategoryPayload[]
}
