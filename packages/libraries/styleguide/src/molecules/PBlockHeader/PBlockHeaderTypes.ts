import type { PImageProps } from '@/atoms/PImage/PImageTypes'

export interface PBlockHeaderProps {
  pTitle: string
  pDescription?: string
  pSize: 'default' | 'big'
  pColor: 'gray' | 'persian'
  pImage: PImageProps
  pHasButton: boolean
}
