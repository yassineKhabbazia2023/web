
import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { ExtendedFolder } from '../../TreeviewTypes'

export interface TreeNodeProps {
  node: any
  data: ExtendedFolder
  selectedFolder?: Folder
  serviceId?: Service['ServiceId'] | null
  entityId?: string
}
