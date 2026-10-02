import type { RecommendationPriority, RecommendationRubric } from '../enums/key-moments.enums'

/**
 * A theme of the closed list a recommendation picks from; each belongs to a
 * single rubric. The list is served in display order, grouped by rubric.
 */
export interface RecommendationThemePayload {
  id: number
  rubric: RecommendationRubric
  label: string
}

/**
 * A recommendation of a category, as the administrator writes it. The theme
 * is required and names the rubric; the rest may be null.
 */
export interface RecommendationPayload {
  themeId: number
  priority: RecommendationPriority | null
  observations: string | null
  risk: string | null
  recommendation: string | null
  offerIds: number[]
}

/** The same line once copied into an exercice, where the firm may keep it from the client. */
export interface ExerciceRecommendationPayload extends RecommendationPayload {
  isHidden: boolean
  /** Copied from the chosen category rather than added by the firm: its theme is then locked */
  isFromCategory: boolean
}

/**
 * What the draft of an exercice carries of the recommendations, and what a
 * save replaces whole. `categoryId` is null or absent until a category was
 * chosen; the order of the array is the order.
 */
export interface ExerciceRecommendationsPayload {
  categoryId?: number | null
  recommendations: ExerciceRecommendationPayload[]
}

/** A category of base recommendations the administrator keeps. */
export interface CategoryPayload {
  id: number
  label: string
  pitch: string
}

export interface CategoryRequest {
  label: string
  pitch: string
}
