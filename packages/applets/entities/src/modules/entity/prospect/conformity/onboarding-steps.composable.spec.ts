import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useOnboardingSteps } from './onboarding-steps.composable'
import { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'

vi.mock('@entities/services/prospects/prospects.service')
vi.mock('@pulse/toolbox')

const fetchOnboardingStepsMock = vi.mocked(ProspectsService.fetchOnboardingSteps)

const prospectIdMock = 602

const stepsResponseMock = [
  { id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.Completed },
  { id: OnboardingStep.SupportingDocuments, status: OnboardingStepStatus.Completed },
  { id: OnboardingStep.Beneficiary, status: OnboardingStepStatus.ToDo },
  { id: OnboardingStep.EngagementLetter, status: OnboardingStepStatus.InReview },
  { id: OnboardingStep.PaymentMethod, status: OnboardingStepStatus.ToDo },
]

describe('onboarding-steps.composable', () => {
  beforeEach(() => {
    fetchOnboardingStepsMock.mockResolvedValue(stepsResponseMock)
  })

  describe('initial loading on mount', () => {
    it('should fetch the steps and expose the status map', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => prospectIdMock))

      expect(result.isLoadingSteps.value).toBe(true)

      await flushPromises()

      expect(fetchOnboardingStepsMock).toHaveBeenCalledWith(prospectIdMock)
      expect(result.isLoadingSteps.value).toBe(false)
      expect(result.stepStatusById.value.get(OnboardingStep.CommercialProposal)).toBe(OnboardingStepStatus.Completed)
      expect(result.stepStatusById.value.get(OnboardingStep.Beneficiary)).toBe(OnboardingStepStatus.ToDo)
    })

    it('should compute the counts strictly from the API response', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => prospectIdMock))
      await flushPromises()

      expect(result.totalCount.value).toBe(5)
      expect(result.completedCount.value).toBe(2)
    })
  })

  describe('missing prospect id', () => {
    it('should not fetch and stop loading when the prospect id is undefined', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => undefined))
      await flushPromises()

      expect(fetchOnboardingStepsMock).not.toHaveBeenCalled()
      expect(result.isLoadingSteps.value).toBe(false)
      expect(result.totalCount.value).toBe(0)
    })
  })

  describe('reload', () => {
    it('should re-fetch the steps and refresh the exposed state', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => prospectIdMock))
      await flushPromises()

      fetchOnboardingStepsMock.mockResolvedValue([
        { id: OnboardingStep.PaymentMethod, status: OnboardingStepStatus.Completed },
      ])

      await result.reload()

      expect(fetchOnboardingStepsMock).toHaveBeenLastCalledWith(prospectIdMock)
      expect(result.totalCount.value).toBe(1)
      expect(result.completedCount.value).toBe(1)
      expect(result.stepStatusById.value.get(OnboardingStep.PaymentMethod)).toBe(OnboardingStepStatus.Completed)
    })
  })

  describe('error handling', () => {
    it('should keep the previous state and stop loading when the fetch fails', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => prospectIdMock))
      await flushPromises()

      fetchOnboardingStepsMock.mockRejectedValue(new Error('API Error'))

      await result.reload()

      expect(result.totalCount.value).toBe(5)
      expect(result.isLoadingSteps.value).toBe(false)
    })
  })
})
