import { computed, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrentEntityStore, useDematMailStore, useUserStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import type { FormInstance } from '@pulse/styleguide/types'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { formatFrenchPhoneNumber } from '@pulse/toolbox/utils/string'
import type { DematMailFormModel } from './demat-mail-dialog.types'

// Same HubSpot assistance form as the Ventya invoices experience: the US requires
// it to stay strictly unchanged. Kept local to this composable, its only consumer.
const DEMAT_ASSISTANCE_FORM_URL = 'https://2dpyhn.share-eu1.hsforms.com/2-bh4OP7VSJSgBFWMFlGjxw'

enum DematAssistanceFormParam {
  FIRSTNAME = 'firstname',
  LASTNAME = '0-1/lastname',
  EMAIL = '0-1/email',
  PHONE = '0-1/phone',
  COMPANY = '0-1/company',
  CUSTOMER_CODE = '0-1/code_client',
}

export function useDematMailDialog(formRef: Ref<FormInstance | null>) {
  const { t } = useI18n()
  const dematMailStore = useDematMailStore()
  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()

  const formModel = reactive<DematMailFormModel>({ email: '' })
  const isAssistanceOpen = ref(false)

  const isDialogOpen = computed({
    get: () => dematMailStore.isDialogOpen,
    set: (value: boolean) => {
      if (value === false) {
        handleClose()
      }
    },
  })

  const assistanceIframeUrl = computed(() => {
    const user = userStore.getUser()

    const params = new URLSearchParams({
      [DematAssistanceFormParam.FIRSTNAME]: user?.firstName ?? '',
      [DematAssistanceFormParam.LASTNAME]: user?.lastName ?? '',
      [DematAssistanceFormParam.EMAIL]: user?.email ?? '',
      [DematAssistanceFormParam.PHONE]: formatFrenchPhoneNumber(user?.officeMobile),
      [DematAssistanceFormParam.COMPANY]: currentEntityStore.currentEntity?.legalName ?? '',
      [DematAssistanceFormParam.CUSTOMER_CODE]: currentEntityStore.currentEntityAccountNumber,
    })

    return sanitizeUrl(`${DEMAT_ASSISTANCE_FORM_URL}?${params.toString()}`)
  })

  // The confirm button stays enabled: it is what triggers the validation.
  async function handleConfirm(): Promise<void> {
    if (formRef.value === null) {
      return
    }

    try {
      await formRef.value.validate()
    } catch {
      return
    }

    const isSubmitted = await dematMailStore.submit(formModel.email)

    if (isSubmitted === false) {
      return
    }

    // The mail only reaches the account through Akuiteo later on: without this
    // notification the dialog would simply vanish, with no trace of the request.
    formModel.email = ''
    displayNotification('success', t('entities.dematMail.dialog.submitSuccess'))
  }

  function handleClose(): void {
    formModel.email = ''
    dematMailStore.closeDialog()
  }

  function handleOpenAssistance(): void {
    isAssistanceOpen.value = true
  }

  return {
    formModel,
    isDialogOpen,
    isAssistanceOpen,
    assistanceIframeUrl,
    handleConfirm,
    handleClose,
    handleOpenAssistance,
  }
}
