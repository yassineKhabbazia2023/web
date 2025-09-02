import type { ComputedRef } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/core'
import type { DownloadFolderComposableProps } from './DownloadFolderTypes'
import { PNotification } from '@pulse/styleguide'
import { formatDate } from '@ged/modules/common/helpers/dateFormatHelper'
import { downloadFolder } from '@ged/services/Folder'
import { downloadFile } from '@pulse/common/helpers'

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

  const inProgressNotification = ref()

  const handleDownloadFolderEvent = async () => {
    if (!downloadFolderProps.value.selectedFolderId) {
      return Promise.resolve()
    }

    triggerInProgressNotification()
    try {
      await triggerFolderDownload(downloadFolderProps.value)
      inProgressNotification.value?.close()
      triggerSuccessNotification()
    } catch (error) {
      logger.error(error)
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
      downloadFolderProps.accountId,
    )
    const fileName =
    `${downloadFolderProps.selectedFolderName}_${formatDate(new Date(), '_')}.zip`
    downloadFile(folderBlob, fileName.replaceAll(' ', '_'))
  }

  // Define the notification functions

  const triggerInProgressNotification = () => {
    inProgressNotification.value = PNotification({
      message: t('notifications.inProgress'),
      iconName: 'loader',
      showClose: true,
      customClass: 'loading',
      position: 'bottom-right',
    })
  }

  const triggerSuccessNotification = () => {
    PNotification({
      message: t('notifications.success'),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  }

  const triggerFailureNotification = () => {
    PNotification({
      message: t('notifications.error'),
      iconName: 'exclamationTriangle',
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
