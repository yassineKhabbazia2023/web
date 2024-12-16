declare let window: {
  VITE_SCHEDULE_ACTIVATED: 'true' | 'false'
} & Window

export class FeatureFlagManager {
  static isScheduleActivated() {
    return window.VITE_SCHEDULE_ACTIVATED === 'true'
  }
}