import { PERMISSION_CODES } from '@entities/constants'
import { userPermissions } from '@pulse/common'
import { getPatchOperations } from '@entities/services/PatchRecordService/PatchRecordService'
import { type PatchValue } from '@entities/services/PatchRecordService'
import { patchAccount } from '@entities/services/account'

const { hasPermission } = userPermissions()

export function getCanEdit(isCollab: boolean) {
  return isCollab && hasPermission(PERMISSION_CODES.EDIT_COMPANY_DATA)
}

export async function savePatchedAccount(accountId: number, patchValues: PatchValue[]) {
  const patchOperations = getPatchOperations(patchValues)
  if (patchOperations.length === 0) {
    throw new Error('Unmanaged case: patchOperations is empty')
  }
  await patchAccount(accountId, patchOperations)
}
