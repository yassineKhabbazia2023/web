export interface PTaskItemProps {
  pTitle: string
  pStatus: 'active' | 'disabled' | 'done'
  pCompletedTasks: string | number
  pTotalTasks: string | number
}
