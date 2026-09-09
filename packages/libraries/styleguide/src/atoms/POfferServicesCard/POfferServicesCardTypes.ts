import type { PTagProps } from '../../atoms/PTag/PTagTypes'
import type { ImageName } from '../../atoms/PImage/ImageNameTypes'

export interface PService {
  pStatus: boolean
  pDisabled: boolean
  pName: string
  pTag?: PTagProps
}

export interface POfferServicesCardProps {
  pLogo: ImageName
  pTitle: string
  pServices: PService[]
  pHasHeader?: boolean
}
