import type { PTagProps } from '@styleguide/atoms/PTag/PTagTypes'

export interface PService {
  pStatus: boolean
  pDisabled: boolean
  pName: string
  pTag?: PTagProps
}

export interface POfferServicesCardProps {
  pLogo: string
  pTitle: string
  pServices: PService[]
}
