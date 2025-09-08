import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'

export interface DeleteFolderSectionProps {
  serviceId: Service['ServiceId'] | null
  entityId: string
  accountId: number
  selectedFolder: Folder
  isDeleteFolderPopupVisible: boolean
}
