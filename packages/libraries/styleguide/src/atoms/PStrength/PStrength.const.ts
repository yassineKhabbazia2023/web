import { PStrengthLevel } from './PStrength.types'

export const PStrengthLevelColor: Record<PStrengthLevel, string> = {
  [PStrengthLevel.EMPTY]: 'neutral-gray-200',
  [PStrengthLevel.WEAK]: 'functionnal-red',
  [PStrengthLevel.POOR]: 'functionnal-orange',
  [PStrengthLevel.MEDIUM]: 'functionnal-yellow',
  [PStrengthLevel.STRONG]: 'functionnal-green',
}
