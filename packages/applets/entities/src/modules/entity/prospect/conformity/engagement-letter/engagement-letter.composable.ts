import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { EngagementLetterEmits } from './engagement-letter.types'

const I18N_KEY = 'entities.prospect.conformity.engagementLetter'

export function useEngagementLetter(emit?: EngagementLetterEmits) {
  const { t } = useI18n()
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const selectedEngagementLetterFile = ref<File | null>(null)
  const isDownloading = ref(false)
  const isSending = ref(false)

  const openEngagementLetterDocument = async (): Promise<void> => {
    if (currentEntityId.value === undefined) {
      return
    }
    isDownloading.value = true
    try {
      const hasOpened = await openDocumentInNewTab(() =>
        ProspectsService.downloadEngagementLetter(currentEntityId.value!),
      )
      if (hasOpened === false) {
        displayNotification('error', t(`${I18N_KEY}.downloadError`))
      }
    } catch (error) {
      logger.error('Error downloading engagement letter document', error)
      displayNotification('error', t(`${I18N_KEY}.downloadError`))
    } finally {
      isDownloading.value = false
    }
  }

  const sendEngagementLetterToCustomer = async (): Promise<void> => {
    if (currentEntityId.value === undefined || selectedEngagementLetterFile.value === null) {
      return
    }
    isSending.value = true
    try {
      await ProspectsService.uploadEngagementLetter(currentEntityId.value!, selectedEngagementLetterFile.value)
      selectedEngagementLetterFile.value = null
      displayNotification('success', t(`${I18N_KEY}.sendSuccess`))
      // Let the parent refresh the stepper and this step status from the backend
      emit?.('sent')
    } catch (error) {
      logger.error('Error sending engagement letter to customer', error)
      displayNotification('error', t(`${I18N_KEY}.sendError`))
    } finally {
      isSending.value = false
    }
  }

  return {
    isDownloading,
    isSending,
    selectedEngagementLetterFile,
    openEngagementLetterDocument,
    sendEngagementLetterToCustomer,
  }
}
