import type { Entity } from '@pulse/common/types'

export interface AddCustomerDrawerProps {
  modelValue: boolean
  targetEntityId: Entity['accountId']
  targetEntityName: Entity['legalName']
  targetEntityNumber: Entity['accountNumber']
}

export interface Contact {
  email: string
  firstname: string
  lastname: string
}
