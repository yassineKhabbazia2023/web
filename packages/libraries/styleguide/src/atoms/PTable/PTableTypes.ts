import type { CellStyle } from 'element-plus'

export interface PTableProps {
  pData: any[]
  pStripe?: boolean
  pFit?: boolean
  pHeaderCellStyle?: CellStyle<Record<string, any>>
  pCellStyle?: CellStyle<Record<string, any>>
  pRowKey?: string | ((row: any) => string)
}
