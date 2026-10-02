import type { Feature } from '../../enums/feature.enums'

// feature-flags are disabled by default as it is the default behavior in case no env-vars are provided
// this also ensures that the tests needing the flagged features are set accordingly
export const isAmplitudeActivatedMock = vi.fn(() => false)
export const isPennylaneAmendmentFlowActivatedMock = vi.fn(() => false)
export const isRFinanceActivatedMock = vi.fn(() => false)

export const featureFlagManagerMock = {
  isAmplitudeActivated: isAmplitudeActivatedMock,
  isPennylaneAmendmentFlowActivated: isPennylaneAmendmentFlowActivatedMock,
  isRFinanceActivated: isRFinanceActivatedMock,
  isFeatureActivated: vi.fn((_featureFlag: Feature) => false),
}
