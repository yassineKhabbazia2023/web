import type { Operation } from '@entities/types'

export interface AccountOperations {
  accountNumber: string,
  accountName: string,
  operations: Operation[],
}
