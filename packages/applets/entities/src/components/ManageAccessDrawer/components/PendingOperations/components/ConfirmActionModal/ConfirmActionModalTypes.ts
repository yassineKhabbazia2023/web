import type { Operation } from '@entities/types/OperationTypes'

export interface ConfirmActionModalProps {
  modelValue: boolean
  selectedOperation: Operation
  isOperationPendingRefusal: boolean
}
