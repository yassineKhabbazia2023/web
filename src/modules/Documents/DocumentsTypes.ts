/* eslint-disable max-len */
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'

export interface DocumentsProps {
  currentService: Service['ServiceId']
  selectedEntity: string
  selectedFolder: null | Folder
}
