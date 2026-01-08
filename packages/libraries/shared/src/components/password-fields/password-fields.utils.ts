import type { PStrengthLevel } from '@pulse/styleguide/types'
import { PASSWORD_STRENGTH_RULES, DIFF_TO_STRENGTH_LEVEL } from './password-fields.const'

export function getPasswordStrength(password: string): PStrengthLevel {
  const matchingRules = PASSWORD_STRENGTH_RULES
    .filter(regexp => regexp.test(password))
  const matchingRulesCount = matchingRules.length

  const diff = PASSWORD_STRENGTH_RULES.length - matchingRulesCount

  // converts diff to PStrengthLevel
  return DIFF_TO_STRENGTH_LEVEL[diff] ?? 0
}
