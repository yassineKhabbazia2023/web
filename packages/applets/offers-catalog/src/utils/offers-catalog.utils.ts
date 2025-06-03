import { DEFAULT_TAG_STYLE, CATALOG_TAG_STYLES } from '../const/offers-catalog.const'
import { logger } from '@pulse/core'

export function getCatalogTagStyle(label: string) {
  const catalogTagStyle = CATALOG_TAG_STYLES.find(({ tagLabel }) => tagLabel === label)
  if (catalogTagStyle?.tagStyle === undefined) {
    logger.error(`style not found for label '${label}'`)

    return DEFAULT_TAG_STYLE
  }

  return catalogTagStyle.tagStyle
}
