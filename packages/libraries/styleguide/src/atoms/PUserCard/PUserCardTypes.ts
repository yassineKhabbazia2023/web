import type { PTagProps } from '../../atoms/PTag/PTagTypes'
import type { ImageName } from '../../types/ImageName.types'

export interface PUserCardProps {
  pTitle?: string
  pTag?: PTagProps
  pSubtitle?: string
  pDescription?: string
  pImageName?: ImageName
  pAvatarContent?: string
  pColor?: 'persian' | 'gray'
}
