import { computed, ref } from 'vue'
import { OperationStatus, type Operation } from '@entities/common/types/OperationTypes'

const operations = ref<Operation[]>([])

export const useOperation = () => {
  const availableOperations = computed(() =>
    operations.value.filter(
      (operation) => operation.status !== OperationStatus.REJECTED,
    ),
  )

  return { operations, availableOperations }
}
