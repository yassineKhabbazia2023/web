import type { Collab } from '@entities/types'

export interface SelectCollaboratorsStepProps {
  accountId: number
  initialSelectedCollaborators?: Collab[]
}
