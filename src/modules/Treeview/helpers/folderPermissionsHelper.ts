import type { Folder } from '@/models/Folder'

export const canCreateFolder = (folder: Folder) => {
  return folder?.permissions?.includes('CAN_CREATE_FOLDER')
}

