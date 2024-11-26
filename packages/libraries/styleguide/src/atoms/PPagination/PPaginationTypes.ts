export interface PaginationProps {
  pPageSizes?: number[]
  pPageSizeSelectorGroupLabel?: string
  pPageSizeSelectorSuffix?: string
  pShowTotalPageCounter?: boolean
  pTotal: number
  // named v-model
  pCurrentPage?: number
  pPageSize?: number
  pTestIdRoot?: string
}
