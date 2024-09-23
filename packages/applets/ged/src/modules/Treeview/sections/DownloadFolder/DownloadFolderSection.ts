import type { ComputedRef } from 'vue'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DownloadFolderComposableProps } from './DownloadFolderTypes'
import { type ToastPluginFunc } from
  '@ged/modules/common/Types/toastPluginTypes'
import { PICheck, PIExclamationTriangle, PILoader } from '@kpmg/styleguide'
import { formatDate } from '@ged/modules/common/helpers/dateFormatHelper'
import { downloadFolder } from '@ged/services/Folder'
import { downloadFile } from '@ged/modules/common/helpers/downloadFilesHelper'

export function useDownloadFolder(
  downloadFolderProps: ComputedRef<DownloadFolderComposableProps>,
): {
  handleDownloadFolderEvent: () => Promise<void>
} {
  const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global',
    messages: {
      'en-US': {
        notifications: {
          error: 'Connection to server interrupted.',
          inProgress: 'Preparing the download in progress.',
          success: 'Download preparation finished.',
        },
      },
      'fr-FR': {
        notifications: {
          error: 'Connexion au serveur interrompue.',
          inProgress: 'Préparation du téléchargement en cours.',
          success: 'Préparation du téléchargement finie.',
        },
      },
    },
  })

  // Forcing the cast as we know it exsits from Styleguide
  // This should be updated to a PNotification import
  const toastPlugin = inject('toast') as ToastPluginFunc

  const inProgressNotification = ref()

  const handleDownloadFolderEvent = async () => {
    if (!downloadFolderProps.value.selectedFolderId) return Promise.resolve()

    triggerInProgressNotification()
    try {
      await triggerFolderDownload(downloadFolderProps.value)
      inProgressNotification.value?.close()
      triggerSuccessNotification()
    } catch (err) {
      inProgressNotification.value?.close()
      triggerFailureNotification()
    }
  }

  const triggerFolderDownload = async (
    downloadFolderProps: DownloadFolderComposableProps,
  ) => {
    const folderBlob = await downloadFolder(
      downloadFolderProps.currentService,
      downloadFolderProps.selectedEntity,
      downloadFolderProps.selectedFolderId,
    )
    const fileName =
    `${downloadFolderProps.selectedFolderName}_${formatDate(new Date(), '_')}.zip`
    downloadFile(folderBlob, fileName.replaceAll(' ', '_'))
  }

  // Define the notification functions

  const triggerInProgressNotification = () => {
    inProgressNotification.value = toastPlugin({
      message: t('notifications.inProgress'),
      icon: PILoader,
      showClose: true,
      customClass: 'loading',
      position: 'bottom-right',
    })
  }

  const triggerSuccessNotification = () => {
    toastPlugin({
      message: t('notifications.success'),
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  }

  const triggerFailureNotification = () => {
    toastPlugin({
      message: t('notifications.error'),
      icon: PIExclamationTriangle,
      customClass: 'error',
      showClose: true,
      position: 'bottom-right',
    })
  }

  // Return the composable object

  return {
    handleDownloadFolderEvent,
  }
}
