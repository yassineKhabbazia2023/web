import type { PennylaneDocumentsTableFieldKeys, PennylaneDocumentsTableActionName } from './pennylane-documents-table.type'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

export function getPennylaneDocumentsFieldsColumns(labels: Record<PennylaneDocumentsTableFieldKeys, string>) {
  const fieldKeys: PennylaneDocumentsTableFieldKeys[] = [
    'name',
    'path',
    'updatedAt',
    'actions',
  ]

  const columns = fieldKeys
    .map((fieldKey) => ({
      label: labels[fieldKey],
      prop: fieldKey,
      sortable: fieldKey !== 'actions',
    }))

  return columns
}

export function getToolboxElements({
  downloadLabel,
}: {
  downloadLabel: string
}) {
  const downloadItem: PToolboxItemProps<PennylaneDocumentsTableActionName> = {
    pValue: downloadLabel,
    pActionName: 'download',
  }

  return [
    downloadItem,
  ]
}
