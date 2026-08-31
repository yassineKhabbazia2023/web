import { getStoreMock } from '@pulse/common/mocks/vitest'
import { FeatureFlagManager } from '@pulse/common/managers'
import { useInvoicesAccessStore, useUserStore } from '@pulse/common/stores'
import { OldRydgeInvoicesTracking } from '../old-rydge-invoices.tracking.service'
import { useOldRydgeInvoicesDialog } from './old-rydge-invoices-dialog.composable'

const userStoreMock = getStoreMock(useUserStore)
const invoicesAccessStoreMock = getStoreMock(useInvoicesAccessStore)

describe('useOldRydgeInvoicesDialog', () => {
  beforeEach(() => {
    userStoreMock.user = { email: 'client@example.com', isCollab: false } as any
    invoicesAccessStoreMock.contactWithAccess = 'client@example.com'
    vi.spyOn(FeatureFlagManager, 'isLegacyVentyaInvoicesAccessActivated').mockReturnValue(true)
  })

  describe('isCtaVisible', () => {
    it('should return true for the coffre-fort contact when the flag is on', () => {
      const { isCtaVisible } = useOldRydgeInvoicesDialog()

      expect(isCtaVisible.value).toBe(true)
    })

    it('should return false when the flag is off', () => {
      vi.mocked(FeatureFlagManager.isLegacyVentyaInvoicesAccessActivated).mockReturnValue(false)

      const { isCtaVisible } = useOldRydgeInvoicesDialog()

      expect(isCtaVisible.value).toBe(false)
    })

    it('should return false for a client who is not the coffre-fort contact', () => {
      invoicesAccessStoreMock.contactWithAccess = 'someone-else@example.com'

      const { isCtaVisible } = useOldRydgeInvoicesDialog()

      expect(isCtaVisible.value).toBe(false)
    })

    it('should return false for a collab, even when contactWithAccess matches', () => {
      userStoreMock.user = { email: 'client@example.com', isCollab: true } as any

      const { isCtaVisible } = useOldRydgeInvoicesDialog()

      expect(isCtaVisible.value).toBe(false)
    })

    it('should return false when there is no designated contact', () => {
      invoicesAccessStoreMock.contactWithAccess = null
      userStoreMock.user = { isCollab: false } as any

      const { isCtaVisible } = useOldRydgeInvoicesDialog()

      expect(isCtaVisible.value).toBe(false)
    })
  })

  describe('openDialog', () => {
    it('should open the dialog and track the click', () => {
      vi.spyOn(OldRydgeInvoicesTracking, 'trackOldInvoicesCtaClick')

      const { isDialogOpen, openDialog } = useOldRydgeInvoicesDialog()
      openDialog()

      expect(isDialogOpen.value).toBe(true)
      expect(vi.mocked(OldRydgeInvoicesTracking.trackOldInvoicesCtaClick)).toHaveBeenCalledOnce()
    })
  })

  describe('handleLoginClick', () => {
    it('should track the login click', () => {
      vi.spyOn(OldRydgeInvoicesTracking, 'trackOldInvoicesLoginClick')

      const { handleLoginClick } = useOldRydgeInvoicesDialog()
      handleLoginClick()

      expect(vi.mocked(OldRydgeInvoicesTracking.trackOldInvoicesLoginClick)).toHaveBeenCalledOnce()
    })
  })

  describe('handleAssistanceClick', () => {
    it('should open the assistance page in a new tab and track the click', () => {
      const windowOpenSpy = vi.fn()
      vi.stubGlobal('open', windowOpenSpy)
      vi.spyOn(OldRydgeInvoicesTracking, 'trackOldInvoicesAssistanceClick')

      const { handleAssistanceClick } = useOldRydgeInvoicesDialog()
      handleAssistanceClick()

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://2dpyhn.share-eu1.hsforms.com/2-bh4OP7VSJSgBFWMFlGjxw',
        '_blank',
        'noopener,noreferrer',
      )
      expect(vi.mocked(OldRydgeInvoicesTracking.trackOldInvoicesAssistanceClick)).toHaveBeenCalledOnce()
    })
  })
})
