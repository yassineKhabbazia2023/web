import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { DeleteDocumentDialogProps } from './delete-document-dialog.types'

const I18N_KEY = 'entities.prospect.deleteDocumentDialog'

export function useDeleteDocumentDialog(
  props: DeleteDocumentDialogProps,
  dialogModel: Ref<boolean>,
  emit: (evt: 'deleted') => void,
) {
  const { t } = useI18n()
  const isDeleting = ref(false)

  const onCancel = () => {
    dialogModel.value = false
  }

  const onConfirm = async () => {
    if (props.pDocumentId === undefined) {
      return
    }
    isDeleting.value = true
    try {
      await ProspectsService.deleteProspectDocument(props.pProspectId, props.pDocumentId)
      displayNotification('success', t(`${I18N_KEY}.success`))
      emit('deleted')
      dialogModel.value = false
    } catch (error) {
      logger.error('Error while deleting document', error)
      displayNotification('error', t(`${I18N_KEY}.error`))
    } finally {
      isDeleting.value = false
    }
  }

  return {
    isDeleting,
    onCancel,
    onConfirm,
  }
}
