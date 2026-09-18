import type { OfferDescription, OfferWithSearchTerms } from '@offers-catalog/types/offers-catalog.types'
import type { PTagProps } from '@pulse/styleguide/types'
import { DEFAULT_TAG_PROPS } from '../const/offers-catalog.const'
import { OFFER_TAG_COLORS } from '@pulse/styleguide/constants'
import { logger } from '@pulse/toolbox'
import { getAlphanumericString } from '@pulse/toolbox/utils/string'

export function getCatalogTagProps(label: string): Omit<PTagProps, 'pContent'> {
  const tagColor = OFFER_TAG_COLORS[label]
  if (tagColor === undefined) {
    logger.error(`tag props not found for label '${label}'`)

    return DEFAULT_TAG_PROPS
  }

  return { pColor: tagColor }
}

export function normalizeSearchTerm(searchTerm: string): string {
  return getAlphanumericString(searchTerm).toLocaleLowerCase()
}

export function getOfferSearchTerms(offer: OfferDescription): string {
  const { title, shortDescription, subCategory, tags, searchKeywords, priorityTargets } = offer

  const { category } = subCategory

  const tagsLabels = (tags ?? []).join(' ')
  const priorityTargetLabels = (priorityTargets ?? []).join(' ')

  const searchTerms = [
    normalizeSearchTerm(title),
    normalizeSearchTerm(shortDescription),
    normalizeSearchTerm(subCategory.name),
    normalizeSearchTerm(category.name),
    normalizeSearchTerm(tagsLabels),
    normalizeSearchTerm(searchKeywords),
    normalizeSearchTerm(priorityTargetLabels),
  ]

  return searchTerms.filter(Boolean).join(' ')
}

export function getOffersWithSearchTerms(offers: OfferDescription[]) {
  const offerWithSearchTerms = offers
    .map<OfferWithSearchTerms>((offer) => ({
      ...offer,
      searchTerms: getOfferSearchTerms(offer),
    }))

  return offerWithSearchTerms
}
