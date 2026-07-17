import { ref, type Ref, defineComponent } from 'vue'
import type { DocumentsProps } from '@ged/modules/Documents/DocumentsTypes'
import { foldersData } from '@ged/__mocks__/tree-folders.mocks'

import { mount } from '@vue/test-utils'
import { useDragAndDropFromExplorer } from '.'
import { PNotification } from '@pulse/styleguide'
import { armGedServiceDefaults } from '@ged/__mocks__/arm-ged-services.mocks'

let currentServiceName: Ref<DocumentsProps['currentServiceName']>
let currentService: Ref<DocumentsProps['currentService']>
let currentEntity: Ref<DocumentsProps['currentEntity']>
let accountId: Ref<DocumentsProps['accountId']>
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

const spyPNotification = vi.mocked(PNotification)

beforeEach(() => {
  armGedServiceDefaults()
})


// The composable calls useI18n with a local scope, which requires a live
// component instance: run it inside a real setup() instead of relying on a
// leaked current instance from previously mounted wrappers.
// The composable merges its en-US messages into the global i18n created by
// the setup (locale 'en-US'): the assertions match the resolved translations,
// deterministic whatever file ran first in the worker.
function withSetup<T>(runComposable: () => T): T {
  let result: T | undefined
  mount(defineComponent({
    setup() {
      result = runComposable()
      return () => null
    },
  }))
  return result as T
}

describe('drag and drop from explorer composable', () => {
  beforeEach(() => {
    currentService = ref('a really cool service')
    currentServiceName = ref('a service name')
    currentEntity = ref('An Entity')
    accountId = ref(1234)
    selectedFolder = ref(depositFolder)
    refreshDocumentsList = vi.fn()
  })

  it('should initialize with default values', () => {
    const {
      isDropZoneVisible,
      isDropFromExplorerConfirmationModalVisible,
      validDroppedFiles,
    } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

    expect(isDropZoneVisible.value).toBeFalsy()
    expect(isDropFromExplorerConfirmationModalVisible.value).toBeFalsy()
    expect(validDroppedFiles.value).toStrictEqual([])
  })

  it('should handle drag over from explorer', () => {
    const { handleDragOverFromExplorer, isDropZoneVisible } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

    // Drag Event doesn't exist in test environment
    const mockEvent = {
      dataTransfer: {
        dropEffect: '',
        types: ['Files'],
      },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent

    handleDragOverFromExplorer(mockEvent)
    expect(isDropZoneVisible.value).toBeTruthy()
  })

  it('should handle drag leave from explorer', () => {
    const { handleDragLeaveFromExplorer, isDropZoneVisible } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

    isDropZoneVisible.value = true
    handleDragLeaveFromExplorer()
    expect(isDropZoneVisible.value).toBeFalsy()
  })

  it('should handle file drop from explorer', async () => {
    const {
      handleDropFromExplorer,
      validDroppedFiles,
      isDropFromExplorerConfirmationModalVisible,
    } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

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
    const { handleDropFromExplorer, validDroppedFiles } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

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
    const { handleDropFromExplorer } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

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

    expect(spyPNotification).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('has been uploaded to'),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 6000,
    }))
  })

  it('should display connection error notification when upload fails', async () => {
    const { handleDropFromExplorer } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

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

    expect(spyPNotification).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Connection to server lost'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))
  })

  it('should display pre-upload error notifications', async () => {
    const { handleDropFromExplorer } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

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

    expect(spyPNotification).toHaveBeenNthCalledWith(1, expect.objectContaining({
      message: expect.stringContaining('empty document'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))

    expect(spyPNotification).toHaveBeenNthCalledWith(2, expect.objectContaining({
      message: expect.stringContaining('exceeding the maximum allowed size'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))

    expect(spyPNotification).toHaveBeenNthCalledWith(3, expect.objectContaining({
      message: expect.stringContaining('Unrecognized format for'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 6000,
    }))
  })

  it('should not display the drop zone if the data type isn\'t "Files"', () => {
    const { handleDragOverFromExplorer, isDropZoneVisible } = withSetup(() => useDragAndDropFromExplorer(
      currentService,
      currentServiceName,
      currentEntity,
      accountId,
      selectedFolder,
      refreshDocumentsList,
    ))

    const mockFile = new File(['content'], 'example.txt', { type: 'text/plain' })
    const dataTransfer = new MockDataTransfer()
    dataTransfer.items.push(mockFile)
    dataTransfer.types.push('image')

    const event = {
      dataTransfer,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    handleDragOverFromExplorer(event as unknown as DragEvent)

    expect(isDropZoneVisible.value).toBe(false)
  })
})
