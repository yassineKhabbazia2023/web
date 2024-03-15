export interface PTaskItemProps {
  pTitle: string
  pStatus: 'todo' | 'disabled' | 'done'
  pCompletedTasks: string | number
  pTotalTasks: string | number
}
