export type NotificationType = 'success' | 'error' | 'downloading'

export interface NotificationHandle {
  close: () => void
}
