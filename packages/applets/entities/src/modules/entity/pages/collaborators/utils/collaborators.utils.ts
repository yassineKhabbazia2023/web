import type { PTagProps } from '@pulse/styleguide/types'
import {
  ROLE_BUSINESS_COLORS,
  DEFAULT_MIXED_ROLE_COLOR,
  MAX_DESCRIPTION_LENGTH,
  MAX_MAIN_ROLES_SHORT,
  MAX_MAIN_ROLES_LONG,
} from '../constants/collaborators.const'
import type { RoleBusiness, RoleLabel, RoleLabelGroups } from '@entities/modules/entity/types'

/**
 * Gets the color associated with a business role
 */
export const getBusinessRoleColor = (business: string): PTagProps['pColor'] => {
  if (business === undefined || business === null || business.trim() === '') {
    return DEFAULT_MIXED_ROLE_COLOR
  }

  const businessName = business.toLowerCase().trim() as RoleBusiness
  return ROLE_BUSINESS_COLORS[businessName] ?? DEFAULT_MIXED_ROLE_COLOR
}

/**
 * Calculates the total character length of role descriptions
 */
const calculateTotalDescriptionLength = (roleLabels: RoleLabel[]): number => {
  return roleLabels.map((role) => role.description?.trim() ?? '').join(',').length
}

/**
 * Splits role labels into main and other groups based on description length
 */
export const splitRoleLabelsIntoGroups = (roleLabels: RoleLabel[]): RoleLabelGroups => {
  if (!Array.isArray(roleLabels) || roleLabels.length === 0) {
    return { main: [], others: [] }
  }

  // Create a shallow copy to avoid mutating the original array
  const rolesCopy = [...roleLabels]

  const totalLength = calculateTotalDescriptionLength(rolesCopy.slice(0, MAX_MAIN_ROLES_LONG))
  const maxMainRoles = totalLength > MAX_DESCRIPTION_LENGTH ? MAX_MAIN_ROLES_SHORT : MAX_MAIN_ROLES_LONG

  return {
    main: rolesCopy.slice(0, maxMainRoles),
    others: rolesCopy.slice(maxMainRoles),
  }
}

/**
 * Determines the appropriate color for overflow indicator based on business consistency
 * Returns the business color if all roles belong to the same business, otherwise gray
 */
export const getOverflowIndicatorColor = (roleLabels: RoleLabel[]): PTagProps['pColor'] => {
  if (!Array.isArray(roleLabels) || roleLabels.length === 0) {
    return DEFAULT_MIXED_ROLE_COLOR
  }

  const [firstLabel, ...restLabels] = roleLabels

  if (!firstLabel?.business) {
    return DEFAULT_MIXED_ROLE_COLOR
  }

  const allHaveSameBusiness = restLabels.every((role) => role?.business === firstLabel.business)

  return allHaveSameBusiness ? getBusinessRoleColor(firstLabel.business) : DEFAULT_MIXED_ROLE_COLOR
}
