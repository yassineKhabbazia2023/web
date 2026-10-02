import type { Screen } from '../../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../../types/recommendations.types'

/** An exercice as the selector of the reader names it. */
export interface ReaderExerciceOption {
  pValue: number
  pLabel: string
}

/**
 * Everything the reader displays, handed in whole: it holds no source of its
 * own, so that the client page and the draft preview render the same markup
 * from what each of them knows.
 */
export interface KeyMomentsReaderProps {
  /** Names the dossier in the title; the reader never reads the name a closing carries */
  entityName?: string
  /** What the page says under its title, one statement per entry */
  caption: string[]
  screens: Screen[]
  /** Visible recommendations in the published order; empty hides the section for the client and states it in the preview */
  recommendations: PublishedRecommendationPayload[]
  /** The collaborator's preview, where an empty section is stated rather than omitted */
  isPreview?: boolean
  isInThousands: boolean
  /** Whether there is a report to navigate and to read in another unit */
  hasReport: boolean
  /**
   * Offers the unit the figures are read in. On for the client, whose reading
   * choice it is; off in the preview, where the unit was settled before the
   * report got there and the row belongs to the collaborator's own gestures.
   */
  hasUnitSelect?: boolean
  /** Offered from two exercices on; absent when the reader has no exercice to pick */
  exerciceOptions?: ReaderExerciceOption[]
  selectedExerciceId?: number
}
