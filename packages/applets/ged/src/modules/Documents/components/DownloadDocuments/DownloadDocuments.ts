import type { ComputedRef } from 'vue'
import { inject, ref } from 'vue'
import { type ToastPluginFunc } from '@ged/modules/common/Types/toastPluginTypes'
import { PICheck, PIExclamationTriangle, PILoader } from '@pulse/styleguide'
import { downloadFile } from '@ged/modules/common/helpers/downloadFilesHelper'
import {
  downloadDocument,
  downloadDocuments,
} from '@ged/services/Documents'
import type { DownloadDocumentsComposableProps } from './DownloadDocumentsTypes'
import { useI18n } from 'vue-i18n'

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

  // Inject the toast plugin

  const toastPlugin = inject('toast') as unknown as ToastPluginFunc

  // Define the composable state

  const inProgressNotification = ref()

  // Define the composable actions

  const handleDownloadDocumentsEvent = async () => {
    if (
      !downloadDocumentsProps.value.selectedDocuments ||
      downloadDocumentsProps.value.selectedDocuments.length === 0
    ) return Promise.resolve()

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
    } catch (err) {
      triggerFailureNotification()
    }
  }

  // Define the helper functions

  const downloadSingleDocument = async (
    downloadDocumentsProps: DownloadDocumentsComposableProps,
  ) => {
    const documentBlob = await downloadDocument(
      downloadDocumentsProps.currentService,
      downloadDocumentsProps.selectedEntity,
      downloadDocumentsProps.selectedDocuments[0].id,
    )
    downloadFile(documentBlob, downloadDocumentsProps.selectedDocuments[0].name)
  }

  const downloadMultipleDocument = async (
    downloadDocumentsProps: DownloadDocumentsComposableProps,
  ) => {
    const documentsArchiveBlob = await downloadDocuments(
      downloadDocumentsProps.currentService,
      downloadDocumentsProps.selectedEntity,
      downloadDocumentsProps.selectedDocuments.map((x) => x.id),
    )

    downloadFile(documentsArchiveBlob, 'archive.zip')
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
    handleDownloadDocumentsEvent,
  }
}
