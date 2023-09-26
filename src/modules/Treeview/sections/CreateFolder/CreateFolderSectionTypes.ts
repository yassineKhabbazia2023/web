/* eslint-disable max-len */
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'

export interface CreateFolderSectionProps {
  serviceId: Service['ServiceId'] | null
  entityId: string
  selectedFolder: Folder
  isCreateFolderModalVisible: boolean
}
