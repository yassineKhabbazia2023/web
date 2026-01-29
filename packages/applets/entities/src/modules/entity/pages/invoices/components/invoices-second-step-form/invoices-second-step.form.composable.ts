import { onMounted, ref } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import type { FormInstance } from 'element-plus'
import type { PDropdownOption } from '@pulse/styleguide/types'
import type { InvoicesSecondStepFormModel } from './invoices-second-step.form.types'
import { InvoicesSecondStepFormManager } from './invoices-second-step.form.manager'

interface UseInvoicesSecondStepFormParams {
  formRef: Readonly<ShallowRef<FormInstance | null>>
  isReadOnly: Ref<boolean>
  accountId: Ref<number | undefined>
}

export function useInvoicesSecondStepForm({
  formRef,
  isReadOnly,
  accountId,
}: UseInvoicesSecondStepFormParams) {
  const formModel = ref<InvoicesSecondStepFormModel>({
    selectedContactId: null,
  })

  const customerOptions = ref<PDropdownOption[]>([])
  const isLoadingCustomers = ref(false)

  const fetchCustomers = async () => {
    if (accountId.value === undefined) {
      return
    }

    isLoadingCustomers.value = true
    const result = await InvoicesSecondStepFormManager.fetchCustomerOptions(accountId.value)
    customerOptions.value = result.options
    isLoadingCustomers.value = false
  }

  onMounted(() => {
    fetchCustomers()
  })

  return {
    formRef,
    formModel,
    customerOptions,
    isLoadingCustomers,
    isReadOnly,
    fetchCustomers,
  }
}
