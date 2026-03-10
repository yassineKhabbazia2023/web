export type PCompletionTrackerListItemStatus = 'incomplete' | 'completed'

export interface PCompletionTrackerListItemProps {
  pLabel: string
  pStatus?: PCompletionTrackerListItemStatus
  pSelected?: boolean
  pSecondaryText?: string
}
