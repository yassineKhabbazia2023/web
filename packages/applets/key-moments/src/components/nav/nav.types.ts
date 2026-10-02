import type { RecommendationRubric } from '../../enums/key-moments.enums'

/** A rubric of the recommendations as the navigation lists it under the section. */
export interface NavRubric {
  rubric: RecommendationRubric
  visibleCount: number
  totalCount: number
}
