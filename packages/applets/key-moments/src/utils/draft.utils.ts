import { ReportManager } from '../managers/report.manager'
import type { CustomerOfferPayload } from '../services/customer-key-moments.service.types'
import type { KeyMomentsDraft } from '../stores/key-moments-draft.types'
import type { Dataset, LinkedOffer, Report } from '../types/key-moments.types'

/**
 * The figures under the texts the client would read: slot id to publishable
 * text, exactly what the publication diff compares. A slot named with an empty
 * text is one the firm took out, and a slot not named goes out empty as well —
 * `buildReport` reads the comments of the dataset and nowhere else.
 */
export function projectDraftDataset(
  dataset: Dataset,
  publishedComments: Record<string, string>,
): Dataset {
  return { ...dataset, comments: publishedComments }
}

/**
 * The recommendations as the client would be served them: the ones attached,
 * not hidden and still described by the catalogue, in order. A degree the firm
 * chose not to show is simply absent, as the microservice serves it.
 */
export function customerOffersOf(linkedOffers: LinkedOffer[]): CustomerOfferPayload[] {
  return linkedOffers
    .filter(offer => offer.isHidden === false && offer.isRetired === false)
    .map(offer => ({
      offerId: offer.offerId,
      title: offer.title,
      shortDescription: offer.shortDescription,
      categoryName: offer.categoryName,
      comment: offer.comment,
      benefitsComment: offer.benefitsComment,
      priority: offer.isPriorityVisible ? offer.priority : undefined,
    }))
}

/**
 * The draft laid out as the client page lays a publication out: without the
 * sub-sections the firm hid, and without the sections that are left empty —
 * the rule the microservice applies when it freezes a publication.
 */
export function buildDraftReport(draft: KeyMomentsDraft, inThousands: boolean): Report {
  return ReportManager.buildReport(draft.dataset, draft.template, {
    keepHidden: false,
    inThousands,
    referenceKey: draft.referenceKey,
  })
}
