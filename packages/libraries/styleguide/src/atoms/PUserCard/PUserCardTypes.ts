import type { PTagProps } from '../../atoms/PTag/PTagTypes'

export interface PUserCardProps {
  pTitle: string
  pTag?: PTagProps
  pSubtitle?: string
  pDescription?: string
  pAssetLeft: 'Image' | 'Avatar'
  pAssetContent: string
  pColor?: 'persian' | 'gray'
}
