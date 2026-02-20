import type { Operation } from '@entities/types/OperationTypes'

export interface AccountOperations {
  accountNumber: string,
  accountName: string,
  operations: Operation[],
}
