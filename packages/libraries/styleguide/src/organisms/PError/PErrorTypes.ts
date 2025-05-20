import type { ImageName } from '../../types/ImageName.types'

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
