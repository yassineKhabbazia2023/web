import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { useEngagementLetter } from './engagement-letter.composable'
import { armConformityDocumentMocks } from '@entities/__mocks__/vitest'

const openDocumentInNewTabMock = vi.mocked(openDocumentInNewTab)

const I18N_KEY = 'entities.prospect.conformity.engagementLetter'
const entityId = 1971

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setEntityId = (id: number | undefined): void => {
  currentEntityStoreMock.currentEntityId = id
}

const mountComposable = (emit = vi.fn()) => {
  const [result] = withSetup(() => useEngagementLetter(emit))
  return { result, emit }
}

const buildPdfFile = (): File =>
  new File(['content'], 'engagement-letter.pdf', { type: 'application/pdf' })

describe('useEngagementLetter', () => {
  beforeEach(() => {
    armConformityDocumentMocks()
    vi.spyOn(ProspectsService, 'downloadEngagementLetter').mockResolvedValue(undefined as unknown as Blob)
    vi.spyOn(ProspectsService, 'uploadEngagementLetter').mockResolvedValue(undefined)
    setEntityId(entityId)
  })

  describe('file selection', () => {
    it('should start without any selected file', () => {
      const { result } = mountComposable()

      expect(result.selectedEngagementLetterFile.value).toBeNull()
    })
  })

  describe('openEngagementLetterDocument', () => {
    it('should open the document in a new tab for the current prospect', async () => {
      openDocumentInNewTabMock.mockResolvedValue(true)
      const { result } = mountComposable()

      await result.openEngagementLetterDocument()

      expect(openDocumentInNewTabMock).toHaveBeenCalledOnce()
      // The fetcher handed to the helper downloads the engagement letter for the current prospect.
      const [fetchDocument] = openDocumentInNewTabMock.mock.calls[0]
      await fetchDocument()
      expect(vi.mocked(ProspectsService.downloadEngagementLetter)).toHaveBeenCalledWith(entityId)
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
      expect(result.isDownloading.value).toBe(false)
    })

    it('should do nothing when no prospect is selected', async () => {
      setEntityId(undefined)
      const { result } = mountComposable()

      await result.openEngagementLetterDocument()

      expect(openDocumentInNewTabMock).not.toHaveBeenCalled()
    })

    it('should display an error notification when the browser blocks the popup', async () => {
      openDocumentInNewTabMock.mockResolvedValue(false)
      const { result } = mountComposable()

      await result.openEngagementLetterDocument()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.downloadError`)
      expect(result.isDownloading.value).toBe(false)
    })

    it('should display an error notification when the download fails', async () => {
      openDocumentInNewTabMock.mockRejectedValue(new Error('network error'))
      const { result } = mountComposable()

      await result.openEngagementLetterDocument()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.downloadError`)
      expect(result.isDownloading.value).toBe(false)
    })
  })

  describe('sendEngagementLetterToCustomer', () => {
    it('should upload the selected file, notify success and emit sent', async () => {
      const file = buildPdfFile()
      vi.mocked(ProspectsService.uploadEngagementLetter).mockResolvedValueOnce(undefined)
      const { result, emit } = mountComposable()
      result.selectedEngagementLetterFile.value = file

      await result.sendEngagementLetterToCustomer()

      expect(vi.mocked(ProspectsService.uploadEngagementLetter)).toHaveBeenCalledWith(entityId, file)
      expect(result.selectedEngagementLetterFile.value).toBeNull()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', `${I18N_KEY}.sendSuccess`)
      expect(emit).toHaveBeenCalledWith('sent')
      expect(result.isSending.value).toBe(false)
    })

    it('should do nothing without a selected file', async () => {
      const { result, emit } = mountComposable()

      await result.sendEngagementLetterToCustomer()

      expect(vi.mocked(ProspectsService.uploadEngagementLetter)).not.toHaveBeenCalled()
      expect(emit).not.toHaveBeenCalled()
    })

    it('should do nothing when no prospect is selected', async () => {
      setEntityId(undefined)
      const { result } = mountComposable()
      result.selectedEngagementLetterFile.value = buildPdfFile()

      await result.sendEngagementLetterToCustomer()

      expect(vi.mocked(ProspectsService.uploadEngagementLetter)).not.toHaveBeenCalled()
    })

    it('should display an error notification and not emit when the upload fails', async () => {
      vi.mocked(ProspectsService.uploadEngagementLetter).mockRejectedValueOnce(new Error('network error'))
      const { result, emit } = mountComposable()
      result.selectedEngagementLetterFile.value = buildPdfFile()

      await result.sendEngagementLetterToCustomer()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', `${I18N_KEY}.sendError`)
      expect(emit).not.toHaveBeenCalled()
      expect(result.isSending.value).toBe(false)
    })
  })
})
