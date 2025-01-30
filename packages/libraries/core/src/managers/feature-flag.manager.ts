declare let window: {
  EnvVars: {
    VITE_SCHEDULE_ACTIVATED: 'true' | 'false'
    VITE_MAIL_TO_GED_ACTIVATED: 'true' | 'false'
    VITE_FEED_CENTER_ACTIVATED: 'true' | 'false'
  }
} & Window

export class FeatureFlagManager {
  static isScheduleActivated() {
    return window.EnvVars?.VITE_SCHEDULE_ACTIVATED === 'true'
  }

  static isMailToGedActivated() {
    return window.EnvVars?.VITE_MAIL_TO_GED_ACTIVATED === 'true'
  }

  static isFeedCenterActivated() {
    return window.EnvVars?.VITE_FEED_CENTER_ACTIVATED === 'true'
  }
}
