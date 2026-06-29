import type { AccountSelfRemovalResponse } from '@entities/services/account'
import type { RemoveFromFoldersNotification, RemoveFromFoldersTranslations } from './remove-from-folders.types'

export class RemoveFromFoldersManager {
  static getNotification(
    response: AccountSelfRemovalResponse,
    totalSelectedFoldersCount: number,
    translations: RemoveFromFoldersTranslations,
  ): RemoveFromFoldersNotification {
    const succeededCount = response.succeeded.length

    if (succeededCount === totalSelectedFoldersCount) {
      return {
        type: 'success',
        message: translations.success,
      }
    }

    if (succeededCount > 0) {
      return {
        type: 'warning',
        message: translations.partialSuccess,
      }
    }

    return {
      type: 'error',
      message: translations.failure,
    }
  }
}
