import { AmplitudeService } from '@pulse/common/services/amplitude'
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
import { GedContext } from '@pulse/common/enums'

export function trackDepositedDocument({
  serviceName,
  depositedDocumentsCount,
  successfulDepositsCount,
  failedDepositsCount,
  destinationFolder,
}: TrackDepositedDocumentParams) {
  AmplitudeService.track('Deposit Document Completed', {
    // tracker is expecting a lowercased service name
    document_deposit_category: serviceName.toLowerCase(),
    document_deposit_count: depositedDocumentsCount,
    document_deposit_succeeded: successfulDepositsCount,
    document_deposit_failed: failedDepositsCount,
    document_deposit_folder: destinationFolder,
  })
}

export function trackDocumentConsulted(gedContext: GedContext) {
  const DocumentConsultationLocalisation = gedContext === GedContext.ACCOUNTING
    ? DocumentConsultationSource.ARCHIVES
    : DocumentConsultationSource.GED

  AmplitudeService.track('Document Consulted', {
    // Fixed value for now as document history doesn't exist yet
    document_consultation_localisation: DocumentConsultationLocalisation,
  })
}

export function trackDocumentMoveFlowStart(triggerSource: TriggerSource) {
  AmplitudeService.track('Document Moved Started', {
    document_move_start: triggerSource,
  })
}

export function trackDocumentMove({ isMoveSuccessful }: TrackDocumentMoveParams) {
  AmplitudeService.track('Document Moved Completed', {
    document_move_result: isMoveSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentRenameFlowStart(triggerSource: TriggerSource) {
  AmplitudeService.track('Document Rename Started', {
    document_rename_start: triggerSource,
  })
}

export function trackDocumentRename({ isRenameSuccessful }: TrackDocumentRenameParams) {
  AmplitudeService.track('Document Renamed', {
    document_rename: isRenameSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDeleteFlowStart(triggerSource: TriggerSource) {
  AmplitudeService.track('Document Delete Started', {
    document_delete_start: triggerSource,
  })
}

export function trackDocumentDelete({ isDeleteSuccessful }: TrackDocumentDeleteParams) {
  AmplitudeService.track('Document Deleted', {
    document_delete: isDeleteSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDownloadFlowStart(triggerSource: TriggerSource) {
  AmplitudeService.track('Document Download Started', {
    document_download_start: triggerSource,
  })
}

export function trackDocumentDownload({ isDownloadSuccessful }: TrackDocumentDownloadParams) {
  AmplitudeService.track('Document Downloaded', {
    document_download: isDownloadSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentTransmitFlowStart(triggerSource: TriggerSource) {
  AmplitudeService.track('Document Transmit Started', {
    document_transmit_start: triggerSource,
  })
}

export function trackDocumentTransmit({ isTransmitSuccessful }: TrackDocumentTransmitParams) {
  AmplitudeService.track('Document Transmitted', {
    document_transmission: isTransmitSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentSearch(searchValue: string) {
  AmplitudeService.track('Document Searched', {
    document_search: searchValue,
  })
}

export function trackBreadcrumbUsage() {
  AmplitudeService.track('Breadcrumb clicked', {
    breadcrumb_clicked: '',
  })
}
