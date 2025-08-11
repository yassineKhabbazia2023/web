import dayjs from 'dayjs'
import type { PennylaneDocument } from '@pulse/common/types'
import type { PennylaneDocumentsDetailsLabels } from './pennylane-documents-details.type'

export function getDisplayData(
  labels: PennylaneDocumentsDetailsLabels,
  pennylaneDocument: PennylaneDocument,
) {
  if (pennylaneDocument === undefined) {
    return []
  }
  const {
    path,
    createdAt,
    updatedAt,
  } = pennylaneDocument

  const displayData = [{
    label: labels.path,
    value: path,
  }, {
    label: labels.createdAt,
    value: dayjs(createdAt).format('DD/MM/YYYY'),
  }, {
    label: labels.updatedAt,
    value: dayjs(updatedAt).format('DD/MM/YYYY'),
  }]

  return displayData
}
