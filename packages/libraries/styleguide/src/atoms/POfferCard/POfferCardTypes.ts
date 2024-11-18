import type { ImageName } from '../PImage/ImageNameTypes'

export interface POfferCardProps {
  pLogo: ImageName
  pTitle: string
  pDescription: string
  disabled?: boolean
}
