export type PCompletionTrackerListItemStatus = 'pending' | 'in-progress' | 'completed'

export interface PCompletionTrackerListItemProps {
  pLabel: string
  pStatus?: PCompletionTrackerListItemStatus
  pSelected?: boolean
  pSecondaryText?: string
}
