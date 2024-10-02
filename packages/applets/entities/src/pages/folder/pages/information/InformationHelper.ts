import { PERMISSION_CODES } from '@entities/constants'
import { userPermissions } from '@pulse/common'

const { hasPermission } = userPermissions()

export function getCanEdit(isCollab: boolean) {
  return isCollab && hasPermission(PERMISSION_CODES.EDIT_COMPANY_DATA)
}
