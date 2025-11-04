import { logger } from '@pulse/toolbox'
import type { ComputedRef } from 'vue'
import {
  transmitDocuments,
} from '@ged/services/Documents'
import type { TransmitDocumentsComposableProps } from './TransmitDocumentsTypes'
import { trackDocumentTransmit } from '@ged/services/tracking/tracking.service'

export function useTransmitDocuments(
  transmitDocumentsProps: ComputedRef<TransmitDocumentsComposableProps>,
): {
    handleTransmitDocumentsEvent: () => Promise<void>
  } {
  // Define the composable actions

  const handleTransmitDocumentsEvent = async () => {
    if (
      !transmitDocumentsProps.value.selectedDocumentsIds ||
      transmitDocumentsProps.value.selectedDocumentsIds.length === 0
    ) {
      return
    }
    try {
      await transmitDocuments(
        transmitDocumentsProps.value.currentService,
        transmitDocumentsProps.value.currentEntity,
        transmitDocumentsProps.value.selectedDocumentsIds,
        transmitDocumentsProps.value.accountId,
      )
      trackDocumentTransmit({ isTransmitSuccessful: true })
    } catch (error) {
      logger.error(error)
      trackDocumentTransmit({ isTransmitSuccessful: false })
    }
  }

  return {
    handleTransmitDocumentsEvent,
  }
}
