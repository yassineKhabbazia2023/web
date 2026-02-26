import type { ExtendedCollab } from '@entities/modules/wallet/types'

export interface Props {
  data: ExtendedCollab[]
}

export interface Row {
  id: string
  name: string
}
