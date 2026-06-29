import type { Collab } from '@entities/types'
import type { SearchAccountItem } from '@entities/services/account/account.type'

export interface RecapStepProps {
  selectedAccount: SearchAccountItem
  selectedCollaborators: Collab[]
}
