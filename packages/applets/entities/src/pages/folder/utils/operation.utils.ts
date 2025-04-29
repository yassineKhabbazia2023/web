import { OperationStatus, type Operation } from '@entities/common/types/OperationTypes'

export function getPendingOperations(operations: Operation[]) {
  return operations
    .filter(({ status }) => status !== OperationStatus.REJECTED)
}
