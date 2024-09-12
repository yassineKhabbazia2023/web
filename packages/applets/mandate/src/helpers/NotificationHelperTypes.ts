export type NotificationMessagesByType = {
  loading?: string
  success?: string
  error?: string
  downloading?: string
}

export type NotificationHandle = {
  close: () => void
}
