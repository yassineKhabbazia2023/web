import { logger } from '@pulse/toolbox'
import type {
  Closing,
  Indicators,
  Dataset,
  Measure,
  Template,
} from '../types/key-moments.types'

/**
 * Keeps only the figures whose indicator the vocabulary declares, dropping the
 * rest silently — unknown figures are an upstream data issue, not something
 * to report here.
 */
export function selectKnownValues(
  values: Record<string, Record<string, number>>,
  indicatorIds: string[],
): Record<string, Record<string, number>> {
  const knownIndicatorIds = new Set(indicatorIds)

  return Object.fromEntries(
    Object.entries(values).filter(([indicatorId]) => knownIndicatorIds.has(indicatorId)),
  )
}

/**
 * Drops the figures naming a measure the dictionary of the closing does not
 * declare. Symmetric to `selectKnownValues`, and silent for the same reason: a
 * figure the report has no way to name is a figure nothing can display, and the
 * export that shipped it is answerable to the validator, not to this page.
 */
export function selectKnownMeasures(
  values: Record<string, Record<string, number>>,
  measures: Measure[],
): Record<string, Record<string, number>> {
  const knownKeys = new Set(measures.map(measure => measure.key))

  return Object.fromEntries(Object.entries(values).map(([indicatorId, cells]) => [
    indicatorId,
    Object.fromEntries(Object.entries(cells).filter(([key]) => knownKeys.has(key))),
  ]))
}

/**
 * Merges the two sources the figures of a report come from: the vocabulary of
 * indicators, and the closing carrying both the figures and the editorial
 * content of one entity. A indicator only exists if the vocabulary declares it.
 *
 * The template is deliberately not part of it: it lays these figures out, and
 * swapping it must never ask the data for anything.
 */
export function assembleDataset(
  indicators: Indicators,
  closing: Closing,
): Dataset {
  const values = selectKnownMeasures(
    selectKnownValues(closing.values, indicators.indicators.map(indicator => indicator.id)),
    closing.metadata.measures,
  )

  return {
    metadata: closing.metadata,
    indicators: indicators.indicators,
    values,
    comments: closing.comments,
  }
}

/**
 * Reports the indicators a template names that the vocabulary does not declare.
 * Bound to the template rather than to the figures, so it is replayed every
 * time another template is applied on the same closing.
 */
export function checkTemplateAgainstData(
  template: Template,
  data: Dataset,
): void {
  const knownIndicatorIds = new Set(data.indicators.map(indicator => indicator.id))
  const unknownIndicatorIds = [...new Set(template.screens
    .flatMap(screen => screen.widgets)
    .flatMap(widget => widget.lines.map(line => line.indicator))
    .filter(indicatorId => knownIndicatorIds.has(indicatorId) === false))]

  if (unknownIndicatorIds.length > 0) {
    logger.warn('[KeyMoments] template lines naming indicators absent from the vocabulary', unknownIndicatorIds)
  }
}
