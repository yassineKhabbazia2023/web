// feature-flags are disabled by default as it is the default behavior in case no env-vars are provided
// this also ensures that the tests needing the flagged features are set accordingly
export const isScheduleActivatedMock = vi.fn(() => false)
export const isFeedCenterActivatedMock = vi.fn(() => false)
export const isMailToGedActivatedMock = vi.fn(() => false)

export const featureFlagManagerMock = {
  isScheduleActivated: isScheduleActivatedMock,
  isFeedCenterActivated: isFeedCenterActivatedMock,
  isMailToGedActivated: isMailToGedActivatedMock,
}
