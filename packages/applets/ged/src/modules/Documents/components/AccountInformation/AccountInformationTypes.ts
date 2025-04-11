import type { Entity } from '@pulse/common/types'

export interface AccountInformationProps {
  accountName: Entity['legalName']
  accountNumber: Entity['accountNumber']
}
