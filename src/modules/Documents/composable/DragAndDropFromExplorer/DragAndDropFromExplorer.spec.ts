import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, type Ref } from 'vue'
import { useDragAndDropFromExplorer } from '.'
import { PNotification, PIExclamationTriangle, PICheck } from '@kpmg/styleguide'
import type { DocumentsProps } from '@/modules/Documents/DocumentsTypes'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'

let currentService: Ref<DocumentsProps['currentService']>
let selectedEntity: Ref<DocumentsProps['selectedEntity']>
let selectedFolder: Ref<DocumentsProps['selectedFolder']>
let refreshDocumentsList: () => void

// This folder has the upload permission
const depositFolder = foldersData[0][0].children[0]
// This folder doesn't have appropriate upload permission
const rootFolder = foldersData[0][0]

// Mock DataTransfer as DataTransfer isn't natively available in test libraries
class MockDataTransfer {
  items: any[] = []

  dropEffect: string = 'none'
  effectAllowed: string = 'none'
  files: File[] = []
  types: string[] = []
  data: { [key: string]: string } = {}

  constructor() {
    this.items = []
  }

  clearData(format?: string) {
    if (format) {
      delete this.data[format]
    } else {
      this.data = {}
    }
  }

  getData(format: string) {
    return this.data[format] || ''
  }

  setData(format: string, data: string) {
    this.data[format] = data
  }

  setDragImage(_image: Element, _x: number, _y: number) {
    // This is a mock, so no implementation is needed
  }
}

vi.mock('@/services/Documents', () => ({
  uploadDocument: vi.fn((_service, _entity, file, _folderId) => {
    if (file.name === 'fail.txt') {
      return Promise.reject(new Error('Upload failed'))
    }
    return Promise.resolve('Upload succeeded')
  }),
}))

// Mock `PNotification`
vi.mock('@kpmg/styleguide', () => ({
  PNotification: vi.fn(),
  PIExclamationTriangle: vi.fn(),
  PICheck: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, ..._args: any[]) => key,
  }),
}))

describe('drag and drop from explorer composable', () => {
  beforeEach(() => {
    currentService = ref('a really cool service')
    selectedEntity = ref('An Entity')
    selectedFolder = ref(depositFolder)
    refreshDocumentsList = vi.fn()
  })

  it('should initialize with default values', () => {
    const {
      isDropZoneVisible,
      isDropFromExplorerConfirmationModalVisible,
      validDroppedFiles,
    } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    expect(isDropZoneVisible.value).toBeFalsy()
    expect(isDropFromExplorerConfirmationModalVisible.value).toBeFalsy()
    expect(validDroppedFiles.value).toStrictEqual([])
  })

  it('should handle drag over from explorer', () => {
    const { handleDragOverFromExplorer, isDropZoneVisible } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    // Drag Event doesn't exist in test environement
    const mockEvent = {
      dataTransfer: {
        dropEffect: '',
      },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent
    handleDragOverFromExplorer(mockEvent)
    expect(isDropZoneVisible.value).toBeTruthy()
  })

  it('should handle drag leave from explorer', () => {
    const { handleDragLeaveFromExplorer, isDropZoneVisible } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    isDropZoneVisible.value = true
    handleDragLeaveFromExplorer()
    expect(isDropZoneVisible.value).toBeFalsy()
  })

  it('should handle file drop from explorer', async () => {
    const {
      handleDropFromExplorer,
      validDroppedFiles,
      isDropFromExplorerConfirmationModalVisible,
    } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    const mockFile = new File(['content'], 'example.txt', { type: 'text/plain' })
    const dataTransfer = new MockDataTransfer()
    dataTransfer.items.push(mockFile)

    const event = {
      dataTransfer,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    await handleDropFromExplorer(event as unknown as DragEvent)

    expect(validDroppedFiles.value).toEqual([])
    expect(isDropFromExplorerConfirmationModalVisible.value).toBeFalsy()
  })

  it('should not handle file drop if folder does not allow upload', async () => {
    selectedFolder.value = rootFolder // Folder without upload permission
    const { handleDropFromExplorer, validDroppedFiles } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    const mockFile = new File(['content'], 'example.txt', { type: 'text/plain' })
    const dataTransfer = new MockDataTransfer()
    dataTransfer.items.push(mockFile)

    const event = {
      dataTransfer,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    await handleDropFromExplorer(event as unknown as DragEvent)

    expect(validDroppedFiles.value).toEqual([])
    expect(refreshDocumentsList).not.toHaveBeenCalled()
  })

  it('should display success notification when documents are uploaded successfully', async () => {
    const { handleDropFromExplorer } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    const mockFile = new File(['content'], 'example.txt', { type: 'text/plain' })
    const dataTransfer = new MockDataTransfer()
    dataTransfer.items.push(mockFile)
    dataTransfer.files.push(mockFile)

    const event = {
      dataTransfer,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    await handleDropFromExplorer(event as unknown as DragEvent)

    expect(PNotification).toHaveBeenCalledWith(expect.objectContaining({
      message: 'documentsUploaded',
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 6000,
    }))
  })

  it('should display connection error notification when upload fails', async () => {
    const { handleDropFromExplorer } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    const mockFile = new File(['content'], 'fail.txt', { type: 'text/plain' })
    const dataTransfer = new MockDataTransfer()
    dataTransfer.items.push(mockFile)
    dataTransfer.files.push(mockFile)

    const event = {
      dataTransfer,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    await handleDropFromExplorer(event as unknown as DragEvent)

    expect(PNotification).toHaveBeenCalledWith(expect.objectContaining({
      message: 'connectionLost',
      icon: PIExclamationTriangle,
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))
  })

  it('should display pre-upload error notifications', async () => {
    const { handleDropFromExplorer } = useDragAndDropFromExplorer(
      currentService,
      selectedEntity,
      selectedFolder,
      refreshDocumentsList,
    )

    const emptyFile = new File([], 'empty.txt', { type: 'text/plain' })
    const largeFile = new File(['content'], 'large.txt', { type: 'text/plain' })
    // Mock the size property to simulate a large file
    Object.defineProperty(largeFile, 'size', { value: 50 * 1000000 + 1 })
    const unsupportedFile = new File(['content'], 'unsupported.xyz', { type: 'text/plain' })

    const dataTransfer = new MockDataTransfer()
    dataTransfer.items.push(emptyFile, largeFile, unsupportedFile)
    dataTransfer.files.push(emptyFile, largeFile, unsupportedFile)

    const event = {
      dataTransfer,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    await handleDropFromExplorer(event as unknown as DragEvent)

    expect(PNotification).toHaveBeenNthCalledWith(1, expect.objectContaining({
      message: 'emptyDocuments',
      icon: PIExclamationTriangle,
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))

    expect(PNotification).toHaveBeenNthCalledWith(2, expect.objectContaining({
      message: 'limitExceededDocuments',
      icon: PIExclamationTriangle,
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))

    expect(PNotification).toHaveBeenNthCalledWith(3, expect.objectContaining({
      message: 'unknowExtensions',
      icon: PIExclamationTriangle,
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))
  })
})
