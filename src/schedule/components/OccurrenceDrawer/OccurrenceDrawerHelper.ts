import type { Occurrence } from '@/schedule/models/Deadline'
import { getTypeLabel } from '@/schedule/helpers/utils'

export function getFrequencyLabel(
  frequencyLabels: Record<string, string>,
  occurrence: Occurrence | undefined,
) {
  const frequency = occurrence?.schedule?.frequency ?? ''

  return frequencyLabels[frequency]
    ? `(${frequencyLabels[frequency]})`
    : ''
}

export function getCreatedByLabel(
  occurrence: Occurrence | undefined,
) {
  const createdBy = occurrence?.schedule?.createdBy ?? ''

  return createdBy
    ? `${createdBy.firstName} ${createdBy.lastName}`
    : ''
}

export function getShortLabel(
  shortScheduleModelsByKey: Record<string, string> | undefined,
  occurrence: Occurrence | undefined,
) {
  return occurrence
    ? getTypeLabel(shortScheduleModelsByKey, occurrence.template)
    : ''
}

export function getLongLabel(
  longScheduleModelsByKey: Record<string, string> | undefined,
  shortLabel: string,
  occurrence: Occurrence | undefined,
) {
  const longLabel = occurrence
    ? getTypeLabel(longScheduleModelsByKey, occurrence.template)
    : ''

  return (longLabel && longLabel !== shortLabel)
    ? `(${longLabel})`
    : ''
}
