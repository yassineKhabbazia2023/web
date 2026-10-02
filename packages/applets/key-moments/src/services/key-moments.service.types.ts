import type { PublishedOfferPayload } from './offers.service.types'
import type { PublishedRecommendationPayload } from '../types/recommendations.types'

/** What the microservice puts on the wire; these shapes stop at the service. */

/**
 * `code` is the id the document carries, which the module names a template by;
 * `templateId` only ever addresses the resource.
 */
export interface TemplateCatalogueEntry {
  templateId: number
  code: string
  version: string
  label: string
}

/** One rejection of the schema the microservice validates an import against. */
export interface ImportError {
  code: string
  pointer: string
  detail: string
}

/**
 * One reading of an editorial slot. `contributorId: null` designates a
 * delivered variant.
 *
 * The microservice omits every key it does not fill rather than writing a null,
 * so none of these nulls is on the wire: `KeyMomentsService.getComments`
 * rewrites the absent keys as explicit nulls, and this shape describes what it
 * returns. Nothing downstream then has two ways of reading the same absence.
 *
 * A delivered variant carries the `closingVersion` that produced it: an
 * exercice re-imported words a slot differently from one version to the next,
 * and the microservice serves one variant per version whose text differs.
 *
 * Those versions are **neither contiguous nor started at one** — a delivery
 * repeating the previous wording is not served under its own number — so a
 * version is always read, never derived from a rank.
 */
export interface CommentVariantPayload {
  contributorId: string | null
  contributorName: string | null
  /**
   * Version of the closing that delivered the text; null on a contribution.
   * The two identity keys are exclusive and exhaustive: a delivered variant has
   * a version and no contributor, a contribution the reverse, never both and
   * never neither.
   */
  closingVersion: number | null
  text: string
  updatedAt: string | null
  /**
   * Whether this reading is the one retained for the slot. Always served, and
   * true on at most one variant of a slot; none at all means nothing was ever
   * retained.
   */
  isRetained: boolean
  /**
   * Whether this is the reading a publication would carry for the slot, which
   * is the rule of the microservice and not a prediction of the page: retaining
   * is a gesture, publishing falls back on its own when nobody made one.
   *
   * Told apart from `isRetained` on purpose — `isRetained` says somebody chose
   * this reading, `isPublishable` says this one would go out. A slot published
   * on a fallback stays unarbitrated, and must never be displayed as arbitrated.
   *
   * True on at most one variant of a slot, and on none at all when the slot
   * would not be published. Only ever set when `getComments` was given the
   * closing to publish: without one the microservice has no publication to
   * describe, and serves it false everywhere.
   */
  isPublishable: boolean
}

export interface SlotCommentsPayload {
  slotId: string
  variants: CommentVariantPayload[]
  /**
   * Whether the firm decided this slot goes out with nothing at all. Always
   * served, and exclusive of every marker a variant carries: a discarded slot
   * has neither a retained reading nor a publishable one, and its `variants`
   * may well be empty — a slot may be discarded before anybody worded it.
   *
   * Told apart from a slot nobody arbitrated on purpose: that one publishes on
   * the fallback of the microservice, this one publishes nothing.
   */
  isDiscarded: boolean
}

/**
 * Which reading of a slot is retained, outside of any publication. The two
 * source keys designate a variant exactly as a published comment does, and are
 * exclusive: a contributor id, or the version of a delivered text.
 */
export interface RetainedCommentPayload {
  sourceContributorId: string | null
  sourceClosingVersion: number | null
  /**
   * Retains no reading at all, which is how a slot is discarded. A third source
   * beside the two above rather than a route of its own: the microservice counts
   * the sources it was given — a null, an empty string and a `false` all count
   * for none — and refuses anything but exactly one. So `false` is never sent
   * where the other two are read, and the field is simply left out.
   *
   * Discarding is undone by retaining a reading, which reopens the slot: there
   * is no second flag saying the reverse.
   */
  retainNone?: boolean
}

/**
 * The only wire shape a caller composes rather than reads, as the imported
 * closing already is: what the page freezes at publication.
 *
 * Carries no comment and no arbitration of any kind: the microservice reads the
 * readings it stores and applies its own rule to them — see `isPublishable`,
 * which is how the page states beforehand what that rule would keep. It carries
 * no version either, of the closing or of the gabarit: a publication always
 * pins the version on display, and naming one here would offer a second way of
 * saying what `closingId` and `templateId` already settle.
 *
 * The offers are the one exception, and for the one reason: the microservice
 * never reads the catalogue, so the wording of the offers the client will be
 * served has to be handed to it. The recommendations citing them are not here —
 * those it stores.
 */
export interface PublishPayload {
  templateId: number
  closingId: number
  /** Left out when the closing offers no comparison */
  preferenceComparisonExercice?: string
  preferenceCurrencyDisplay: string
  /**
   * Every offer cited by a visible recommendation, once, resolved in the
   * catalogue. One missing has the whole publication refused —
   * `missing-offer-description` — which the page makes unreachable rather than
   * catches: it takes the publish button away and names the offer to detach.
   */
  offers: PublishedOfferPayload[]
}

/**
 * One text a publication froze, as it is read back: what the diff compares. The
 * source it came from stays with the microservice, which alone restores it.
 */
export interface PublishedCommentEntryPayload {
  slotId: string
  text: string
}

/**
 * A publication and everything it froze. The summaries carry no comment at all,
 * so the arbitration is only ever read here.
 */
export interface PublicationDetailPayload extends PublicationPayload {
  isActive: boolean
  comments: PublishedCommentEntryPayload[]
  /**
   * Sub-sections the publication froze out, which the summaries never carry.
   * Read only: the publication takes them from what the firm had decided at the
   * time, and `PublicationRequest` carries no such list.
   */
  hiddenWidgetIds: string[]
  /**
   * The recommendations the publication froze: the visible ones, flat, in the
   * published order — what the diff compares. Empty on a publication frozen
   * before they existed.
   */
  recommendations: PublishedRecommendationPayload[]
}

/** An exercice already published, and by whom. */
export interface PublicationPayload {
  id: number
  exerciceId: number
  closingId: number
  closingVersion: number
  templateId: number
  templateVersion: string
  /** Identifier of the publisher, beside the name it was published under */
  publishedBy: string
  publishedByName: string
  publishedAt: string
  /** Null when the publication compared against nothing */
  preferenceComparisonExercice: string | null
  preferenceCurrencyDisplay: string
  /**
   * How many times the client displayed the key moment of the exercice —
   * republications included, never the figure of one revision — and when it
   * last did. `lastViewedAt` is null until a first display. A payload may not
   * carry them at all: an absent figure is unknown, which the page states by
   * saying nothing — never as "never viewed".
   */
  viewCount?: number
  lastViewedAt?: string | null
}
