export type calendarEvent = 'prev-month' | '' | 'next-month' | 'today'

export type PDatePickerModelValue = [Date, Date] | Date | string

export interface PDatePickerShortcut {
  text: string
  value: Date | [Date, Date] | Function
}
export interface PDatePickerProps<T extends PDatePickerModelValue = PDatePickerModelValue> {
  modelValue: T
  pCalendarLite?: boolean
  pReadonly?: boolean
  pDisabled?: boolean
  pSize?: '' | 'large' | 'default' | 'small'
  pClearable?: boolean
  pType?: 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange'
  pFormat?: string
  pValueFormat?: string
  pPlaceholder?: string
  pDisabledDate?: Function
  pShortcuts?: PDatePickerShortcut[]
  pUnlinkPanels?: boolean
  pRangeSeparator?: string
  pStartPlaceholder?: string
  pEndPlaceholder?: string
  pTeleported?: boolean
  pPopperClass?: string
  pTestId?: string
}
