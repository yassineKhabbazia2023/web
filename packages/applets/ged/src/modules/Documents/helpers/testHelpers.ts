import type { VueWrapper } from '@vue/test-utils'
import { foldersData } from '@ged/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@ged/models/Folder'
import type { Service } from '@ged/models/Service'
import type { GivenActionAuthorization }
  from '@ged/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'
import type { ExplorerUploadDocument, DocumentUploadProps } from '../components/DocumentsUpload/DocumentsUploadTypes'

const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const validFiles: File[] = generateTestFiles(3, 'VALID')

const currentServiceFolder: Folder[] = foldersData[0]
const currentServiceName = 'A service name'
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'
const accountId = 1234

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

export const defaultProps: DocumentUploadProps = {
  folder: validDestination,
  isUploadModalOpened: false,
  currentServiceFolder,
  currentServiceName,
  currentService: curentService,
  selectedEntity,
  files: validFiles,
  accountId,
}

export type DocumentUploadSetup = {
    isDocumentExplorerModalOpened: boolean
    explorerDocuments: ExplorerUploadDocument[]
    numberOfSelectedDocuments: number
    isUploadAuthorized: GivenActionAuthorization
    modalActionsbuttons: ButtonAction[]
    currentExplorerFolder: Folder
  }

export function findComponentByNameInWrapper(wrapper: VueWrapper, componentName: string) {
  return wrapper.findComponent({ name: componentName })
}
