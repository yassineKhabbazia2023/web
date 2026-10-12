import { PStrengthLevel } from './PStrength.types'

export const PStrengthLevelColor: Record<PStrengthLevel, string> = {
  [PStrengthLevel.EMPTY]: 'neutral-gray-200',
  [PStrengthLevel.WEAK]: 'stroke-basic-error',
  [PStrengthLevel.POOR]: 'stroke-basic-warning',
  [PStrengthLevel.MEDIUM]: 'stroke-basic-warning',
  [PStrengthLevel.STRONG]: 'stroke-basic-success',
}
