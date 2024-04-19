import type { Entity } from '@kpmg/common'

// Penser à bouger les types de la délégation ici pour avoir un truc global
export interface Delegation {
  id: number
  account: {
    id: Entity['accountId']
  }
}
