import { logger } from '@pulse/toolbox'
import type { ComputedRef } from 'vue'
import { ref } from 'vue'
import { PNotification } from '@pulse/styleguide'
import { downloadFile } from '@pulse/common/helpers'
import {
  downloadDocument,
  downloadDocuments,
} from '@ged/services/Documents'
import type { DownloadDocumentsComposableProps } from './DownloadDocumentsTypes'
import { useI18n } from 'vue-i18n'
import { trackDocumentDownload } from '@ged/services/tracking/tracking.service'
// Define the composable function

export function useDownloadDocuments(
  downloadDocumentsProps: ComputedRef<DownloadDocumentsComposableProps>,
): {
  handleDownloadDocumentsEvent: () => Promise<void>
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

  // Define the composable state

  const inProgressNotification = ref()

  // Define the composable actions

  const handleDownloadDocumentsEvent = async () => {
    if (
      !downloadDocumentsProps.value.selectedDocuments ||
      downloadDocumentsProps.value.selectedDocuments.length === 0
    ) {
      return
    }

    triggerInProgressNotification()
    try {
      if (
        downloadDocumentsProps.value.selectedDocuments.length > 1
      ) {
        await downloadMultipleDocument(downloadDocumentsProps.value)
        inProgressNotification.value?.close()
        triggerSuccessNotification()
      } else {
        await downloadSingleDocument(downloadDocumentsProps.value)
        inProgressNotification.value?.close()
        triggerSuccessNotification()
      }
    } catch (error) {
      logger.error(error)
      triggerFailureNotification()
    }
  }

  // Define the helper functions

  const downloadSingleDocument = async (
    downloadDocumentsProps: DownloadDocumentsComposableProps,
  ) => {
    try {
      const documentBlob = await downloadDocument(
        downloadDocumentsProps.currentService,
        downloadDocumentsProps.currentEntity,
        downloadDocumentsProps.selectedDocuments[0].id,
        downloadDocumentsProps.accountId,
      )
      downloadFile(documentBlob, downloadDocumentsProps.selectedDocuments[0].name)
      trackDocumentDownload({ isDownloadSuccessful: true })
    } catch {
      trackDocumentDownload({ isDownloadSuccessful: false })
    }
  }

  const downloadMultipleDocument = async (
    downloadDocumentsProps: DownloadDocumentsComposableProps,
  ) => {
    try {
      const documentsArchiveBlob = await downloadDocuments(
        downloadDocumentsProps.currentService,
        downloadDocumentsProps.currentEntity,
        downloadDocumentsProps.selectedDocuments.map((x) => x.id),
        downloadDocumentsProps.accountId,
      )

      downloadFile(documentsArchiveBlob, 'archive.zip')
      trackDocumentDownload({ isDownloadSuccessful: true })
    } catch {
      trackDocumentDownload({ isDownloadSuccessful: true })
    }
  }

  // Define the notification functions

  const triggerInProgressNotification = () => {
    inProgressNotification.value = PNotification({
      message: t('notifications.inProgress'),
      iconName: 'loaderGradient',
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
    handleDownloadDocumentsEvent,
  }
}
