import type { Operation } from '@entities/types'

export interface ConfirmActionModalProps {
  modelValue: boolean
  selectedOperation: Operation
  isOperationPendingRefusal: boolean
}
