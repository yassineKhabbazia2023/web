import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { Entity } from '@pulse/common/types'
import { GedContext } from '@pulse/common/enums'

// FAILED means you can retry due to a connection loss with the backend
// ERROR are returned by the backend and are meant to be placed in the header
export type GivenActionState = 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'FAILED' | 'ERROR'

export type ExplorerDocumentContent = {
  name: string
}

export type ExplorerFolderListLineDisabledStateContext = 'MOVE_FOLDER'

export interface ExplorerFoldersListLineDisabledState {
  data: any
  context: ExplorerFolderListLineDisabledStateContext
}

export interface ExplorerDocument {
  givenActionState: GivenActionState
  isSelected: boolean
  content: ExplorerDocumentContent
  codeError: string
}

export interface DocumentsProps {
  currentService: Service['ServiceId']
  currentServiceName: Service['ServiceName']
  isCurrentServiceReadOnly: Service['IsReadOnly']
  // selected entity corresponds to accountNumber, this will be changed
  currentEntity: string
  accountId: number
  currentEntityAvatarColor: Entity['color']
  currentEntityName: Entity['legalName']
  selectedFolder: null | Folder
  currentServiceFolder: Folder[]
  gedContext: GedContext
}

export type DocumentAction =
'move-folder' |
'toolbox-download-action-click' |
'toolbox-rename-action-click' |
'toolbox-create-action-click' |
'toolbox-delete-action-click' |
'download-document' |
'rename-document' |
'delete-document' |
'move-document' |
'transmit-document' |
'go-to-document'
