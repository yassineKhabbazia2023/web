export type NotificationMessagesByType = {
  loading: string
  success: string
  error: string
}

export type NotificationHandle = {
  close: () => void
}
