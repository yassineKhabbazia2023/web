export type RemoveFromFoldersNotificationType = 'success' | 'warning' | 'error'

export interface RemoveFromFoldersNotification {
  type: RemoveFromFoldersNotificationType
  message: string
}

export interface RemoveFromFoldersTranslations {
  success: string
  partialSuccess: string
  failure: string
}
