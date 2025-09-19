import type { PTagProps } from '../../atoms/PTag/PTagTypes'
import type { ImageName } from '../../atoms/PImage/ImageNameTypes'

export interface PUserCardProps {
  pTitle?: string
  pTag?: PTagProps
  pSubtitle?: string
  pDescription?: string
  pImageName?: ImageName
  pAvatarContent?: string
  pColor?: 'default' | 'gray'
}
