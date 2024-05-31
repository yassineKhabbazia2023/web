import type { Entity } from '@kpmg/common'

export interface AddCustomerDrawerProps {
  modelValue: boolean
  targetEntityId: Entity['accountId']
  targetEntityName: Entity['legalName']
}
