import type { PUploadFileLineProps } from './PUploadFileLineTypes'
import type { IconName } from '../../types/IconName.types'

export function getMainIconName(
  pStatus: PUploadFileLineProps['pStatus'],
  pIconName: PUploadFileLineProps['pIconName'],
): IconName | undefined {
  return pStatus === 'fail' ? 'exclamationTriangle' : pIconName
}
