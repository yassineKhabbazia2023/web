import type { Entity } from '@pulse/common/types'

export interface AccountInformationProps {
  accountAvatarColor: Entity['color']
  accountName: Entity['legalName']
  accountNumber: Entity['accountNumber']
}
