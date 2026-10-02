import type { Ref } from 'vue'
import type {
  PublicationDetailPayload,
  PublicationPayload,
} from '../../services/key-moments.service.types'
import type {
  ClosingSummary,
  Divergence,
  Screen,
  TemplateSummary,
} from '../../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../../types/recommendations.types'

/** A modification of the firm, worded: how it reads depends on the domain, which the panel has no reason to know. */
export interface ModificationRow extends Divergence {
  label: string
}

/**
 * What `usePublishState` reads. Every entry comes from a sibling composable of
 * the page, and none is ever written here: the publication state is derived
 * from the report on screen, never a source of it.
 */
export interface PublishStateSources {
  templateCatalogue: Readonly<Ref<TemplateSummary[]>>
  closingCatalogue: Readonly<Ref<ClosingSummary[]>>
  screens: Readonly<Ref<Screen[]>>
  hiddenWidgetIds: Readonly<Ref<string[]>>
  /**
   * What publishing would freeze of the recommendations — already projected:
   * the visible ones, in order, as the page holds them.
   */
  publishableRecommendations: Readonly<Ref<PublishedRecommendationPayload[]>>
  /**
   * The section is shown to the firm, under the offers right: without it
   * publishing is blocked.
   */
  hasRecommendationsSection: Readonly<Ref<boolean>>
  hasRecommendationsCategory: Readonly<Ref<boolean>>
  visibleRecommendationCount: Readonly<Ref<number>>
  /**
   * Offers of visible recommendations the catalogue no longer describes, which
   * the microservice would refuse whole. Publishing is blocked while any remains.
   */
  unresolvedOfferIds: Readonly<Ref<number[]>>
  /** Recommendations without a theme, hidden or not, which are never saved. Publishing is blocked while any remains. */
  recommendationWithoutThemeCount: Readonly<Ref<number>>
  /** Without the themes the projection is empty: neither comparable nor worth publishing over */
  areRecommendationThemesUnreadable: Readonly<Ref<boolean>>
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
