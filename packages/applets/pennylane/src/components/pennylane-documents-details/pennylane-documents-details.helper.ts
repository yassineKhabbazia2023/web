import dayjs from 'dayjs'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import type { PennylaneDocumentsDetailsLabels } from './pennylane-documents-details.type'

export function getDisplayData(
  labels: PennylaneDocumentsDetailsLabels,
  pennylaneDocument: FormattedPennylaneDocument,
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
