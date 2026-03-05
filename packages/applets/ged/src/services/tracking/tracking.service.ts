import { AmplitudeService } from '@pulse/common/services/amplitude'
import type {
  TrackDepositedDocumentParams,
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

export function trackDocumentMove({ isMoveSuccessful }: TrackDocumentMoveParams) {
  AmplitudeService.track('Document Moved Completed', {
    document_move_result: isMoveSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentRename({ isRenameSuccessful }: TrackDocumentRenameParams) {
  AmplitudeService.track('Document Renamed', {
    document_rename: isRenameSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDelete({ isDeleteSuccessful }: TrackDocumentDeleteParams) {
  AmplitudeService.track('Document Deleted', {
    document_delete: isDeleteSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDownload({ isDownloadSuccessful }: TrackDocumentDownloadParams) {
  AmplitudeService.track('Document Downloaded', {
    document_download: isDownloadSuccessful ? 'succeeded' : 'failed',
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
