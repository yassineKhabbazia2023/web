import { type UploadStatus } from 'element-plus'
import type { IconName } from '../../types/IconName.types'

export interface PUploadFileLineProps {
  pIconName?: IconName
  pHasButton?: boolean
  pButtonIconName?: IconName
  pTitleButton?: string
  pFileName: string
  pStatus: UploadStatus
  pMessage?: string
  pColor?: 'persian' | 'white'
  pIsMultiLine?: boolean
}
