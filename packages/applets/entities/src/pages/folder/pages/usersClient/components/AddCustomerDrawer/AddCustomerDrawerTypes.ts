import type { Entity } from '@pulse/common'

export interface AddCustomerDrawerProps {
  modelValue: boolean
  targetEntityId: Entity['accountId']
  targetEntityName: Entity['legalName']
  targetEntityNumber: Entity['accountNumber']
}
