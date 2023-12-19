import { ComputedRef } from 'vue'
import {
  transmitDocuments
} from '@/services/Documents'
import { TransmitDocumentsComposableProps } from './TransmitDocumentsTypes'

// Define the composable function

export function useTransmitDocuments(
  transmitDocumentsProps: ComputedRef<TransmitDocumentsComposableProps>
): {
  handleTransmitDocumentsEvent: () => void
} {
  // Define the composable actions

  const handleTransmitDocumentsEvent = async () => {
    if (
      !transmitDocumentsProps.value.selectedDocumentsIds ||
      transmitDocumentsProps.value.selectedDocumentsIds.length === 0
    ) return

    try {
      await transmitDocuments(
        transmitDocumentsProps.value.currentService,
        transmitDocumentsProps.value.selectedEntity,
        transmitDocumentsProps.value.selectedDocumentsIds
      )
    } catch (err) { console.error(err) }
  }

  return {
    handleTransmitDocumentsEvent
  }
}
