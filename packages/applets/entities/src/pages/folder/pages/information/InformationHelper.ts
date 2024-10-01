import { PERMISSION_CODES } from '@entities/constants'
import { userPermissions } from '@pulse/common'

const { hasPermission } = userPermissions()

export function getForceDisabled(isCollab: boolean) {
  if (!isCollab) {
    return true
  }
  return !hasPermission(PERMISSION_CODES.EDIT_COMPANY_DATA)
}
