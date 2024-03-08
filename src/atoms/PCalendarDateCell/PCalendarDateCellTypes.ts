import type { PTaskItemProps } from '@/atoms/PTaskItem/PTaskItemTypes'

export interface PCalendarDateCellProps {
  // Strings are ISO 8601 strings
  // pActiveDate is the date currently used by the calendar
  pActiveDate: string
  pCurrentDate: string
  pCellDate: string
  pCellElements: PTaskItemProps[]
  pCellType: 'prev-month' | 'next-month' | 'current-month'
}
