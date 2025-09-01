import type { PennylaneDocumentsTableFieldKeys } from './pennylane-documents-table.type'

export function getPennylaneDocumentsFieldsColumns(labels: Record<PennylaneDocumentsTableFieldKeys, string>) {
  const fieldKeys: PennylaneDocumentsTableFieldKeys[] = [
    'name',
    'path',
    'updatedAt',
  ]
  const columns = fieldKeys
    .map((fieldKey) => ({
      label: labels[fieldKey],
      prop: fieldKey,
      sortable: true,
    }))

  return columns
}
