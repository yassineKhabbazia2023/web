import type { Service } from '@ged/models/Service'
import type { Folder } from '@ged/models/Folder'

export interface TrackDepositedDocumentParams {
  serviceName: Service['ServiceName']
  depositedDocumentsCount: number
  successfulDepositsCount: number
  failedDepositsCount: number,
  destinationFolder: Folder['name']
}

export interface TrackDocumentMoveParams {
  isMoveSuccessful: boolean
}

export interface TrackDocumentRenameParams {
  isRenameSuccessful: boolean
}
export interface TrackDocumentDeleteParams {
  isDeleteSuccessful: boolean
}

export interface TrackDocumentDownloadParams {
  isDownloadSuccessful: boolean
}

export interface TrackDocumentTransmitParams {
  isTransmitSuccessful: boolean
}

export enum DocumentConsultationSource {
  ARCHIVES = 'archives',
  DEPOSIT_HISTORY = 'historique de dépôts',
  GED = 'ged',
}
