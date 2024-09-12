/* eslint-disable max-len */
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { ExtendedFolder } from '../../TreeviewTypes'

export interface TreeNodeProps {
  node: any
  data: ExtendedFolder
  selectedFolder?: Folder
  serviceId?: Service['ServiceId'] | null
  entityId?: string
}
