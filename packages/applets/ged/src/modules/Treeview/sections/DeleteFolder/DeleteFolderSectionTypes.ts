import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'

export interface DeleteFolderSectionProps {
  serviceId: Service['ServiceId'] | null
  entityId: string
  selectedFolder: Folder
  isDeleteFolderPopupVisible:boolean
}
