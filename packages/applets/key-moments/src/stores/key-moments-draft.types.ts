import type { PublicationState } from '../enums/key-moments.enums'
import type { CustomerOfferPayload } from '../services/customer-key-moments.service.types'
import type { PublishedOfferPayload } from '../services/offers.service.types'
import type { Dataset, PublishContext, Template } from '../types/key-moments.types'

/**
 * What publishing the draft takes, and how the editor words it — carried along
 * so that the preview offers the very gesture the editor does, worded the same,
 * without rebuilding the diff it rests on.
 */
export interface KeyMomentsDraftPublishing {
  context: PublishContext
  /** The recommendations as the microservice is handed them, wording included */
  snapshots: PublishedOfferPayload[]
  buttonLabel: string
  popupMessage: string
  /** What publishing would change, worded, as the popup states it */
  divergenceLabels: string[]
  /** Nothing to publish, or a recommendation the catalogue no longer describes */
  isDisabled: boolean
}

/**
 * What the editor holds of an exercice, projected as publishing would freeze
 * it, and handed to the preview. Read-only sources rather than a report: the
 * preview still redraws the figures in the unit the reader picks.
 */
export interface KeyMomentsDraft {
  exerciceId: number
  exerciceStartDate: string
  exerciceEndDate: string
  locale: string
  /** The figures, with the texts that would be published in place of the closing's */
  dataset: Dataset
  /** The applied template, the decisions of the firm written onto it */
  template: Template
  referenceKey: string | undefined
  isInThousands: boolean
  /** The recommendations the client would be served, already projected */
  offers: CustomerOfferPayload[]
  /** What the exercice is to the client at the moment the draft was taken */
  publicationState: PublicationState
  publishing: KeyMomentsDraftPublishing
}
