import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { usePennylaneAmendmentFlow } from './pennylane-amendment-flow.composable'
import { FeatureFlagManager } from '@pulse/common/managers'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedPennylaneAccessResponse } from '@pulse/common/mocks'

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: {
    isPennylaneAmendmentFlowActivated: vi.fn(() => true),
  },
}))

vi.mock('@pulse/common/services/pennylane', () => ({
  PennylaneService: {
    checkPennylaneAccess: vi.fn(),
  },
}))

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('usePennylaneAmendmentFlow', () => {
  const mockAccessResponse = getMockedPennylaneAccessResponse({
    canAccess: true,
    isPennylaneSignatory: true,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    currentEntityStoreMock.currentEntityId = 123
    vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(true)
    vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValue(mockAccessResponse)
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      expect(result.isCheckingPennylaneAccess.value).toBe(true)
      expect(result.canAccess.value).toBe(undefined)
      expect(result.accessDetails.value).toBe(undefined)
      expect(result.isAccessBlockedDialogOpen.value).toBe(false)
      expect(result.isAmendmentFlowDialogOpen.value).toBe(false)
      expect(result.isSuccessDialogOpen.value).toBe(false)
      expect(result.isDeclineDialogOpen.value).toBe(false)

      app.unmount()
    })

    it('should return currentAccountId from store', () => {
      currentEntityStoreMock.currentEntityId = 456

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      expect(result.currentAccountId.value).toBe(456)

      app.unmount()
    })
  })

  describe('checkPennylaneAccess', () => {
    it('should call PennylaneService.checkPennylaneAccess on mount', async () => {
      const [_result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(PennylaneService.checkPennylaneAccess).toHaveBeenCalledWith(123)

      app.unmount()
    })

    it('should update state after successful access check', async () => {
      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(result.canAccess.value).toBe(true)
      expect(result.accessDetails.value).toEqual(mockAccessResponse.details)
      expect(result.isCheckingPennylaneAccess.value).toBe(false)

      app.unmount()
    })

    it('should not check access when feature flag is disabled', async () => {
      vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(false)

      const [_result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(PennylaneService.checkPennylaneAccess).not.toHaveBeenCalled()

      app.unmount()
    })

    it('should not check access when accountId is undefined', async () => {
      currentEntityStoreMock.currentEntityId = undefined

      const [_result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(PennylaneService.checkPennylaneAccess).not.toHaveBeenCalled()

      app.unmount()
    })

    it('should handle error and reset state', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockRejectedValueOnce(new Error('Network error'))

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(result.canAccess.value).toBe(undefined)
      expect(result.accessDetails.value).toBe(undefined)
      expect(result.isCheckingPennylaneAccess.value).toBe(false)

      app.unmount()
    })
  })

  describe('shouldBlockAccess', () => {
    it('should return false when feature flag is disabled', async () => {
      vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(false)

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(result.shouldBlockAccess.value).toBe(false)

      app.unmount()
    })

    it('should return true when canAccess is false', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValueOnce({
        canAccess: false,
        isPennylaneSignatory: false,
        details: undefined,
        freeTrialEndDate: '2026-10-31T00:00:00.00',
        billingMonth: 'novembre 2026',
      })

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(result.shouldBlockAccess.value).toBe(true)

      app.unmount()
    })

    it('should return false when canAccess is true', async () => {
      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      expect(result.shouldBlockAccess.value).toBe(false)

      app.unmount()
    })
  })

  describe('handlePennylaneClick', () => {
    it('should do nothing when still checking access', async () => {
      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      result.handlePennylaneClick()

      expect(result.isAccessBlockedDialogOpen.value).toBe(false)
      expect(result.isAmendmentFlowDialogOpen.value).toBe(false)

      app.unmount()
    })

    it('should open blocked dialog when shouldShowBlockedDialog is true', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValueOnce({
        canAccess: false,
        isPennylaneSignatory: false,
        details: undefined,
        freeTrialEndDate: '2026-10-31T00:00:00.00',
        billingMonth: 'novembre 2026',
      })

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      result.handlePennylaneClick()

      expect(result.isAccessBlockedDialogOpen.value).toBe(true)

      app.unmount()
    })

    it('should open amendment flow dialog when shouldShowAmendmentFlowDialog is true', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValueOnce({
        canAccess: false,
        isPennylaneSignatory: true,
        details: undefined,
        freeTrialEndDate: '2026-10-31T00:00:00.00',
        billingMonth: 'novembre 2026',
      })

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      result.handlePennylaneClick()

      expect(result.isAmendmentFlowDialogOpen.value).toBe(true)

      app.unmount()
    })
  })

  describe('handleAmendmentFlowContinue', () => {
    it('should close amendment flow dialog', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockResolvedValueOnce({
        canAccess: false,
        isPennylaneSignatory: true,
        details: undefined,
        freeTrialEndDate: '2026-10-31T00:00:00.00',
        billingMonth: 'novembre 2026',
      })

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      result.handlePennylaneClick()
      expect(result.isAmendmentFlowDialogOpen.value).toBe(true)

      result.handleAmendmentFlowContinue()
      expect(result.isAmendmentFlowDialogOpen.value).toBe(false)

      app.unmount()
    })
  })

  describe('handleAcceptSuccess', () => {
    it('should recheck access and open success dialog after access check completes', async () => {
      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      vi.mocked(PennylaneService.checkPennylaneAccess).mockClear()

      await result.handleAcceptSuccess()

      expect(PennylaneService.checkPennylaneAccess).toHaveBeenCalled()
      expect(result.isSuccessDialogOpen.value).toBe(true)

      app.unmount()
    })
  })

  describe('handleDecline', () => {
    it('should open decline dialog', async () => {
      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      result.handleDecline()

      expect(result.isDeclineDialogOpen.value).toBe(true)

      app.unmount()
    })
  })

  describe('shouldShowBlockedDialog', () => {
    it('should return false when feature flag is disabled', async () => {
      vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(false)

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      // Access internal computed through the exposed values indirectly
      result.handlePennylaneClick()
      expect(result.isAccessBlockedDialogOpen.value).toBe(false)

      app.unmount()
    })

    it('should return false when values are undefined', async () => {
      vi.mocked(PennylaneService.checkPennylaneAccess).mockRejectedValueOnce(new Error('error'))

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      result.handlePennylaneClick()
      expect(result.isAccessBlockedDialogOpen.value).toBe(false)

      app.unmount()
    })
  })

  describe('shouldShowAmendmentFlowDialog', () => {
    it('should return false when feature flag is disabled', async () => {
      vi.mocked(FeatureFlagManager.isPennylaneAmendmentFlowActivated).mockReturnValue(false)

      const [result, app] = withSetup(() => usePennylaneAmendmentFlow())

      await flushPromises()

      result.handlePennylaneClick()
      expect(result.isAmendmentFlowDialogOpen.value).toBe(false)

      app.unmount()
    })
  })
})
