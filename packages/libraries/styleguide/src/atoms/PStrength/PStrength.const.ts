import { PStrengthLevel } from './PStrength.types'

export const PStrengthLevelColor: Record<PStrengthLevel, string> = {
  [PStrengthLevel.EMPTY]: 'neutral-gray-200',
  [PStrengthLevel.WEAK]: 'stroke-error',
  [PStrengthLevel.POOR]: 'stroke-warning',
  [PStrengthLevel.MEDIUM]: 'stroke-warning',
  [PStrengthLevel.STRONG]: 'stroke-success',
}
