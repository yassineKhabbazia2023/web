import type { CellStyle } from 'element-plus'
import type { IconName } from '../../types/IconName.types'

export interface PTableProps {
  pData: any[]
  pStripe?: boolean
  pFit?: boolean
  pHeaderCellStyle?: CellStyle<Record<string, any>>
  pCellStyle?: CellStyle<Record<string, any>>
  pRowKey?: string | ((row: any) => string)
  pEmptyText?: string
  pEmptyIconName?: IconName
  pEmptyActionLabel?: string
}
