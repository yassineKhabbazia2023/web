import type { Ref } from 'vue'
import type { ExerciceRecommendationsPayload } from '../../services/recommendations.service.types'

export interface RecommendationsOptions {
  entityId: number | null
  /** The exercice on screen, the one every save addresses */
  exerciceId: Readonly<Ref<number | undefined>>
  /**
   * What the draft of the exercice carries, handed over as read: a new value
   * replaces the working copy. Undefined when the draft could not be read,
   * which is a copy that is never written over.
   */
  draft: Readonly<Ref<ExerciceRecommendationsPayload | undefined>>
}
