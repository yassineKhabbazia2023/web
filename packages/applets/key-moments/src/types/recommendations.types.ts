import type { RecommendationPriority, RecommendationRubric } from '../enums/key-moments.enums'
import type { PublishedOfferPayload } from '../services/offers.service.types'
import type { RecommendationThemePayload } from '../services/recommendations.service.types'

/**
 * A recommendation as the page works on it. The `key` is the page's own,
 * stable for the whole life of the copy: the microservice assigns no id to a
 * recommendation, the position in the list is all it knows. Its rubric is
 * its theme's; `rubric` only places a line added on the page before it has
 * one.
 */
export interface WorkingRecommendation {
  key: string
  themeId?: number
  rubric?: RecommendationRubric
  priority?: RecommendationPriority
  observations?: string
  risk?: string
  recommendation?: string
  offerIds: number[]
  isHidden: boolean
  /** Copied from the chosen category: the theme is locked in the exercice */
  isFromCategory: boolean
}

/** An attached offer as the card names it; retired when the catalogue no longer carries it. */
export interface ResolvedOffer {
  offerId: number
  title: string
  shortDescription?: string
  categoryName?: string
  tags?: string[]
  isRetired: boolean
}

export interface RecommendationView extends WorkingRecommendation {
  themeLabel?: string
  offers: ResolvedOffer[]
  /** The last save named its theme unknown to the referential */
  isThemeRefused: boolean
}

/** The recommendations of one rubric with their offers resolved, as the section renders them. */
export interface RubricView {
  rubric: RecommendationRubric
  /** What a line of the rubric may pick from */
  themes: RecommendationThemePayload[]
  views: RecommendationView[]
}

/**
 * A recommendation as a publication freezes it and as the client is served
 * it: flat, in the published order, the offers worded from the catalogue.
 */
export interface PublishedRecommendationPayload {
  rubric: RecommendationRubric
  theme: string
  priority?: RecommendationPriority
  observations?: string
  risk?: string
  recommendation?: string
  offers: PublishedOfferPayload[]
}

/** The published recommendations of one rubric, as the reader groups them; never empty. */
export interface PublishedRubric {
  rubric: RecommendationRubric
  recommendations: PublishedRecommendationPayload[]
}
