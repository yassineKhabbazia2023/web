import type { MockInstance } from 'vitest'
import { usePennylaneAmendment } from './pennylane-amendment.composable'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getMockedPennylaneAccessResponse } from '@pulse/common/mocks'
import { PennylaneAmendmentTrackingManager } from '../widgets/gridless/pennylane-sso/pennylane-amendment-tracking.manager'

let checkPennylaneAccessMock: MockInstance
let isPennylaneAmendmentFlowActivatedMock: MockInstance

describe('usePennylaneAmendment', () => {
  beforeEach(() => {
    checkPennylaneAccessMock = vi.spyOn(PennylaneService, 'checkPennylaneAccess')
    isPennylaneAmendmentFlowActivatedMock = vi.spyOn(FeatureFlagManager, 'isPennylaneAmendmentFlowActivated').mockReturnValue(true)
    vi.spyOn(PennylaneAmendmentTrackingManager, 'trackOutroOK').mockImplementation(() => {})
    vi.spyOn(PennylaneAmendmentTrackingManager, 'trackOutroKO').mockImplementation(() => {})
  })

  describe('checkPennylaneAccess', () => {
    it('should populate state when checkPennylaneAccess succeeds', async () => {
      checkPennylaneAccessMock.mockResolvedValue(
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
      expect(pennylaneFreeTrialInfo.value?.wave).toBe('Restauration')
    })

    it('should reset state when checkPennylaneAccess fails', async () => {
      checkPennylaneAccessMock.mockRejectedValue(new Error('Network error'))

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
      expect(pennylaneFreeTrialInfo.value?.wave).toBeUndefined()
    })

    it('should not checkPennylaneAccess when feature flag disabled', async () => {
      isPennylaneAmendmentFlowActivatedMock.mockReturnValue(false)

      const { checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(checkPennylaneAccessMock).not.toHaveBeenCalled()
    })

    it('should pass accountId to service', async () => {
      checkPennylaneAccessMock.mockResolvedValue(
        getMockedPennylaneAccessResponse(),
      )

      const { checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess(123)

      expect(checkPennylaneAccessMock).toHaveBeenCalledWith(123)
    })

    it('should call service without accountId when not provided', async () => {
      checkPennylaneAccessMock.mockResolvedValue(
        getMockedPennylaneAccessResponse(),
      )

      const { checkPennylaneAccess } = usePennylaneAmendment()

      await checkPennylaneAccess()

      expect(checkPennylaneAccessMock).toHaveBeenCalledWith(undefined)
    })
  })

  describe('shouldShowPennylaneAmendmentDialog', () => {
    it('should be true when access denied and user is signatory', async () => {
      checkPennylaneAccessMock.mockResolvedValue(
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
      checkPennylaneAccessMock.mockResolvedValue(
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
      checkPennylaneAccessMock.mockResolvedValue(
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
      checkPennylaneAccessMock.mockResolvedValue({
        canAccess: false,
        isPennylaneSignatory: true,
        details: undefined,
        freeTrialEndDate: '2025-12-31',
        billingMonth: '1',
        isFreeTrialExpired: false,
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
      checkPennylaneAccessMock.mockResolvedValue({
        ...response,
        freeTrialEndDate: '',
        wave: '',
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
      checkPennylaneAccessMock.mockResolvedValue({
        canAccess: false,
        isPennylaneSignatory: true,
        freeTrialEndDate: response.freeTrialEndDate,
        billingMonth: response.billingMonth,
        isFreeTrialExpired: false,
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
      checkPennylaneAccessMock.mockResolvedValue(
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
      checkPennylaneAccessMock.mockResolvedValue(
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

    it('should freeze the free trial info for the success dialog', async () => {
      checkPennylaneAccessMock.mockResolvedValue(
        getMockedPennylaneAccessResponse({ isFreeTrialExpired: true }),
      )

      const { pennylaneFreeTrialInfo, acceptedFreeTrialInfo, checkPennylaneAccess, captureAcceptedFreeTrialInfo } = usePennylaneAmendment()

      await checkPennylaneAccess()
      captureAcceptedFreeTrialInfo()

      expect(acceptedFreeTrialInfo.value).toEqual(pennylaneFreeTrialInfo.value)
      expect(acceptedFreeTrialInfo.value?.isFreeTrialExpired).toBe(true)
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
