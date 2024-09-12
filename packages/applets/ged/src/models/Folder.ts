interface FolderParent {
  id: number
}

export interface FolderProperties {
  syncStatus: string
  folderDescription?: string
  tracingName?: string
}

export interface Folder {
  id: number
  children: Folder[]
  name: string
  parent: FolderParent
  permissions: string[]
  properties: FolderProperties
  serviceId: string
  iconName?: string | undefined
}

