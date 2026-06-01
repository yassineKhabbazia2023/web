import type { Collab } from '@entities/types'

export interface CollaboratorListItemProps {
  collaborator: Collab
  isSelected: boolean
  isDisabled: boolean
}
