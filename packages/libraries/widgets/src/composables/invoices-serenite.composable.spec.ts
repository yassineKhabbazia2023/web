import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { RYDGE_ELECTRONIC_INVOICING_PLATFORM_URL, RYDGE_ELECTRONIC_INVOICING_REFORM_URL } from '@pulse/common/constants'
import { InvoicesSereniteService } from '@pulse/common/services/invoices-serenite'
import { InvoicesSereniteTrackingManager } from '../widgets/gridless/invoices-serenite/invoices-serenite-tracking.manager'
import { useInvoicesSerenite } from './invoices-serenite.composable'

describe('useInvoicesSerenite', () => {
  beforeEach(() => {
    vi.spyOn(InvoicesSereniteService, 'fetchShouldDisplayModal').mockResolvedValue(true)
    vi.spyOn(InvoicesSereniteService, 'markModalAsSeen').mockResolvedValue()
    vi.spyOn(InvoicesSereniteTrackingManager, 'trackResponse').mockImplementation(() => undefined)
    vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  describe('checkEligibility', () => {
    it('should display the dialog when the user is eligible', async () => {
      const { isDialogVisible, checkEligibility } = useInvoicesSerenite()

      await checkEligibility()

      expect(isDialogVisible.value).toBe(true)
    })

    it('should keep the dialog hidden when the user is not eligible', async () => {
      vi.mocked(InvoicesSereniteService.fetchShouldDisplayModal).mockResolvedValue(false)
      const { isDialogVisible, checkEligibility } = useInvoicesSerenite()

      await checkEligibility()

      expect(isDialogVisible.value).toBe(false)
    })

    it('should keep the dialog hidden and log when the check fails', async () => {
      const error = new Error('Network error')
      vi.mocked(InvoicesSereniteService.fetchShouldDisplayModal).mockRejectedValue(error)
      const { isDialogVisible, checkEligibility } = useInvoicesSerenite()

      await checkEligibility()

      expect(isDialogVisible.value).toBe(false)
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Invoices Serenite eligibility check failed', error)
    })
  })

  describe('onComply', () => {
    it('should open the RYDGE page in a new tab, close the dialog, track and mark the modal as seen with "yes"', async () => {
      const { isDialogVisible, checkEligibility, onComply } = useInvoicesSerenite()
      await checkEligibility()

      onComply()
      await flushPromises()

      expect(window.open).toHaveBeenCalledExactlyOnceWith(RYDGE_ELECTRONIC_INVOICING_PLATFORM_URL, '_blank', 'noopener,noreferrer')
      expect(isDialogVisible.value).toBe(false)
      expect(InvoicesSereniteTrackingManager.trackResponse).toHaveBeenCalledExactlyOnceWith('yes')
      expect(InvoicesSereniteService.markModalAsSeen).toHaveBeenCalledExactlyOnceWith('yes')
    })

    it('should not mark the modal as seen with "no" when the dialog closes after "comply"', async () => {
      const { checkEligibility, onComply, onDialogClose } = useInvoicesSerenite()
      await checkEligibility()

      onComply()
      onDialogClose()
      await flushPromises()

      expect(InvoicesSereniteTrackingManager.trackResponse).toHaveBeenCalledExactlyOnceWith('yes')
      expect(InvoicesSereniteService.markModalAsSeen).toHaveBeenCalledExactlyOnceWith('yes')
    })
  })

  describe('onUnderstandReform', () => {
    it('should open the reform page in a new tab without closing the dialog nor marking the modal as seen', async () => {
      const { isDialogVisible, checkEligibility, onUnderstandReform } = useInvoicesSerenite()
      await checkEligibility()

      onUnderstandReform()
      await flushPromises()

      expect(window.open).toHaveBeenCalledExactlyOnceWith(RYDGE_ELECTRONIC_INVOICING_REFORM_URL, '_blank', 'noopener,noreferrer')
      expect(isDialogVisible.value).toBe(true)
      expect(InvoicesSereniteTrackingManager.trackResponse).not.toHaveBeenCalled()
      expect(InvoicesSereniteService.markModalAsSeen).not.toHaveBeenCalled()
    })
  })

  describe('onDialogClose', () => {
    it('should close the dialog, track and mark the modal as seen with "no"', async () => {
      const { isDialogVisible, checkEligibility, onDialogClose } = useInvoicesSerenite()
      await checkEligibility()

      onDialogClose()
      await flushPromises()

      expect(isDialogVisible.value).toBe(false)
      expect(window.open).not.toHaveBeenCalled()
      expect(InvoicesSereniteTrackingManager.trackResponse).toHaveBeenCalledExactlyOnceWith('no')
      expect(InvoicesSereniteService.markModalAsSeen).toHaveBeenCalledExactlyOnceWith('no')
    })

    it('should only mark the modal as seen once', async () => {
      const { checkEligibility, onDialogClose } = useInvoicesSerenite()
      await checkEligibility()

      onDialogClose()
      onDialogClose()
      await flushPromises()

      expect(InvoicesSereniteTrackingManager.trackResponse).toHaveBeenCalledOnce()
      expect(InvoicesSereniteService.markModalAsSeen).toHaveBeenCalledOnce()
    })

    it('should log and not track when the modal cannot be marked as seen', async () => {
      const error = new Error('Network error')
      vi.mocked(InvoicesSereniteService.markModalAsSeen).mockRejectedValue(error)
      const { checkEligibility, onDialogClose } = useInvoicesSerenite()
      await checkEligibility()

      onDialogClose()
      await flushPromises()

      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Invoices Serenite modal could not be marked as seen', error)
      expect(InvoicesSereniteTrackingManager.trackResponse).not.toHaveBeenCalled()
    })
  })
})
