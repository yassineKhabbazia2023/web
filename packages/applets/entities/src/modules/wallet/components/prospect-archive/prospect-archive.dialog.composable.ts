import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { ProspectArchiveDialogEmit, ProspectArchiveDialogProps } from './prospect-archive.dialog.types'

const I18N_KEY = 'entities.wallet.prospectDelete'

export function useProspectArchiveDialog(
  props: ProspectArchiveDialogProps,
  dialogModel: Ref<boolean>,
  emit: (evt: keyof ProspectArchiveDialogEmit) => void,
) {
  const { t } = useI18n()
  const isArchiving = ref(false)

  const onCancel = () => {
    dialogModel.value = false
  }

  const onConfirm = async () => {
    isArchiving.value = true
    try {
      await ProspectsService.archiveProspect(props.prospect.prospectId)
      displayNotification('success', t(`${I18N_KEY}.success`))
      emit('archived')
      dialogModel.value = false
    } catch (error) {
      logger.error('Error while archiving prospect', error)
      displayNotification('error', t(`${I18N_KEY}.error`))
    } finally {
      isArchiving.value = false
    }
  }

  return {
    isArchiving,
    onCancel,
    onConfirm,
  }
}
