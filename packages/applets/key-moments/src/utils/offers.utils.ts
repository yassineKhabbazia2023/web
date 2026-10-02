import { filterRecordByKeyCallback } from '@pulse/toolbox/utils/array'
import { getAlphanumericString } from '@pulse/toolbox/utils/string'
import { DEFAULT_OFFER_TAG_COLOR, OFFER_TAG_COLORS } from '@pulse/styleguide/constants'
import type { PTagProps } from '@pulse/styleguide/types'
import type { CatalogOfferPayload } from '../services/offers.service.types'
import type { SearchableOffer } from '../types/key-moments.types'

/** Accents and case flattened, so that `prevoyance` finds `Prévoyance`. */
export function normalizeSearchTerm(term: string): string {
  return getAlphanumericString(term).toLocaleLowerCase()
}

/**
 * What an offer is found by — far more than its title and its description, so
 * that typing the name of a category narrows the list without a filter being
 * touched.
 */
function offerSearchTerms(offer: CatalogOfferPayload): string {
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
