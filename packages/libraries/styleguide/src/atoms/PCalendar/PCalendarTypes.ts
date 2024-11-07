import type { CalendarCellItemProps } from '@/atoms/PCalendarDateCell/PCalendarDateCellTypes'

export interface CalendarItemsGroupedByDate {
  date: string
  items: CalendarCellItemProps[]
}
export interface PCalendarProps {
  modelValue?: Date
  pItemsGroupedByDate: CalendarItemsGroupedByDate[]
  // This should start with monday and end with sunday
  // This means you might include days from the previous and next month
  pInitialDateRange?: [Date, Date]
}
