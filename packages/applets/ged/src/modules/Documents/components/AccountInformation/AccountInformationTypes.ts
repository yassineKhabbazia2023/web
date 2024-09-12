import type { Entity } from '@pulse/Common'

export interface AccountInformationProps {
  accountAvatarColor: Entity['color']
  accountName: Entity['legalName']
  accountNumber: Entity['accountNumber']
}
