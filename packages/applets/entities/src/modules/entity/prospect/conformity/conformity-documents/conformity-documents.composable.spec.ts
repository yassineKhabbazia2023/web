import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { ConformityDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import {
  getConformityDocumentsResponseMock,
  getRequiredDocumentMock,
} from '@entities/__mocks__'
import { useConformityDocuments } from './conformity-documents.composable'

vi.mock('@entities/services/conformity-documents')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const getConformityDocumentsMock = vi.mocked(ConformityDocumentsService.getConformityDocuments)
const uploadConformityDocumentMock = vi.mocked(ConformityDocumentsService.uploadConformityDocument)
const markCompletedMock = vi.mocked(ConformityDocumentsService.markConformityDocumentsAsCompleted)
const displayNotificationMock = vi.mocked(displayNotification)

const optionsMock = {
  saveSuccessMessage: 'saveSuccess',
  saveErrorMessage: 'saveError',
  markCompletedErrorMessage: 'markCompletedError',
}

const accountIdMock = 602
const fileMock = new File(['content'], 'kbis.pdf', { type: 'application/pdf' })

describe('conformity-documents.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentEntityStoreMock.currentEntityId = accountIdMock
    getConformityDocumentsMock.mockResolvedValue(getConformityDocumentsResponseMock())
  })

  describe('initial loading on mount', () => {
    it('should fetch the documents and expose the response state', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(getConformityDocumentsMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.requiredDocuments.value).toHaveLength(2)
      expect(result.isComplete.value).toBe(false)
      expect(result.status.value).toBe('InProgress')
      expect(result.isLoading.value).toBe(false)
    })

    it('should not fetch the documents when there is no current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      expect(getConformityDocumentsMock).not.toHaveBeenCalled()
      expect(result.isLoading.value).toBe(false)
    })

    it('should handle fetch errors gracefully', async () => {
      getConformityDocumentsMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      expect(result.requiredDocuments.value).toEqual([])
      expect(result.isLoading.value).toBe(false)
    })
  })

  describe('file selection', () => {
    it('should store the first selected File for the given document type', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onFileSelected(ConformityDocumentType.KBIS, [fileMock])

      expect(result.selectedFileByType.value[ConformityDocumentType.KBIS]).toBe(fileMock)
      expect(result.hasPendingUploads.value).toBe(true)
    })

    it('should ignore entries that are not File instances', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onFileSelected(ConformityDocumentType.KBIS, [undefined as unknown as File])

      expect(result.selectedFileByType.value[ConformityDocumentType.KBIS]).toBeUndefined()
      expect(result.hasPendingUploads.value).toBe(false)
    })

    it('should clear the selected file for the given document type', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onFileSelected(ConformityDocumentType.KBIS, [fileMock])
      result.onRemoveSelectedFile(ConformityDocumentType.KBIS)

      expect(result.selectedFileByType.value[ConformityDocumentType.KBIS]).toBeUndefined()
    })
  })

  describe('onSave', () => {
    it('should upload every selected file, notify success and reload the list', async () => {
      const otherFile = new File(['content'], 'declaration.pdf', { type: 'application/pdf' })
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onFileSelected(ConformityDocumentType.KBIS, [fileMock])
      result.onFileSelected(ConformityDocumentType.DECLARATION_BENEFICIAIRES_EFFECTIFS, [otherFile])

      await result.onSave()

      expect(uploadConformityDocumentMock).toHaveBeenCalledWith(accountIdMock, ConformityDocumentType.KBIS, fileMock)
      expect(uploadConformityDocumentMock).toHaveBeenCalledWith(accountIdMock, ConformityDocumentType.DECLARATION_BENEFICIAIRES_EFFECTIFS, otherFile)
      expect(displayNotificationMock).toHaveBeenCalledWith('success', optionsMock.saveSuccessMessage)
      expect(getConformityDocumentsMock).toHaveBeenCalledTimes(2)
      expect(result.isSaving.value).toBe(false)
    })

    it('should not upload anything when no file is selected', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      await result.onSave()

      expect(uploadConformityDocumentMock).not.toHaveBeenCalled()
    })

    it('should display an error notification when an upload fails', async () => {
      uploadConformityDocumentMock.mockRejectedValue(new Error('Upload Error'))

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onFileSelected(ConformityDocumentType.KBIS, [fileMock])

      await result.onSave()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.saveErrorMessage)
      // Always re-syncs on failure too (mount + post-save reload), so persisted uploads still surface.
      expect(getConformityDocumentsMock).toHaveBeenCalledTimes(2)
      expect(result.isSaving.value).toBe(false)
    })

    it('should report success only when every upload succeeds', async () => {
      uploadConformityDocumentMock.mockResolvedValueOnce(undefined)
      uploadConformityDocumentMock.mockRejectedValueOnce(new Error('second failed'))
      const otherFile = new File(['content'], 'declaration.pdf', { type: 'application/pdf' })

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onFileSelected(ConformityDocumentType.KBIS, [fileMock])
      result.onFileSelected(ConformityDocumentType.DECLARATION_BENEFICIAIRES_EFFECTIFS, [otherFile])

      await result.onSave()

      // One POST succeeded, one failed → report failure, but still re-sync.
      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.saveErrorMessage)
      expect(getConformityDocumentsMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('document deletion flow', () => {
    it('should open the dialog when a deletion is requested', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      const document = getRequiredDocumentMock()
      result.onRequestDocumentDeletion(document)

      expect(result.isDeleteDialogOpen.value).toBe(true)
      expect(result.documentPendingDeletion.value).toEqual({ document })
    })

    it('should clear the pending deletion when the model is closed', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onRequestDocumentDeletion(getRequiredDocumentMock())
      result.isDeleteDialogOpen.value = false

      expect(result.documentPendingDeletion.value).toBeUndefined()
    })

    it('should clear the pending deletion and reload the list once the document is deleted', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      result.onRequestDocumentDeletion(getRequiredDocumentMock())
      await result.onDocumentDeleted()

      expect(result.documentPendingDeletion.value).toBeUndefined()
      expect(getConformityDocumentsMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('section completion', () => {
    it('should not allow marking the section as completed when a document is pending', async () => {
      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      expect(result.canMarkSectionCompleted.value).toBe(false)
    })

    it('should allow marking the section as completed when all documents are uploaded', async () => {
      getConformityDocumentsMock.mockResolvedValue(getConformityDocumentsResponseMock({
        requiredDocs: [getRequiredDocumentMock(), getRequiredDocumentMock({ type: ConformityDocumentType.STATUTS })],
      }))

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      expect(result.canMarkSectionCompleted.value).toBe(true)
    })

    it('should not allow marking the section again once it is complete', async () => {
      getConformityDocumentsMock.mockResolvedValue(getConformityDocumentsResponseMock({
        isComplete: true,
        requiredDocs: [getRequiredDocumentMock()],
      }))

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      expect(result.isComplete.value).toBe(true)
      expect(result.canMarkSectionCompleted.value).toBe(false)
    })

    it('should mark the section as completed and reload the documents', async () => {
      getConformityDocumentsMock.mockResolvedValue(getConformityDocumentsResponseMock({
        requiredDocs: [getRequiredDocumentMock()],
      }))

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      await result.onMarkSectionCompleted()

      expect(markCompletedMock).toHaveBeenCalledWith(accountIdMock)
      expect(getConformityDocumentsMock).toHaveBeenCalledTimes(2)
      expect(result.isMarkingCompleted.value).toBe(false)
    })

    it('should display an error notification when the completion fails', async () => {
      getConformityDocumentsMock.mockResolvedValue(getConformityDocumentsResponseMock({
        requiredDocs: [getRequiredDocumentMock()],
      }))
      markCompletedMock.mockRejectedValue(new Error('Complete Error'))

      const [result] = withSetup(() => useConformityDocuments(optionsMock))
      await flushPromises()

      await result.onMarkSectionCompleted()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.markCompletedErrorMessage)
      expect(getConformityDocumentsMock).toHaveBeenCalledTimes(1)
      expect(result.isMarkingCompleted.value).toBe(false)
    })
  })
})
