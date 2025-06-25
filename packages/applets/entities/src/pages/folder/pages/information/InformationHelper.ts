import { PERMISSION_ACTION } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'
import { getPatchOperations } from '@entities/services/PatchRecordService/PatchRecordService'
import { type PatchValue } from '@entities/services/PatchRecordService'
import { patchAccount } from '@entities/services/account'

export function getCanEdit(isCollab: boolean) {
  return isCollab && CurrentUserManager.hasPermission(PERMISSION_ACTION.EDIT_COMPANY_DATA)
}

export async function savePatchedAccount(accountId: number, patchValues: PatchValue[]) {
  const patchOperations = getPatchOperations(patchValues)
  if (patchOperations.length === 0) {
    throw new Error('Unmanaged case: patchOperations is empty')
  }
  await patchAccount(accountId, patchOperations)
}
