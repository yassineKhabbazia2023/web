import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import {
  ENGAGEMENT_LETTER_ACCEPTED_MIME_TYPE,
  ENGAGEMENT_LETTER_MAX_FILE_SIZE_BYTES,
} from './engagement-letter.consts'
import type { EngagementLetterEmits } from './engagement-letter.types'

const I18N_KEY = 'entities.prospect.conformity.engagementLetter'

export function useEngagementLetter(emit?: EngagementLetterEmits) {
  const { t } = useI18n()
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  const selectedEngagementLetterFile = ref<File | null>(null)
  const isDownloading = ref(false)
  const isSending = ref(false)

  const hasSelectedFile = computed(() => selectedEngagementLetterFile.value !== null)

  const openEngagementLetterDocument = async (): Promise<void> => {
    const prospectId = currentEntity.value?.prospectId
    if (isNullOrEmpty(prospectId)) {
      return
    }
    isDownloading.value = true
    try {
      const hasOpened = await openDocumentInNewTab(() =>
        ProspectsService.downloadEngagementLetter(prospectId),
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

  const onFilesSelected = (selectedFiles: File[]): void => {
    selectedEngagementLetterFile.value = selectedFiles.find((file) =>
      file.type === ENGAGEMENT_LETTER_ACCEPTED_MIME_TYPE
      && file.size <= ENGAGEMENT_LETTER_MAX_FILE_SIZE_BYTES,
    ) ?? null
  }

  const onFileDeleted = (): void => {
    selectedEngagementLetterFile.value = null
  }

  const sendEngagementLetterToCustomer = async (): Promise<void> => {
    const prospectId = currentEntity.value?.prospectId
    if (isNullOrEmpty(prospectId) || selectedEngagementLetterFile.value === null) {
      return
    }
    isSending.value = true
    try {
      await ProspectsService.uploadEngagementLetter(prospectId, selectedEngagementLetterFile.value)
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
    hasSelectedFile,
    openEngagementLetterDocument,
    onFilesSelected,
    onFileDeleted,
    sendEngagementLetterToCustomer,
  }
}
