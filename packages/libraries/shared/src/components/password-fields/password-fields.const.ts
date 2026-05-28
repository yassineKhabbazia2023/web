import { PStrengthLevel } from '@pulse/styleguide/types'

export const PASSWORD_STRENGTH_RULES = [
  /.{8}/, // min size 8
  /[A-Z]/, // at least 1 uppercase
  /[a-z]/, // at least 1 lowercase
  /[0-9]/, // at least 1 integer
  /[^a-zA-Z0-9]/, // at least 1 special character
]

export const DIFF_TO_STRENGTH_LEVEL: Record<number, PStrengthLevel> = {
  4: PStrengthLevel.WEAK,
  3: PStrengthLevel.WEAK,
  2: PStrengthLevel.POOR,
  1: PStrengthLevel.MEDIUM,
  0: PStrengthLevel.STRONG,
}
