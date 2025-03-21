export enum PStrengthLevel {
  EMPTY = 0,
  WEAK = 1,
  POOR = 2,
  MEDIUM = 3,
  STRONG = 4,
}

export interface PStrengthProps {
  modelValue: PStrengthLevel
  labels: Record<PStrengthLevel, string>
}
