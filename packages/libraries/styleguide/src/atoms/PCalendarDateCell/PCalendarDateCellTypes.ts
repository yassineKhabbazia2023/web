import type { PTaskItemProps } from '../PTaskItem/PTaskItemTypes'

export interface CalendarCellItemProps extends PTaskItemProps {
  pItemId: number
  pTitle: string
}

export interface PCalendarDateCellProps {
  // Strings are ISO 8601 strings
  // pActiveDate is the date currently used by the calendar
  pActiveDate: string
  pCurrentDate: string
  pCellDate: string
  pCellElements: CalendarCellItemProps[]
  pCellType: 'prev-month' | 'next-month' | 'current-month'
}
