import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import { getUploadedSupportingDocumentMock } from '@entities/__mocks__'
import { useComplementaryDocuments } from './complementary-documents.composable'

vi.mock('@entities/services/conformity-documents')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const uploadConformityDocumentMock = vi.mocked(ConformityDocumentsService.uploadConformityDocument)
const displayNotificationMock = vi.mocked(displayNotification)
const emitMock = vi.fn()

const optionsMock = {
  saveSuccessMessage: 'saveSuccess',
  saveErrorMessage: 'saveError',
}

const availableSlots = 10
const accountIdMock = 602
const fileMock = new File(['content'], 'facture.pdf', { type: 'application/pdf' })

describe('complementary-documents.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentEntityStoreMock.currentEntityId = accountIdMock
  })

  describe('file selection', () => {
    it('should store the selected File instances and flag pending uploads', () => {
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onFilesSelected([fileMock], availableSlots)

      expect(result.selectedFiles.value).toEqual([fileMock])
      expect(result.hasPendingUploads.value).toBe(true)
    })

    it('should cap the selection at the available slots', () => {
      const otherFile = new File(['content'], 'autre.pdf', { type: 'application/pdf' })
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onFilesSelected([fileMock, otherFile], 1)

      expect(result.selectedFiles.value).toEqual([fileMock])
    })

    it('should ignore entries that are not File instances', () => {
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onFilesSelected([undefined as unknown as File], availableSlots)

      expect(result.selectedFiles.value).toEqual([])
      expect(result.hasPendingUploads.value).toBe(false)
    })

    it('should remove a single selected file', () => {
      const otherFile = new File(['content'], 'autre.pdf', { type: 'application/pdf' })
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onFilesSelected([fileMock, otherFile], availableSlots)
      result.onRemoveSelectedFile(fileMock)

      expect(result.selectedFiles.value).toEqual([otherFile])
    })
  })

  describe('onSave', () => {
    it('should upload every selected file as complementary, notify success, bump the reset key and emit saved', async () => {
      const otherFile = new File(['content'], 'autre.pdf', { type: 'application/pdf' })
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onFilesSelected([fileMock, otherFile], availableSlots)
      const initialKey = result.uploadResetKey.value

      await result.onSave()

      expect(uploadConformityDocumentMock).toHaveBeenCalledWith(accountIdMock, SupportingDocumentType.COMPLEMENTARY, fileMock)
      expect(uploadConformityDocumentMock).toHaveBeenCalledWith(accountIdMock, SupportingDocumentType.COMPLEMENTARY, otherFile)
      expect(displayNotificationMock).toHaveBeenCalledWith('success', optionsMock.saveSuccessMessage)
      expect(result.uploadResetKey.value).toBe(initialKey + 1)
      expect(result.hasPendingUploads.value).toBe(false)
      expect(emitMock).toHaveBeenCalledWith('saved')
      expect(result.isSaving.value).toBe(false)
    })

    it('should not upload anything when no file is selected', async () => {
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      await result.onSave()

      expect(uploadConformityDocumentMock).not.toHaveBeenCalled()
      expect(emitMock).not.toHaveBeenCalled()
    })

    it('should display an error notification but still emit saved when an upload fails', async () => {
      uploadConformityDocumentMock.mockRejectedValue(new Error('Upload Error'))
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onFilesSelected([fileMock], availableSlots)

      await result.onSave()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.saveErrorMessage)
      expect(emitMock).toHaveBeenCalledWith('saved')
      expect(result.isSaving.value).toBe(false)
    })
  })

  describe('document deletion flow', () => {
    it('should open the dialog when a deletion is requested', () => {
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      const document = getUploadedSupportingDocumentMock()
      result.onRequestDocumentDeletion(document)

      expect(result.isDeleteDialogOpen.value).toBe(true)
      expect(result.documentPendingDeletion.value).toEqual({ document })
    })

    it('should clear the pending deletion when the model is closed', () => {
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onRequestDocumentDeletion(getUploadedSupportingDocumentMock())
      result.isDeleteDialogOpen.value = false

      expect(result.documentPendingDeletion.value).toBeUndefined()
    })

    it('should clear the pending deletion and emit deleted once the document is deleted', () => {
      const [result] = withSetup(() => useComplementaryDocuments(optionsMock, emitMock))

      result.onRequestDocumentDeletion(getUploadedSupportingDocumentMock())
      result.onDocumentDeleted()

      expect(result.documentPendingDeletion.value).toBeUndefined()
      expect(emitMock).toHaveBeenCalledWith('deleted')
    })
  })
})
