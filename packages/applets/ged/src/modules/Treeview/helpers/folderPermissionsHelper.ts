import type { Folder } from '@ged/models/Folder'

export const canCreateFolder = (folder: Folder) => {
  return folder?.permissions?.includes('CAN_CREATE_FOLDER')
}

