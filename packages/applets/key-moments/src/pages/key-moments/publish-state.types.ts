import type { Ref } from 'vue'
import type {
  PublicationDetailPayload,
  PublicationPayload,
} from '../../services/key-moments.service.types'
import type { LinkedOfferPayload } from '../../services/offers.service.types'
import type {
  ClosingSummary,
  Comparison,
  Divergence,
  PublishableOffer,
  Screen,
  TemplateSummary,
} from '../../types/key-moments.types'

/**
 * A modification the firm may take back, worded and settled: whether taking it
 * back is still possible depends on what the catalogues carry, and how it reads
 * depends on the domain — neither is something the panel displaying the row has
 * any reason to know.
 */
export interface ModificationRow extends Divergence {
  isRevertible: boolean
  /** What the row says of itself */
  label: string
  /** Why it offers nothing, or what undoing it does not do. Absent says neither. */
  hint?: string
}

/**
 * What `usePublishState` reads. Every entry comes from a sibling composable of
 * the page, and none is ever written here: the publication state is derived
 * from the report on screen, never a source of it.
 */
export interface PublishStateSources {
  templateCatalogue: Readonly<Ref<TemplateSummary[]>>
  closingCatalogue: Readonly<Ref<ClosingSummary[]>>
  comparisons: Readonly<Ref<Comparison[]>>
  screens: Readonly<Ref<Screen[]>>
  hiddenWidgetIds: Readonly<Ref<string[]>>
  /**
   * What publishing would freeze of the recommendations — already projected:
   * the hidden ones are out, and only the decisions remain. Always readable,
   * even for a firm without the permission to see the section, so that the diff
   * never announces a detachment nobody made.
   */
  publishableSelection: Readonly<Ref<PublishableOffer[]>>
  /**
   * Recommendations the catalogue no longer describes, which the microservice
   * would refuse whole. Publishing is blocked while any remains.
   */
  unresolvedOfferIds: Readonly<Ref<number[]>>
  selectedTemplateId: Readonly<Ref<number | undefined>>
  selectedClosingId: Readonly<Ref<number | undefined>>
  selectedReferenceKey: Readonly<Ref<string | undefined>>
  selectedExerciceId: Readonly<Ref<number | undefined>>
  isInThousands: Readonly<Ref<boolean>>
  /** False while the figures load, which is never a state to compare against */
  hasReport: Readonly<Ref<boolean>>
  publicationDetail: Readonly<Ref<PublicationDetailPayload | undefined>>
  publicationOf: (exerciceId: number) => PublicationPayload | undefined
  /**
   * Slot id -> the text the client would read. Taken from what the microservice
   * marks as publishable, so the diff never predicts a rule that is not its own.
   */
  buildPublishedComments: (screens: Screen[]) => Record<string, string>
  /**
   * How the page writes an instant. Borrowed rather than redone: a diff naming
   * a closing has to name it the way the selector the reader picked it from
   * does, and that wording — the locale included — belongs to the page.
   */
  formatInstant: (date: string) => string
}

/**
 * The gestures taking a modification back. Each one is the very action the
 * reader would have made themselves, so undoing never has a path of its own.
 */
export interface PublishStateActions {
  selectClosing: (closingId: number, keptReferenceKey?: string) => Promise<void>
  selectTemplate: (templateId: number) => Promise<void>
  selectComparison: (referenceKey: string) => void
  toggleThousands: (inThousands: boolean) => void
  writeHiddenWidgets: (widgetIds: string[]) => Promise<void>
  restorePublishedArbitration: () => Promise<void>
  /** Takes the rows the publication froze; the hidden ones are carried over */
  restoreOffers: (offers: LinkedOfferPayload[]) => Promise<void>
}
