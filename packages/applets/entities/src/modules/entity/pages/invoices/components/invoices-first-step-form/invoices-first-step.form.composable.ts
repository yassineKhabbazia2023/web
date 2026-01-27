import { computed, ref } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import type { FormInstance } from 'element-plus'
import type { InvoicesFormModel } from '@entities/modules/entity/types'

interface UseInvoicesFirstStepFormParams {
  formRef: Readonly<ShallowRef<FormInstance | null>>
  isReadOnly: Ref<boolean>
}

export function useInvoicesFirstStepForm({ formRef, isReadOnly }: UseInvoicesFirstStepFormParams) {
  const formModel = ref<InvoicesFormModel>({
    email: '',
    acceptTerms: false,
  })

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
    formModel,
    acceptTermsModel,
  }
}
