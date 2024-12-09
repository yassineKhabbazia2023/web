
import type { Service } from '@ged/models/Service'
import type { Folder } from '@ged/models/Folder'

export interface TrackDepositedDocumentParams {
  serviceName: Service['ServiceName']
  depositedDocumentsCount: number
  successfulDepositsCount: number
  failedDepositsCount : number,
  destinationFolder: Folder['name']
}

export interface trackDocumentMoveParams {
  isMoveSuccessful: boolean
}

export interface trackDocumentRenameParams {
  isRenameSuccessful: boolean
}
export interface trackDocumentDeleteParams {
  isDeleteSuccessful: boolean
}

export interface trackDocumentDownloadParams {
  isDownloadSuccessful: boolean
}

export interface trackDocumentTransmitParams {
  isTransmitSuccessful: boolean
}

export enum TriggerSource {
  ACTION_BAR = 'Action bar',
  CONTEXT_MENU = 'Context menu',
  DRAG_AND_DROP = 'Drag Drop'
}
