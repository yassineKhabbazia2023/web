import { Folder } from '@ged/models/Folder'
import { foldersData } from './tree-folders.mocks'
import { Service } from '@ged/models/Service'

export function generateTestFiles(
  numberOfFiles: number,
  state: 'VALID' | 'UNVALID',
): File[] {
  const files: File[] = []
  const conditionedFileSize = state === 'VALID' ? 2 : 0
  const fileName = state === 'VALID' ? 'filename.txt' : 'filename.mykey'
  const type = state === 'VALID' ? 'text/plain' : 'mykeyetc'

  for (let i = 0; i < numberOfFiles; i++) {
    const blob = new Blob(['Hello'], { type: 'text/plain' })
    const fileContent = blob.slice(0, conditionedFileSize)
    const file = new File([fileContent], fileName, {
      type,
    })
    files.push(file)
  }
  return files
}

export const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637 with permission 'CAN_MOVE_INTO_FOLDER'
export const secondValidDestination: Folder = foldersData[0][0].children[0].children[0] // id: 135393649  with permission 'CAN_MOVE_INTO_FOLDER'
export const unValidDestination: Folder = foldersData[0][0] // id: 135393636 without permission 'CAN_MOVE_INTO_FOLDER'
export const folderToMove: Folder = foldersData[0][0].children[0].children[0].children[0] // id : 11111111
export const validFiles: File[] = generateTestFiles(3, 'VALID')

export const currentServiceFolder: Folder[] = foldersData[0]
export const currentService: Service['ServiceId'] = foldersData[0][0].serviceId
export const currentServiceName = 'A service name'

export const currentEntity = 'my-current-entity'
export const entityId = '1234'
export const accountId = 1234
export const accountNumber = 'my-account-id'
