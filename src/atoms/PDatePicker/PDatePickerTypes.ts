export type calendarEvent = 'prev-month' | '' | 'next-month' | 'today'

export interface PDatePickerProps {
  modelValue: string | Date
  pCalendarLite?: boolean
  pSchedulesCollection?: string[]
  pMonth?: calendarEvent
  pReadonly?: boolean
  pDisabled?: boolean
  pSize?: '' | 'large' | 'default' | 'small'
  pClearable?: boolean
  pType?: 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'
  pFormat?: string
  pValueFormat?: string
  pPlaceholder?: string
  pDisabledDate?: Function
  pShortcuts?: Array<{ text: string, value: Date | Function }>
  pUnlinkPanels?: boolean
  pRangeSeparator?: string
  pStartPlaceholder?: string
  pEndPlaceholder?: string
  pTeleported?: boolean
  pPopperClass?: string
}
