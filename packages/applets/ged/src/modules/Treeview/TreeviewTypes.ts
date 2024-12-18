
import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'

export interface ExtendedFolder extends Folder {
  isRootFolder?: boolean
}

export interface TreeviewProps {
  entityServices: Service[]
  isLoading: boolean
  servicesFolders: ExtendedFolder[][]
  currentService: string
  currentServiceName: Service['ServiceName'] | null
  selectedEntity: string
  selectedFolder: null | Folder
  currentServiceFolder: Folder[] | undefined
  isInBinContext?: boolean
}

// To update with real type when it will be availaible from the Stylguide
export type TreeType = InstanceType<any>

export const services = ['1', '2', '3']
