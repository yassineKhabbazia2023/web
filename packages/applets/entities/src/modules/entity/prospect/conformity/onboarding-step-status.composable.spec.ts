import { flushPromises } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useOnboardingStepStatus } from './onboarding-step-status.composable'
import { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

let fetchOnboardingStepMock: MockInstance

const accountIdMock = 1971

describe('onboarding-step-status.composable', () => {
  beforeEach(() => {
    currentEntityStoreMock.currentEntityId = accountIdMock
    fetchOnboardingStepMock = vi.spyOn(ProspectsService, 'fetchOnboardingStep').mockResolvedValue({
      id: OnboardingStep.CommercialProposal,
      status: OnboardingStepStatus.Completed,
    })
  })

  describe('initial loading on mount', () => {
    it('should fetch the step and expose its status', async () => {
      const [result] = withSetup(() => useOnboardingStepStatus(OnboardingStep.CommercialProposal))

      expect(result.isLoadingStatus.value).toBe(true)
      // The initial mount uses the skeleton flag only, never the refresh flag.
      expect(result.isRefreshingStatus.value).toBe(false)

      await flushPromises()

      expect(fetchOnboardingStepMock).toHaveBeenCalledWith(accountIdMock, OnboardingStep.CommercialProposal)
      expect(result.isLoadingStatus.value).toBe(false)
      expect(result.isRefreshingStatus.value).toBe(false)
      expect(result.status.value).toBe(OnboardingStepStatus.Completed)
    })
  })

  describe('missing account id', () => {
    it('should not fetch and stop loading when the account id is undefined', async () => {
      currentEntityStoreMock.currentEntityId = undefined

      const [result] = withSetup(() => useOnboardingStepStatus(OnboardingStep.CommercialProposal))
      await flushPromises()

      expect(fetchOnboardingStepMock).not.toHaveBeenCalled()
      expect(result.isLoadingStatus.value).toBe(false)
      expect(result.status.value).toBeUndefined()
    })
  })

  describe('reloadStatus', () => {
    it('should re-fetch the step and refresh the exposed status', async () => {
      const [result] = withSetup(() => useOnboardingStepStatus(OnboardingStep.CommercialProposal))
      await flushPromises()

      fetchOnboardingStepMock.mockResolvedValue({
        id: OnboardingStep.CommercialProposal,
        status: OnboardingStepStatus.InReview,
      })

      await result.reloadStatus()

      expect(fetchOnboardingStepMock).toHaveBeenLastCalledWith(accountIdMock, OnboardingStep.CommercialProposal)
      expect(result.status.value).toBe(OnboardingStepStatus.InReview)
    })

    it('should drive the refresh flag (not the skeleton flag) while reloading', async () => {
      const [result] = withSetup(() => useOnboardingStepStatus(OnboardingStep.CommercialProposal))
      await flushPromises()

      const reloadPromise = result.reloadStatus()

      // The refresh reuses a dedicated flag so the section shows a PLoader, not the skeleton.
      expect(result.isRefreshingStatus.value).toBe(true)
      expect(result.isLoadingStatus.value).toBe(false)

      await reloadPromise

      expect(result.isRefreshingStatus.value).toBe(false)
      expect(result.isLoadingStatus.value).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should leave the status undefined and stop loading when the fetch fails', async () => {
      fetchOnboardingStepMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => useOnboardingStepStatus(OnboardingStep.CommercialProposal))
      await flushPromises()

      expect(result.status.value).toBeUndefined()
      expect(result.isLoadingStatus.value).toBe(false)
    })
  })
})
