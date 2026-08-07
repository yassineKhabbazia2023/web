import { withSetup } from '@pulse/toolbox/utils/test'
import { downloadFile, openDocumentInNewTab } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { EntitySummary } from '@pulse/common/types'
import { getSeresInvoiceMock } from './__mocks__/seres-invoices.mocks'
import { SeresInvoicesService } from './seres-invoices.service'
import { SeresInvoiceAction } from './seres-invoices.enums'
import { useSeresInvoicesDownload } from './seres-invoices-download.composable'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const setCurrentEntity = (accountNumber: string | undefined): void => {
  currentEntityStoreMock.currentEntity = accountNumber === undefined
    ? undefined
    : { accountNumber } as EntitySummary
}

const invoice = getSeresInvoiceMock()

describe('useSeresInvoicesDownload', () => {
  beforeEach(() => {
    setCurrentEntity('ACC123')
    vi.spyOn(SeresInvoicesService, 'fetchInvoiceContent').mockResolvedValue(new Blob(['pdf']))
    vi.mocked(downloadFile).mockImplementation(() => undefined)
    vi.mocked(displayNotification).mockImplementation(() => undefined)
    vi.mocked(openDocumentInNewTab).mockResolvedValue(true)
  })

  describe('viewInvoice', () => {
    it('should open the invoice in a new tab', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.viewInvoice(invoice)

      expect(vi.mocked(openDocumentInNewTab)).toHaveBeenCalledOnce()
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
      expect(result.isInvoiceLocked(invoice)).toBe(false)
    })

    it('should fetch the content with the invoice name and the entity account number', async () => {
      vi.mocked(openDocumentInNewTab).mockImplementationOnce(async (fetchDocument) => {
        await fetchDocument()
        return true
      })
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.viewInvoice(invoice)

      expect(vi.mocked(SeresInvoicesService.fetchInvoiceContent)).toHaveBeenCalledWith(invoice.name, 'ACC123')
    })

    it('should notify the user when the browser blocks the popup', async () => {
      vi.mocked(openDocumentInNewTab).mockResolvedValueOnce(false)
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.viewInvoice(invoice)

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    it('should notify the user when the fetch fails', async () => {
      vi.mocked(openDocumentInNewTab).mockRejectedValueOnce(new Error('boom'))
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.viewInvoice(invoice)

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
      expect(result.isInvoiceLocked(invoice)).toBe(false)
    })

    it('should do nothing when no entity is loaded', async () => {
      setCurrentEntity(undefined)
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.viewInvoice(invoice)

      expect(vi.mocked(openDocumentInNewTab)).not.toHaveBeenCalled()
    })

    it('should flag the view action only while the tab is opening', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      let isViewProcessing = false
      let isDownloadProcessing = false
      vi.mocked(openDocumentInNewTab).mockImplementationOnce(async () => {
        isViewProcessing = result.isActionProcessing(invoice, SeresInvoiceAction.VIEW)
        isDownloadProcessing = result.isActionProcessing(invoice, SeresInvoiceAction.DOWNLOAD)
        return true
      })

      await result.viewInvoice(invoice)

      expect(isViewProcessing).toBe(true)
      expect(isDownloadProcessing).toBe(false)
    })

    it('should ignore a second call on the same invoice while it is already being processed', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      vi.mocked(openDocumentInNewTab).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 0)),
      )

      const firstView = result.viewInvoice(invoice)
      await result.viewInvoice(invoice)
      await firstView

      expect(vi.mocked(openDocumentInNewTab)).toHaveBeenCalledOnce()
    })

    it('should allow another invoice to be viewed while one is already being processed', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      vi.mocked(openDocumentInNewTab).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 0)),
      )

      const firstView = result.viewInvoice(invoice)
      await result.viewInvoice(getSeresInvoiceMock({ id: 7, name: '202506029363' }))
      await firstView

      expect(vi.mocked(openDocumentInNewTab)).toHaveBeenCalledTimes(2)
    })
  })

  describe('downloadInvoice', () => {
    it('should download the invoice content as a pdf named after the invoice', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.downloadInvoice(invoice)

      expect(vi.mocked(SeresInvoicesService.fetchInvoiceContent)).toHaveBeenCalledWith(invoice.name, 'ACC123')
      expect(vi.mocked(downloadFile)).toHaveBeenCalledWith(expect.any(Blob), `${invoice.name}.pdf`)
      expect(result.isInvoiceLocked(invoice)).toBe(false)
    })

    it('should notify the user when the download fails', async () => {
      vi.mocked(SeresInvoicesService.fetchInvoiceContent).mockRejectedValueOnce(new Error('boom'))
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.downloadInvoice(invoice)

      expect(vi.mocked(downloadFile)).not.toHaveBeenCalled()
      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', expect.any(String))
    })

    it('should do nothing when no entity is loaded', async () => {
      setCurrentEntity(undefined)
      const [result] = withSetup(() => useSeresInvoicesDownload())

      await result.downloadInvoice(invoice)

      expect(vi.mocked(SeresInvoicesService.fetchInvoiceContent)).not.toHaveBeenCalled()
    })

    it('should flag the download action only while the content is being fetched', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      let isDownloadProcessing = false
      let isViewProcessing = false
      vi.mocked(SeresInvoicesService.fetchInvoiceContent).mockImplementationOnce(async () => {
        isDownloadProcessing = result.isActionProcessing(invoice, SeresInvoiceAction.DOWNLOAD)
        isViewProcessing = result.isActionProcessing(invoice, SeresInvoiceAction.VIEW)
        return new Blob(['pdf'])
      })

      await result.downloadInvoice(invoice)

      expect(isDownloadProcessing).toBe(true)
      expect(isViewProcessing).toBe(false)
    })

    it('should ignore a second call on the same invoice while it is already being processed', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      vi.mocked(SeresInvoicesService.fetchInvoiceContent).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(new Blob(['pdf'])), 0)),
      )

      const firstDownload = result.downloadInvoice(invoice)
      await result.downloadInvoice(invoice)
      await firstDownload

      expect(vi.mocked(SeresInvoicesService.fetchInvoiceContent)).toHaveBeenCalledOnce()
    })

    it('should allow another invoice to be downloaded while one is already being processed', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      vi.mocked(SeresInvoicesService.fetchInvoiceContent).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve(new Blob(['pdf'])), 0)),
      )

      const firstDownload = result.downloadInvoice(invoice)
      await result.downloadInvoice(getSeresInvoiceMock({ id: 7, name: '202506029363' }))
      await firstDownload

      expect(vi.mocked(SeresInvoicesService.fetchInvoiceContent)).toHaveBeenCalledTimes(2)
    })

    it('should keep the view button locked while a download is running on the same invoice', async () => {
      const [result] = withSetup(() => useSeresInvoicesDownload())
      let isInvoiceLocked = false
      vi.mocked(SeresInvoicesService.fetchInvoiceContent).mockImplementationOnce(async () => {
        isInvoiceLocked = result.isInvoiceLocked(invoice)
        return new Blob(['pdf'])
      })

      await result.downloadInvoice(invoice)

      expect(isInvoiceLocked).toBe(true)
    })
  })
})
