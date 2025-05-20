import type { ImageName } from '../../types/ImageName.types'

export interface POfferCardProps {
  pLogo: ImageName
  pTitle: string
  pDescription: string
  disabled?: boolean
  pSelected?: boolean
}
