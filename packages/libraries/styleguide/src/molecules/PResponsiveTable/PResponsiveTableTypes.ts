import type { CellStyle, Sort } from 'element-plus'

export interface PResponsiveTableProps {
  pData: any[]
  pStripe?: boolean
  pFit?: boolean
  pHeaderCellStyle?: CellStyle<Record<string, any>>
  pCellStyle?: CellStyle<Record<string, any>>
  pDefaultSort?: Sort
  pCardClickable?: boolean
  pIsRowSelected?: (row: Record<string, any>) => boolean
  pRowKey?: string
  pDisableResponsive?: boolean
}
