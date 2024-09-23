import type { Entity } from '@pulse/Common'

export interface AddCustomerDrawerProps {
  modelValue: boolean
  targetEntityId: Entity['accountId']
  targetEntityName: Entity['legalName']
  targetEntityNumber: Entity['accountNumber']
}
