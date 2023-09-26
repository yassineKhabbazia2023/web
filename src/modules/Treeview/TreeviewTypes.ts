/* eslint-disable max-len */
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'

export interface TreeviewProps {
  entityServices: Service[]
  isLoading: boolean,
  servicesFolders: Folder[][],
  currentService: string
  selectedEntity: string
  selectedFolder: null | Folder
}

// To update with real type when it will be availaible from the Stylguide
export type TreeType = InstanceType<any>

export const services = ['1', '2', '3']
