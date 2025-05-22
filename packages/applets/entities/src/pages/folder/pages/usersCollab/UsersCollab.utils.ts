import { type Operation } from '@entities/common/types/OperationTypes'

export function getOperationsWithLegalName(
  pendingOperations: Operation[],
  defaultLegalName: string,
) {
  return pendingOperations
    .map(pendingOperation => ({
      ...pendingOperation,
      legalName: pendingOperation.legalName || defaultLegalName,
    }))
}

export function getAccountOperationsList(
  pendingOperationsWithLegalName: Operation[],
) {
  const firstOperation = pendingOperationsWithLegalName.at(0)
  const accountNumber = firstOperation?.accountNumber ?? ''

  return pendingOperationsWithLegalName.length > 0
    ? [{
      operations: pendingOperationsWithLegalName,
      accountNumber,
      accountName: '',
    }]
    : []
}
