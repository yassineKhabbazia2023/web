import { amplitudeService } from '@pulse/common'
import type {
  TrackDepositedDocumentParams,
  TriggerSource,
  TrackDocumentMoveParams,
  TrackDocumentRenameParams,
  TrackDocumentDeleteParams,
  TrackDocumentDownloadParams,
  TrackDocumentTransmitParams,
} from './tracking.types'
import { DocumentConsultationSource } from './tracking.types'

export function trackDepositedDocument({
  serviceName,
  depositedDocumentsCount,
  successfulDepositsCount,
  failedDepositsCount,
  destinationFolder,
}: TrackDepositedDocumentParams) {
  amplitudeService.track('Deposit Document Completed', {
    // tracker is expecting a lowercased service name
    document_deposit_category: serviceName.toLowerCase(),
    document_deposit_count: depositedDocumentsCount,
    document_deposit_succeeded: successfulDepositsCount,
    document_deposit_failed: failedDepositsCount,
    document_deposit_folder: destinationFolder,
  })
}

export function trackDocumentConsulted() {
  amplitudeService.track('Document Consulted', {
    // Fixed value for now as document history doesn't exist yet
    document_consultation_localisation: DocumentConsultationSource.GED,
  })
}

export function trackDocumentMoveFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Moved Started', {
    document_move_start: triggerSource,
  })
}

export function trackDocumentMove({ isMoveSuccessful }: TrackDocumentMoveParams) {
  amplitudeService.track('Document Moved Completed', {
    document_move_result: isMoveSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentRenameFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Rename Started', {
    document_rename_start: triggerSource,
  })
}

export function trackDocumentRename({ isRenameSuccessful }: TrackDocumentRenameParams) {
  amplitudeService.track('Document Renamed', {
    document_rename: isRenameSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDeleteFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Delete Started', {
    document_delete_start: triggerSource,
  })
}

export function trackDocumentDelete({ isDeleteSuccessful }: TrackDocumentDeleteParams) {
  amplitudeService.track('Document Deleted', {
    document_delete: isDeleteSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDownloadFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Download Started', {
    document_download_start: triggerSource,
  })
}

export function trackDocumentDownload({ isDownloadSuccessful }: TrackDocumentDownloadParams) {
  amplitudeService.track('Document Downloaded', {
    document_download: isDownloadSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentTransmitFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Transmit Started', {
    document_transmit_start: triggerSource,
  })
}

export function trackDocumentTransmit({ isTransmitSuccessful }: TrackDocumentTransmitParams) {
  amplitudeService.track('Document Transmitted', {
    document_transmission: isTransmitSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentSearch(searchValue: string) {
  amplitudeService.track('Document Searched', {
    document_search: searchValue,
  })
}

export function trackBreadcrumbUsage() {
  amplitudeService.track('Breadcrumb clicked', {
    breadcrumb_clicked: '',
  })
}
