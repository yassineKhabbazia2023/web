import { type UploadFile, type UploadRawFile, type UploadStatus } from 'element-plus'
import type { IconName } from '../../types/IconName.types'

export interface PUploadFileLineProps {
  pIconName?: IconName
  pHasButton?: boolean
  pButtonIconName?: IconName
  pTitleButton?: string
  pFile: UploadFile | UploadRawFile
  pStatus: UploadStatus
  pColor?: 'persian' | 'white'
  pIsMultiLine?: boolean
}
