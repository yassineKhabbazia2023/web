import type { Entity } from '@pulse/common'

export interface AccountInformationProps {
  accountAvatarColor: Entity['color']
  accountName: Entity['legalName']
  accountNumber: Entity['accountNumber']
}
