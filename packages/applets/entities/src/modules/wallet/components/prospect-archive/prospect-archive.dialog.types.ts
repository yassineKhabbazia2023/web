import type { ProspectWalletData } from '@entities/modules/wallet/types'

export interface ProspectArchiveDialogProps {
  prospect: ProspectWalletData
}

export type ProspectArchiveDialogEmit = {
  archived: []
}
