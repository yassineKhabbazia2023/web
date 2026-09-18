import type { CustomerOfferPayload } from '../../services/customer-key-moments.service.types'
import type { ClosingEntity, Screen } from '../../types/key-moments.types'

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
  entity?: ClosingEntity
  /** What the page says under its title, one statement per entry */
  caption: string[]
  screens: Screen[]
  offers: CustomerOfferPayload[]
  isInThousands: boolean
  /** Whether there is a report to navigate and to read in another unit */
  hasReport: boolean
  /**
   * Offers the report as a file. Off by default, and left off for the client:
   * only the collaborator reading a publication through the preview is handed
   * the gesture.
   */
  canExport?: boolean
  /**
   * Offers the unit the figures are read in. On for the client, whose reading
   * choice it is; off in the preview, where the unit was settled before the
   * report got there and the row belongs to the collaborator's own gestures.
   */
  hasUnitSelect?: boolean
  /** Offered from two exercices on; absent when the reader has no exercice to pick */
  exerciceOptions?: ReaderExerciceOption[]
  selectedExerciceId?: number
  /** Year the exercice on screen closes on, which names the exported file */
  exerciceYear?: string
}
