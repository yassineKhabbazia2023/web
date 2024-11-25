 
import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'

export interface CreateFolderSectionProps {
  serviceId: Service['ServiceId'] | null
  entityId: string
  selectedFolder: Folder
  isCreateFolderModalVisible: boolean
  isCreateFolderModalCentered?: boolean
  hasCreateFolderButton: boolean
  isInBinContext?: boolean
}
