import type { Feature } from '../../enums/feature.enums'

// feature-flags are disabled by default as it is the default behavior in case no env-vars are provided
// this also ensures that the tests needing the flagged features are set accordingly
export const isAmplitudeActivatedMock = vi.fn(() => false)
export const isLastActivityFeatureActivatedMock = vi.fn(() => false)
export const isManageWalletMenuActivatedMock = vi.fn(() => false)
export const isPennylaneAmendmentFlowActivatedMock = vi.fn(() => false)
export const isWalletTableLoadMorePaginationActivatedMock = vi.fn(() => false)

export const featureFlagManagerMock = {
  isAmplitudeActivated: isAmplitudeActivatedMock,
  isLastActivityFeatureActivated: isLastActivityFeatureActivatedMock,
  isManageWalletMenuActivated: isManageWalletMenuActivatedMock,
  isPennylaneAmendmentFlowActivated: isPennylaneAmendmentFlowActivatedMock,
  isWalletTableLoadMorePaginationActivated: isWalletTableLoadMorePaginationActivatedMock,
  isFeatureActivated: vi.fn((_featureFlag: Feature) => false),
}
