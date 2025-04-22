import type { Operation } from '@entities/common/types/OperationTypes'

export interface ConfirmActionModalProps {
  modelValue: boolean
  selectedOperation: Operation
  isOperationPendingRefusal: boolean
  legalName: string
}
