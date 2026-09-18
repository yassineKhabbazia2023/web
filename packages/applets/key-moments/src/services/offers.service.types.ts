import type { OfferPriority } from '../enums/key-moments.enums'

/**
 * A recommendation as it travels, both ways: which offer, and everything the
 * firm decided about it. Nothing of the wording — the microservice keeps a
 * title and nothing else, and the words the reader sees are resolved in the
 * catalogue on every read, see `joinOffers`.
 *
 * The title is stored all the same, and it is the one thing an offer gone from
 * the catalogue is still named by. It is not enough to publish one: what goes
 * out is composed at publication — see `PublishedOfferPayload`.
 *
 * The keys it does not fill are absent rather than null: the host serialises
 * with `WhenWritingNull`, so an absent key reads as null and the two are never
 * told apart.
 */
export interface LinkedOfferPayload {
  offerId: number
  title: string
  /** What the firm writes about the offer, and what the client ends up reading */
  comment?: string
  /** What the offer brings the client's business, in the firm's words */
  benefitsComment?: string
  priority?: OfferPriority
  /** Requires a `priority` when true — the microservice refuses the reverse */
  isPriorityVisible: boolean
  /** Leaves the offer out of the publication without detaching it */
  isHidden: boolean
}

/**
 * The wording of one recommendation, as the publication freezes it.
 *
 * Composed at publication rather than read from the attached list: the
 * microservice no longer stores anything of an offer but its title, so what the
 * client will read is resolved in the catalogue at the moment it is frozen. An
 * offer the catalogue no longer carries can therefore not be published at all,
 * which is what `unresolvedOfferIds` names.
 *
 * Carries none of the arbitrations of the firm — rank, comment, degree and its
 * visibility are read from the stored list, and sending them here would offer a
 * second way of deciding them.
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
