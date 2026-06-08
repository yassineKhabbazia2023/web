import type { MaybeRefOrGetter } from 'vue'
import type { Entity } from '@pulse/common/types'
import type { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'

export interface AddCustomerDrawerProps {
  modelValue: boolean
  targetEntityId: Entity['accountId']
  targetEntityName: Entity['legalName']
  targetEntityNumber: Entity['accountNumber']
  targetEntityAccountType: Entity['accountType']
}

export interface Contact {
  email: string
  firstname: string
  lastname: string
}

export interface UseAddCustomerDrawerOptions {
  invalidEmailAdresseMessage: string
  alreadyAddedToAccountMessage: string
  addCustomerDrawerSteps: MaybeRefOrGetter<AddCustomerDrawerStep[]>
  requiredInputMessage: string
  addCustomerFailedMessage: string
}
