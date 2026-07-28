import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { SupportingDocumentItem } from '@entities/services/conformity-documents'
import { getSupportingDocumentItemMock, getUploadedSupportingDocumentMock } from '@entities/__mocks__'
import { useSupportingDocuments } from './supporting-documents.composable'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const uploadConformityDocumentMock = vi.fn()
const displayNotificationMock = vi.mocked(displayNotification)
const emitMock = vi.fn()

let itemsMock: SupportingDocumentItem[]

const optionsMock = {
  saveSuccessMessage: 'saveSuccess',
  saveErrorMessage: 'saveError',
  getItems: () => itemsMock,
}

const accountIdMock = 602
const fileMock = new File(['content'], 'kbis.pdf', { type: 'application/pdf' })
const secondFileMock = new File(['content'], 'statuts-2.pdf', { type: 'application/pdf' })

describe('supporting-documents.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(ConformityDocumentsService, 'uploadConformityDocument').mockImplementation(uploadConformityDocumentMock)
    displayNotificationMock.mockImplementation(() => undefined)
    currentEntityStoreMock.currentEntityId = accountIdMock
    itemsMock = []
  })

  describe('file selection', () => {
    it('should initialize an empty selection for every provided item type', () => {
      itemsMock = [
        getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS, documents: [] }),
        getSupportingDocumentItemMock({ type: SupportingDocumentType.STATUTS, documents: [] }),
      ]
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      expect(result.selectedFilesByType.value[SupportingDocumentType.KBIS]).toEqual([])
      expect(result.selectedFilesByType.value[SupportingDocumentType.STATUTS]).toEqual([])
      expect(result.hasPendingUploads.value).toBe(false)
    })

    it('should report pending uploads once a selection holds a file', () => {
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.STATUTS] = [fileMock, secondFileMock]

      expect(result.hasPendingUploads.value).toBe(true)
    })
  })

  describe('canSave', () => {
    const requiredItems = [
      getSupportingDocumentItemMock({ type: SupportingDocumentType.KBIS, documents: [] }),
      getSupportingDocumentItemMock({ type: SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION, documents: [] }),
    ]

    it('should stay false when only one of the required documents is selected', () => {
      itemsMock = requiredItems
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.KBIS] = [fileMock]

      expect(result.canSave.value).toBe(false)
    })

    it('should become true when every required document is selected', () => {
      itemsMock = requiredItems
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.KBIS] = [fileMock]
      result.selectedFilesByType.value[SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION] = [secondFileMock]

      expect(result.canSave.value).toBe(true)
    })

    it('should be true when one required document is already persisted and the other is pending', () => {
      itemsMock = [
        getSupportingDocumentItemMock({
          type: SupportingDocumentType.KBIS,
          documents: [getUploadedSupportingDocumentMock()],
        }),
        getSupportingDocumentItemMock({ type: SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION, documents: [] }),
      ]
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION] = [fileMock]

      expect(result.canSave.value).toBe(true)
    })

    it('should be false when all required documents are persisted but nothing is pending', () => {
      itemsMock = [
        getSupportingDocumentItemMock({
          type: SupportingDocumentType.KBIS,
          documents: [getUploadedSupportingDocumentMock()],
        }),
        getSupportingDocumentItemMock({
          type: SupportingDocumentType.BENEFICIAL_OWNER_DECLARATION,
          documents: [getUploadedSupportingDocumentMock()],
        }),
      ]
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      expect(result.canSave.value).toBe(false)
    })
  })

  describe('onSave', () => {
    it('should upload every selected file, notify success, clear the selection and emit saved', async () => {
      const otherFile = new File(['content'], 'statuts.pdf', { type: 'application/pdf' })
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.KBIS] = [fileMock]
      result.selectedFilesByType.value[SupportingDocumentType.STATUTS] = [otherFile]

      await result.onSave()

      expect(uploadConformityDocumentMock).toHaveBeenCalledWith(accountIdMock, SupportingDocumentType.KBIS, fileMock)
      expect(uploadConformityDocumentMock).toHaveBeenCalledWith(accountIdMock, SupportingDocumentType.STATUTS, otherFile)
      expect(displayNotificationMock).toHaveBeenCalledWith('success', optionsMock.saveSuccessMessage)
      expect(result.hasPendingUploads.value).toBe(false)
      expect(emitMock).toHaveBeenCalledWith('saved')
      expect(result.isSaving.value).toBe(false)
    })

    it('should not upload anything when no file is selected', async () => {
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      await result.onSave()

      expect(uploadConformityDocumentMock).not.toHaveBeenCalled()
      expect(emitMock).not.toHaveBeenCalled()
    })

    it('should display an error notification but still emit saved when an upload fails', async () => {
      uploadConformityDocumentMock.mockRejectedValue(new Error('Upload Error'))
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.KBIS] = [fileMock]

      await result.onSave()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.saveErrorMessage)
      expect(emitMock).toHaveBeenCalledWith('saved')
      expect(result.isSaving.value).toBe(false)
    })

    it('should report failure when only one upload of several fails', async () => {
      uploadConformityDocumentMock.mockResolvedValueOnce(undefined)
      uploadConformityDocumentMock.mockRejectedValueOnce(new Error('second failed'))
      const otherFile = new File(['content'], 'statuts.pdf', { type: 'application/pdf' })
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.selectedFilesByType.value[SupportingDocumentType.KBIS] = [fileMock]
      result.selectedFilesByType.value[SupportingDocumentType.STATUTS] = [otherFile]

      await result.onSave()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.saveErrorMessage)
    })
  })

  describe('document deletion flow', () => {
    it('should expose the current account id for document deletion', () => {
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      expect(result.currentEntityId.value).toBe(accountIdMock)
    })

    it('should open the dialog when a deletion is requested', () => {
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      const document = getUploadedSupportingDocumentMock()
      result.onRequestDocumentDeletion(document)

      expect(result.isDeleteDialogOpen.value).toBe(true)
      expect(result.documentPendingDeletion.value).toEqual({ document })
    })

    it('should clear the pending deletion when the model is closed', () => {
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.onRequestDocumentDeletion(getUploadedSupportingDocumentMock())
      result.isDeleteDialogOpen.value = false

      expect(result.documentPendingDeletion.value).toBeUndefined()
    })

    it('should clear the pending deletion and emit deleted once the document is deleted', () => {
      const [result] = withSetup(() => useSupportingDocuments(optionsMock, emitMock))

      result.onRequestDocumentDeletion(getUploadedSupportingDocumentMock())
      result.onDocumentDeleted()

      expect(result.documentPendingDeletion.value).toBeUndefined()
      expect(emitMock).toHaveBeenCalledWith('deleted')
    })
  })
})
