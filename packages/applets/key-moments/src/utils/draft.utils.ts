import { ReportManager } from '../managers/report.manager'
import type { KeyMomentsDraft } from '../stores/key-moments-draft.types'
import type { Dataset, Report } from '../types/key-moments.types'

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
