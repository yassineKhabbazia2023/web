import type { Component } from 'vue'
import type { Dayjs } from 'dayjs'

export interface PTimePickerProps {
  pReadonly?: boolean
  pDisabled?: boolean
  pEditable?: boolean
  pClearable?: boolean
  pSize?: 'large' | 'default' | 'small'
  pPlaceholder?: string
  pStartPlaceholder?: string
  pEndPlaceholder?: string
  pIsRange?: boolean
  pArrowControl?: boolean
  pPopperClass?: string
  pRangeSeparator?: string
  pFormat?: string
  pDefaultValue?: Date | [Date, Date]
  pId?: string | [string, string]
  pName?: string
  pLabel?: string
  pPrefixIcon?: string | Component
  pClearIcon?: string | Component
  pDisabledHours?: (_role: string, _comparingDate?: Dayjs) => number[]
  pDisabledMinutes?: (_hour: number, _role: string, _comparingDate?: Dayjs) => number[]
  pDisabledSeconds?: (
    _hour: number,
    _minute: number,
    _role: string,
    _comparingDate?: Dayjs) => number[]
  pTeleported?: boolean
  pTabindex?: string | number
}
