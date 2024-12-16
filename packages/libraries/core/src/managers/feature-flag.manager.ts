declare let window: {
  VITE_SCHEDULE_ACTIVATED: string
} & Window

export class FeatureFlagManager {
  static isScheduleActivated() {
    return window.VITE_SCHEDULE_ACTIVATED === 'true'
  }
}