import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import type { IconName } from '../../types/IconName.types'
import { UploadFileStatus } from '../../constants/uploadStatus.const'

export function getMainIconName(
  pStatus: PUploadFileLineProps['pStatus'],
  pIconName: PUploadFileLineProps['pIconName'],
): IconName | undefined {
  return pStatus === UploadFileStatus.FAIL ? 'exclamationTriangle' : pIconName
}
