import { SortDirection } from '@pulse/common/enums'

export const INVOICE_FILE_EXTENSION = '.pdf'

export const INVOICE_FILE_MIME_TYPE = 'application/pdf'

export const SORT_ORDER_PARAMS: Record<SortDirection, string> = {
  [SortDirection.ASCENDING]: 'asc',
  [SortDirection.DESCENDING]: 'desc',
}
