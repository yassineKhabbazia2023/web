import type { PublishedRecommendationPayload } from '../types/recommendations.types'

/**
 * What the microservice serves the client; these shapes stop at the service.
 *
 * None of them carries a `publicationId` nor a `closingId`, and none ever will:
 * the client addresses an exercice, and the server resolves the publication
 * active on it. Naming a delivery would let a client read figures the firm has
 * not arbitrated yet.
 */

/**
 * One exercice the client may read. The list only ever holds exercices with an
 * active publication — a key moment that is not published does not exist on
 * this side — and the microservice serves it sorted by exercice end date,
 * descending.
 */
export interface CustomerKeyMomentSummaryPayload {
  exerciceId: number
  exerciceStartDate: string
  exerciceEndDate: string
  publishedAt: string
}

/**
 * The published key moment of an exercice: the texts the firm retained, and the
 * two reading preferences it published them under.
 *
 * `comments` is a dictionary `slotId -> text`, where the collaborator surface
 * reads an array of variants: the client is served the arbitration, never the
 * deliberation. Its keys are business identifiers, served verbatim — they are
 * never normalised nor camelCased.
 *
 * Carries no author of any kind, and no `templateId`/`templateVersion` either:
 * the gabarit has its own route, which resolves the pinned version itself.
 */
export interface CustomerKeyMomentPayload {
  exerciceId: number
  exerciceStartDate: string
  exerciceEndDate: string
  /** Reference exercice the report is compared against, as a `referenceKey`; null when none */
  preferenceComparisonExercice: string | null
  /** `CurrencyDisplay`, telling whether the figures are read in thousands */
  preferenceCurrencyDisplay: string
  publishedAt: string
  comments: Record<string, string>
  /**
   * The recommendations, flat and in the published order, visible ones only;
   * the reader groups them by rubric. Empty on a key moment published before
   * they existed.
   */
  recommendations: PublishedRecommendationPayload[]
}

