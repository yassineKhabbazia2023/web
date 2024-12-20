import type { Component } from 'vue'
import { IconName } from '../../types/IconName.types'

export interface PFilterOptionProps {
  pValue?: string | number
  pContent: string
  pColor: 'success' | 'warning' | 'amethyste' | 'danger' | 'gray-500' | 'gray-900'
  pSelected?: boolean
  pDisabled?: boolean
  pIcon?: Component | string
  pIconName?: IconName
}
