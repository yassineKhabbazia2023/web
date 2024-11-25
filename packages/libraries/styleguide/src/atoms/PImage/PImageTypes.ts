import type { ImageName } from './ImageNameTypes'

export interface PImageProps {
  pName: ImageName
  pFit?: '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}
