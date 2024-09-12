import type { Entity } from '@kpmg/common'

export interface AccountInformationProps {
  accountAvatarColor: Entity['color']
  accountName: Entity['legalName']
  accountNumber: Entity['accountNumber']
}
