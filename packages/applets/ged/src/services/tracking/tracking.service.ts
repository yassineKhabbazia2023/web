import { amplitudeService } from '@pulse/common'
import type {
  TrackDepositedDocumentParams,
  TriggerSource,
  trackDocumentMoveParams,
  trackDocumentRenameParams,
  trackDocumentDeleteParams,
  trackDocumentDownloadParams,
  trackDocumentTransmitParams,
} from './tracking.types'

export function trackDepositedDocument({
  serviceName,
  depositedDocumentsCount,
  successfulDepositsCount,
  failedDepositsCount,
  destinationFolder,
}: TrackDepositedDocumentParams) {
  amplitudeService.track('Deposit Document Completed', {
    document_deposit_category: serviceName,
    document_deposit_count: depositedDocumentsCount,
    document_deposit_succedded: successfulDepositsCount,
    document_deposit_failed: failedDepositsCount,
    document_deposit_folder: destinationFolder,
  })
}


export function trackDocumentMoveFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Moved Started', {
    document_move_start: triggerSource,
  })
}

export function trackDocumentMove({ isMoveSuccessful }: trackDocumentMoveParams) {
  amplitudeService.track('Document Moved Completed', {
    document_move_result: isMoveSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentRenameFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Rename Started', {
    document_rename_start: triggerSource,
  })
}

export function trackDocumentRename({ isRenameSuccessful }: trackDocumentRenameParams) {
  amplitudeService.track('Document Rename', {
    document_rename: isRenameSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDeleteFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Delete Started', {
    document_delete_start: triggerSource,
  })
}

export function trackDocumentDelete({ isDeleteSuccessful }: trackDocumentDeleteParams) {
  amplitudeService.track('Document Delete', {
    document_delete: isDeleteSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentDownloadFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Download Started', {
    document_download_start: triggerSource,
  })
}

export function trackDocumentDownload({ isDownloadSuccessful }: trackDocumentDownloadParams) {
  amplitudeService.track('Document Download', {
    document_download: isDownloadSuccessful ? 'succeeded' : 'failed',
  })
}

export function trackDocumentTransmitFlowStart(triggerSource: TriggerSource) {
  amplitudeService.track('Document Transmit Started', {
    document_transmit_start: triggerSource,
  })
}

export function trackDocumentTransmit({ isTransmitSuccessful }: trackDocumentTransmitParams) {
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
