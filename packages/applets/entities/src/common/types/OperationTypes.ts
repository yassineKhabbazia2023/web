
export enum OperationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}


export interface Operation {
  operationId: number
  operationName?: string
  operationType?: string
  creationDate?: string
  roleId: string
  status?: string
  email: string
  firstName?: string
  lastName?: string
  accountNumber: string
}
