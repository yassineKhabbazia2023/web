import type { PTagProps } from '@pulse/styleguide/types'

/**
 * Mapping of business role identifiers to their associated colors.
 * Used to style role labels according to their business domain.
 * Each key represents a business name, and the value is a valid PTag color.
 */
export const ROLE_BUSINESS_COLORS: Record<string, PTagProps['pColor']> = {
  transverse: 'warning',
  esc: 'info',
  conseil: 'light-blue',
  juridique: 'success',
  social: 'default',
} as const

/**
 * List of role labels with their corresponding color.
 * Colors are mapped from ROLE_BUSINESS_COLORS and used to style each role.
 * The `label` keys refer to i18n translation keys (e.g., in en-US or fr-FR).
 */
export const ROLE_COLORS = [
  {
    label: 'role.crossFunctional',
    color: ROLE_BUSINESS_COLORS.transverse,
  },
  {
    label: 'role.esc',
    color: ROLE_BUSINESS_COLORS.esc,
  },
  {
    label: 'role.consulting',
    color: ROLE_BUSINESS_COLORS.conseil,
  },
  {
    label: 'role.legal',
    color: ROLE_BUSINESS_COLORS.juridique,
  },
  {
    label: 'role.socialManagement',
    color: ROLE_BUSINESS_COLORS.social,
  },
]

/**
 * Maximum character length for combined role descriptions before truncation
 */
export const MAX_DESCRIPTION_LENGTH = 40

/**
 * Maximum number of main role labels to display
 * when role descriptions are short enough (below the length limit)
 */
export const MAX_MAIN_ROLES_LONG = 2

/**
 * Maximum number of main role labels to display
 * when role descriptions are too long (exceed the length limit)
 */
export const MAX_MAIN_ROLES_SHORT = 1

/**
 * Default color for mixed business roles
 */
export const DEFAULT_MIXED_ROLE_COLOR: PTagProps['pColor'] = 'gray'
