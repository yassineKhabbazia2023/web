import type { Persona } from '@pulse/common/types'
import type { Operation } from '@entities/common/types/OperationTypes'

export enum ContactType {
  Collaborator = 'Collaborator',
  Customer = 'Customer'
}

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  landPhone?: string
  mobilePhone: string
  type?: 'Collaborator' | 'Customer'
  office?: string
  persona?: Persona
  createdAt?: string
  oldId?: string
}

export interface PatchContactPayload {
  firstName?: string
  lastName?: string
  mobilePhone?: string
  landPhone?: string
}

export interface OperationsByAccount {
  accountNumber: string,
  accountName: string,
  operations: Operation[],
}