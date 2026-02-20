import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'
import { getPatchOperations } from '@entities/services/patch-record/patch-record.service'
import { type PatchValue } from '@entities/services/patch-record'
import { patchAccount } from '@entities/services/account'

export function getCanEdit(isCollab: boolean) {
  return isCollab && CurrentUserManager.hasPermission(ACTION_PERMISSIONS.EDIT_COMPANY_DATA)
}

export async function savePatchedAccount(accountId: number, patchValues: PatchValue[]) {
  const patchOperations = getPatchOperations(patchValues)
  if (patchOperations.length === 0) {
    throw new Error('Unmanaged case: patchOperations is empty')
  }
  await patchAccount(accountId, patchOperations)
}
