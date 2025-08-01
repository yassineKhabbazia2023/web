import type { OfferDescription, OfferWithSearchTerms } from '@offers-catalog/types/offers-catalog.types'
import type { PTagProps } from '@pulse/styleguide/types'
import { DEFAULT_TAG_PROPS, CATALOG_TAG_STYLES } from '../const/offers-catalog.const'
import { logger } from '@pulse/core'
import { getAlphanumericString } from '@pulse/core/utils/string'

export function getCatalogTagProps(label: string): Omit<PTagProps, 'pContent'> {
  const catalogTagStyle = CATALOG_TAG_STYLES.find(({ tagLabel }) => tagLabel === label)
  if (catalogTagStyle?.tagProps === undefined) {
    logger.error(`tag props not found for label '${label}'`)

    return DEFAULT_TAG_PROPS
  }

  return catalogTagStyle.tagProps
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
