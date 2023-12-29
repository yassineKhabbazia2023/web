/* eslint-disable max-len */
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'

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
  selectedEntity: string
  selectedFolder: null | Folder
  currentServiceFolder: Folder[]
}
