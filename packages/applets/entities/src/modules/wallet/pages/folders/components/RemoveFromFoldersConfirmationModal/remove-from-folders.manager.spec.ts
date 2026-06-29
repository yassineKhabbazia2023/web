import { RemoveFromFoldersManager } from './remove-from-folders.manager'
import type { AccountSelfRemovalResponse } from '@entities/services/account'
import type { RemoveFromFoldersTranslations } from './remove-from-folders.types'

const translations: RemoveFromFoldersTranslations = {
  success: 'Success',
  partialSuccess: 'Partial success',
  failure: 'Failure',
}

const getResponse = (succeededCount: number, failedCount: number): AccountSelfRemovalResponse => ({
  succeeded: Array.from({ length: succeededCount }, (_, index) => ({
    accountId: index + 1,
    errorCode: null,
    errorMessage: null,
  })),
  failed: Array.from({ length: failedCount }, (_, index) => ({
    accountId: index + 100,
    errorCode: 'ACC004',
    errorMessage: 'Error',
  })),
})

describe('RemoveFromFoldersManager', () => {
  it('returns a success notification when every selected folder is removed', () => {
    const notification = RemoveFromFoldersManager.getNotification(getResponse(3, 0), 3, translations)

    expect(notification).toStrictEqual({
      type: 'success',
      message: 'Success',
    })
  })

  it('returns a warning notification when at least one selected folder is removed', () => {
    const notification = RemoveFromFoldersManager.getNotification(getResponse(2, 1), 3, translations)

    expect(notification).toStrictEqual({
      type: 'warning',
      message: 'Partial success',
    })
  })

  it('returns an error notification when no selected folder is removed', () => {
    const notification = RemoveFromFoldersManager.getNotification(getResponse(0, 3), 3, translations)

    expect(notification).toStrictEqual({
      type: 'error',
      message: 'Failure',
    })
  })
})
