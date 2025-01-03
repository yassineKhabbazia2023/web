import type { ImageName } from '../../atoms/PImage/ImageNameTypes'

export interface PErrorBlockProps {
  pButtonText?: string
  pDescription: string
  pErrorName: string
  pErrorText: string
  pHasFooter?: boolean
  pIsFullSize?: boolean
  pTitle: string
  pIllustrationName: ImageName
}
