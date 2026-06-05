import { usePennylaneAmendment } from './pennylane-amendment.composable'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getMockedPennylaneAccessResponse } from '@pulse/common/mocks'

vi.mock('@pulse/common/services/pennylane', () => ({
  PennylaneService: {
    checkPennylaneAccess: vi.fn(),
  },
}))

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: {
    isPennylaneAmendmentFlowActivated: vi.fn(),
  },
}))

vi.mock('../widgets/gridless/pennylane-sso/pennylane-amendment-tracking.manager', () => ({
  PennylaneAmendmentTrackingManager: {
    trackOutroOK: vi.fn(),
    trackOutroKO: vi.fn(),
  },
}))

describe('usePennylaneAmendment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('checkPennylaneAccess', () => {
    it('should populate state when checkPennylaneAccess succeeds', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse({
          canAccess: false,
          isPennylaneSignatory: true,
        }),
      )

      const {
        canAccessPennylane,
        isPennylaneSignatory,
        pennylaneAccessDetails,
        pennylaneFreeTrialInfo,
        checkPennylaneAccess,
      } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(canAccessPennylane.value).toBe(false)
      expect(isPennylaneSignatory.value).toBe(true)
      expect(pennylaneAccessDetails.value).toBeDefined()
      expect(pennylaneFreeTrialInfo.value).toBeDefined()
    })

    it('should reset state when checkPennylaneAccess fails', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockRejectedValue(new Error('Network error'))

      const {
        canAccessPennylane,
        isPennylaneSignatory,
        pennylaneAccessDetails,
        pennylaneFreeTrialInfo,
        checkPennylaneAccess,
      } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(canAccessPennylane.value).toBeUndefined()
      expect(isPennylaneSignatory.value).toBeUndefined()
      expect(pennylaneAccessDetails.value).toBeUndefined()
      expect(pennylaneFreeTrialInfo.value).toBeUndefined()
    })

    it('should not checkPennylaneAccess when feature flag disabled', async () => {
      vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(false)

      const { checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(PennylaneService.checkPennylaneAccess).not.toHaveBeenCalled()
    })

    it('should pass accountId to service', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse(),
      )

      const { checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess(123)

      expect(PennylaneService.checkPennylaneAccess).toHaveBeenCalledWith(123)
    })

    it('should call service without accountId when not provided', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse(),
      )

      const { checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(PennylaneService.checkPennylaneAccess).toHaveBeenCalledWith(undefined)
    })
  })

  describe('shouldShowPennylaneAmendmentDialog', () => {
    it('should be true when access denied and user is signatory', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse({
          canAccess: false,
          isPennylaneSignatory: true,
        }),
      )

      const { shouldShowPennylaneAmendmentDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAmendmentDialog.value).toBe(true)
    })

    it('should be false when user can access', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse({
          canAccess: true,
          isPennylaneSignatory: true,
        }),
      )

      const { shouldShowPennylaneAmendmentDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAmendmentDialog.value).toBe(false)
    })

    it('should be false when user is not signatory', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse({
          canAccess: false,
          isPennylaneSignatory: false,
        }),
      )

      const { shouldShowPennylaneAmendmentDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAmendmentDialog.value).toBe(false)
    })

    it('should be false when access details is null', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue({
        canAccess: false,
        isPennylaneSignatory: true,
        details: undefined,
        freeTrialEndDate: '2025-12-31',
        billingMonth: '1',
      })

      const { shouldShowPennylaneAmendmentDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAmendmentDialog.value).toBe(false)
    })

    it('should be false when free trial info is null', async () => {
      const response = getMockedPennylaneAccessResponse({
        canAccess: false,
        isPennylaneSignatory: true,
      })
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue({
        ...response,
        freeTrialEndDate: '',
        billingMonth: '',
      })

      const { shouldShowPennylaneAmendmentDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAmendmentDialog.value).toBe(false)
    })

    it('should be false when terms is null', async () => {
      const response = getMockedPennylaneAccessResponse({
        canAccess: false,
        isPennylaneSignatory: true,
      })
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue({
        canAccess: false,
        isPennylaneSignatory: true,
        freeTrialEndDate: response.freeTrialEndDate,
        billingMonth: response.billingMonth,
        details: {
          id: response.details!.id,
          accounts: response.details!.accounts,
          terms: undefined!,
        },
      })

      const { shouldShowPennylaneAmendmentDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAmendmentDialog.value).toBe(false)
    })
  })

  describe('shouldShowPennylaneAccessBlockedDialog', () => {
    it('should be true when access denied and user is not signatory', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse({
          canAccess: false,
          isPennylaneSignatory: false,
        }),
      )

      const { shouldShowPennylaneAccessBlockedDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAccessBlockedDialog.value).toBe(true)
    })

    it('should be false when user can access', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(
        getMockedPennylaneAccessResponse({
          canAccess: true,
          isPennylaneSignatory: false,
        }),
      )

      const { shouldShowPennylaneAccessBlockedDialog, checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(shouldShowPennylaneAccessBlockedDialog.value).toBe(false)
    })
  })

  describe('onPennylaneAmendmentAcceptSuccess', () => {
    it('should close amendment dialog and show success dialog', () => {
      const { showPennylaneAmendmentDialog, showPennylaneAmendmentSuccessDialog, onPennylaneAmendmentAcceptSuccess } = usePennylaneAmendment()

      showPennylaneAmendmentDialog.value = true
      showPennylaneAmendmentSuccessDialog.value = false

      onPennylaneAmendmentAcceptSuccess()

      expect(showPennylaneAmendmentDialog.value).toBe(false)
      expect(showPennylaneAmendmentSuccessDialog.value).toBe(true)
    })
  })

  describe('onPennylaneAmendmentDecline', () => {
    it('should close amendment dialog and show decline dialog', () => {
      const { showPennylaneAmendmentDialog, showPennylaneAmendmentDeclineDialog, onPennylaneAmendmentDecline } = usePennylaneAmendment()

      showPennylaneAmendmentDialog.value = true
      showPennylaneAmendmentDeclineDialog.value = false

      onPennylaneAmendmentDecline()

      expect(showPennylaneAmendmentDialog.value).toBe(false)
      expect(showPennylaneAmendmentDeclineDialog.value).toBe(true)
    })
  })
})
