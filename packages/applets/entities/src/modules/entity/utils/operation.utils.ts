import { OperationStatus } from '@entities/enums'
import type { Operation } from '@entities/types'

export function getPendingOperations(operations: Operation[]) {
  return operations
    .filter(({ status }) => status === OperationStatus.PENDING)
}
