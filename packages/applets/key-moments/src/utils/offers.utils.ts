import { filterRecordByKeyCallback } from '@pulse/toolbox/utils/array'
import { getAlphanumericString } from '@pulse/toolbox/utils/string'
import { DEFAULT_OFFER_TAG_COLOR, OFFER_TAG_COLORS } from '@pulse/styleguide/constants'
import type { PTagProps } from '@pulse/styleguide/types'
import type {
  CatalogOfferPayload,
  LinkedOfferPayload,
  PublishedOfferPayload,
} from '../services/offers.service.types'
import type {
  LinkedOffer,
  PublishableOffer,
  SearchableOffer,
} from '../types/key-moments.types'

/** The most the microservice accepts of either note written about an offer */
export const OFFER_COMMENT_MAX_LENGTH = 1000

/** Accents and case flattened, so that `prevoyance` finds `Prévoyance`. */
export function normalizeSearchTerm(term: string): string {
  return getAlphanumericString(term).toLocaleLowerCase()
}

/**
 * What an offer is found by — far more than its title and its description, so
 * that typing the name of a category narrows the list without a filter being
 * touched.
 */
export function offerSearchTerms(offer: CatalogOfferPayload): string {
  const fields = [
    offer.title,
    offer.shortDescription ?? '',
    offer.subCategory?.name ?? '',
    offer.subCategory?.category?.name ?? '',
    (offer.tags ?? []).join(' '),
    offer.searchKeywords ?? '',
    (offer.priorityTargets ?? []).join(' '),
  ].join(' ')

  // normalised once on the joined string rather than field by field: the
  // normaliser already collapses runs of whitespace and trims, so the result is
  // the same for a seventh of the passes over the whole catalogue
  return normalizeSearchTerm(fields)
}

/** Indexed once when the catalogue lands, never on every keystroke. */
export function catalogWithSearchTerms(offers: CatalogOfferPayload[]): SearchableOffer[] {
  return offers.map(offer => ({ ...offer, searchTerms: offerSearchTerms(offer) }))
}

/**
 * The colour a tag is written in, the neutral of the set for one the table does
 * not name — `EC`, as this is written. Read here rather than in the markup, so
 * that the chips of the filter row and the tags of a card cannot disagree.
 */
export function offerTagColor(tag: string): PTagProps['pColor'] {
  return OFFER_TAG_COLORS[tag] ?? DEFAULT_OFFER_TAG_COLOR
}

/**
 * Colour families ordered by hue, indigo to yellow, so two chips beside each
 * other are always neighbouring hues. An unlisted colour sorts last, so adding
 * one never reshuffles a filter row.
 */
const OFFER_TAG_COLOR_ORDER: PTagProps['pColor'][] = [
  'blue',
  'info',
  'tranquil',
  'success',
  'warning',
]

/** Where a tag's colour family sits in the walk, past the end for an unnamed one. */
function colorRank(tag: string): number {
  const rank = OFFER_TAG_COLOR_ORDER.indexOf(offerTagColor(tag))

  return rank === -1 ? OFFER_TAG_COLOR_ORDER.length : rank
}

/**
 * Every tag the catalogue carries, once each, grouped by colour family and
 * alphabetical within a family.
 *
 * Sorted on the colour rather than on the label so that the filter row reads as
 * one gradient: a reader looking for `Conseil` scans the blues, not fourteen
 * chips. Alphabetical inside a family is what keeps it findable all the same.
 *
 * Derived from the offers rather than read from the référentiel, which serves no
 * list of tags: a chip is only worth offering if an offer answers it, and a tag
 * nothing styles yet has to be there all the same.
 */
export function catalogTags(offers: CatalogOfferPayload[]): string[] {
  const tags = new Set(offers.flatMap(offer => offer.tags ?? []))

  return [...tags].sort((first, second) => {
    const byColor = colorRank(first) - colorRank(second)

    return byColor === 0 ? first.localeCompare(second, 'fr') : byColor
  })
}

/**
 * A tag as a test hook: accents flattened and spaces bound, so that
 * « Gestion sociale » is reached by `gestion-sociale` rather than by whatever
 * the référentiel spells it with.
 */
export function offerTagTestId(tag: string): string {
  return normalizeSearchTerm(tag).replaceAll(' ', '-')
}

/**
 * The search and the tag chip narrow together, and an empty search narrows
 * nothing: the whole catalogue is what an opened picker owes its reader.
 *
 * Matched word by word rather than on the whole phrase, which is what the
 * catalogue of the same offers is searched with: « prevoyance tns » must find
 * the same row as « tns prevoyance », or the two screens disagree on one
 * catalogue.
 */
export function filterCatalog(
  offers: SearchableOffer[],
  searchTerm: string,
  tag?: string,
): SearchableOffer[] {
  const normalized = normalizeSearchTerm(searchTerm)

  return offers.filter((offer) => {
    const matchesTag = tag === undefined || (offer.tags ?? []).includes(tag)

    return matchesTag
      && filterRecordByKeyCallback(offer, 'searchTerms', normalized)
  })
}

/**
 * The attached list overlaid with the catalogue, which is the only place the
 * wording lives: the microservice stores a title and nothing else. An offer the
 * catalogue no longer carries — or a catalogue that could not be read at all —
 * keeps its stored title and loses the rest, which is exactly what `isRetired`
 * warns the reader about: nothing is known of that card any more.
 *
 * The decisions always come from the stored row.
 */
export function joinOffers(
  linked: LinkedOfferPayload[],
  catalog: CatalogOfferPayload[],
): LinkedOffer[] {
  const byId = new Map(catalog.map(offer => [offer.id, offer]))

  return linked.map((offer) => {
    const known = byId.get(offer.offerId)

    return {
      offerId: offer.offerId,
      title: known?.title ?? offer.title,
      shortDescription: known?.shortDescription,
      tags: known?.tags,
      categoryName: known?.subCategory?.category?.name,
      comment: offer.comment,
      benefitsComment: offer.benefitsComment,
      priority: offer.priority,
      isPriorityVisible: offer.isPriorityVisible,
      isHidden: offer.isHidden,
      isRetired: known === undefined,
    }
  })
}

/**
 * What publishing would freeze: the offers not hidden, in order, reduced to
 * their decisions. The shape the diff compares — and the reason hiding one
 * lights the publish button, since it leaves this projection.
 */
export function publishableOffers(linked: LinkedOfferPayload[]): PublishableOffer[] {
  return linked
    .filter(offer => offer.isHidden === false)
    .map(({ offerId, comment, benefitsComment, priority, isPriorityVisible }) => ({
      offerId,
      comment,
      benefitsComment,
      priority,
      isPriorityVisible,
    }))
}

/**
 * What publishing hands the microservice of the recommendations: the wording of
 * every offer attached and not hidden, in the order it is read.
 *
 * Resolved in the catalogue and never in the stored row, which no longer keeps
 * anything of the wording but the title: the microservice does not read the
 * catalogue, so what the client will be served has to be composed here, at the
 * one moment it is frozen.
 *
 * An offer the catalogue no longer carries is simply not here — and that is the
 * whole reason `unresolvedOfferIds` exists: publishing without it is refused,
 * so the page must never offer to.
 */
export function publishedOfferSnapshots(
  linked: LinkedOfferPayload[],
  catalog: CatalogOfferPayload[],
): PublishedOfferPayload[] {
  const byId = new Map(catalog.map(offer => [offer.id, offer]))

  return linked
    .filter(offer => offer.isHidden === false)
    .flatMap((offer) => {
      const known = byId.get(offer.offerId)

      return known === undefined ? [] : [{
        offerId: known.id,
        title: known.title,
        shortDescription: known.shortDescription,
        categoryName: known.subCategory?.category?.name,
        subCategoryName: known.subCategory?.name,
        imageUrl: known.imageUrl,
        pdfUrl: known.pdfUrl,
      }]
    })
}

/**
 * The recommendations that would go out and cannot be described: attached, not
 * hidden, and gone from the catalogue. A catalogue that could not be read at
 * all reads the same and is just as blocking — the permission never causes it,
 * an outage does.
 *
 * Publishing one of them is refused whole, so the page states it beforehand and
 * invites the firm to detach it: a card nobody knows anything about any more is
 * not one to send to a client.
 */
export function unresolvedOfferIds(
  linked: LinkedOfferPayload[],
  catalog: CatalogOfferPayload[],
): number[] {
  const knownIds = new Set(catalog.map(offer => offer.id))

  return linked
    .filter(offer => offer.isHidden === false && knownIds.has(offer.offerId) === false)
    .map(offer => offer.offerId)
}

/**
 * The recommendations put back to what the publication froze, **without
 * touching the ones the firm has hidden**: hiding and detaching are two
 * different gestures, and a hidden offer is one the firm means to show again
 * with the words it already wrote about it.
 *
 * Three kinds of row meet here, and the publication settles each on its own:
 * one it froze is restored to the reading, hidden or not since — that is the
 * very divergence being undone; one attached and hidden after it is kept
 * whole, comment and degree included, because nothing about it was ever
 * published; one attached and left visible after it is dropped, which is the
 * modification the reader asked to take back.
 *
 * A kept row stays at the rank it holds today rather than being pushed to the
 * end: showing it again must not silently move it in the reading.
 */
export function restoredOffers(
  published: LinkedOfferPayload[],
  linked: LinkedOfferPayload[],
): LinkedOfferPayload[] {
  const publishedIds = new Set(published.map(offer => offer.offerId))
  const restored = [...published]

  linked.forEach((offer, rank) => {
    if (offer.isHidden === false || publishedIds.has(offer.offerId)) {
      return
    }

    restored.splice(Math.min(rank, restored.length), 0, offer)
  })

  return restored
}

/**
 * What is stored of a catalogue offer the moment it is attached: which offer,
 * and the title it was attached under. Nothing else — the microservice keeps no
 * wording, and what the client is served is composed at publication, from the
 * catalogue as it stands then rather than as it stood on the day of the click.
 *
 * The title is stored so that a row still names itself once the offer has left
 * the catalogue, which is the one thing a reader needs to detach it.
 */
export function snapshotOf(offer: CatalogOfferPayload): LinkedOfferPayload {
  return {
    offerId: offer.id,
    title: offer.title,
    isPriorityVisible: false,
    isHidden: false,
  }
}
