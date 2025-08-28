import type { Feature } from '../enums/feature.enums'

// feature-flags are disabled by default as it is the default behavior in case no env-vars are provided
// this also ensures that the tests needing the flagged features are set accordingly
export const isFeedCenterActivatedMock = vi.fn(() => false)
export const isMailToGedActivatedMock = vi.fn(() => false)
export const isAmplitudeActivatedMock = vi.fn(() => false)
export const isNotificationSettingsDrawerActivatedMock = vi.fn(() => false)

export const featureFlagManagerMock = {
  isFeedCenterActivated: isFeedCenterActivatedMock,
  isMailToGedActivated: isMailToGedActivatedMock,
  isAmplitudeActivated: isAmplitudeActivatedMock,
  isNotificationSettingsDrawerActivated: isNotificationSettingsDrawerActivatedMock,
  isFeatureActivated: vi.fn((_featureFlag: Feature) => false),
}
