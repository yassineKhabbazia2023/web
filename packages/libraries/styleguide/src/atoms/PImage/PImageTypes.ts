import type { ImageName } from '../../types/ImageName.types'
export interface PImageProps {
  pName: ImageName
  pFit?: '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}
