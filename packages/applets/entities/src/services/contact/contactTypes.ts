import type { Persona } from '@pulse/common/types'
import type { Operation } from '@entities/types/OperationTypes'
import { ContactType } from '@pulse/common/enums'

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  landPhone?: string
  mobilePhone: string
  type?: ContactType
  office?: string
  persona?: Persona
  createdAt?: string
  oldId?: string
}

export interface PatchContactPayload {
  firstName?: string
  lastName?: string
  landPhone?: string
}

export interface AccountOperations {
  accountNumber: string,
  accountName: string,
  operations: Operation[],
}
