import { computed } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import type { FormInstance } from 'element-plus'
import type { InvoicesFullFormModel } from '@entities/modules/entity/types'

interface UseInvoicesFirstStepFormParams {
  formRef: Readonly<ShallowRef<FormInstance | null>>
  isReadOnly: Ref<boolean>
  formModel: Ref<InvoicesFullFormModel>
}

export function useInvoicesFirstStepForm({ formRef, isReadOnly, formModel }: UseInvoicesFirstStepFormParams) {
  const acceptTermsModel = computed({
    get: () => formModel.value.acceptTerms,
    set: (value: boolean) => {
      if (isReadOnly.value === false) {
        formModel.value.acceptTerms = value
      }
    },
  })

  return {
    formRef,
    acceptTermsModel,
  }
}
