import type { Component } from 'vue'

export interface PFilterOptionProps {
  pNumber: number
  pContent: string
  pColor: 'success' | 'warning' | 'amethyste' | 'danger' | 'gray-500'
  pSelected?: boolean
  pDisabled?: boolean
  pIcon: Component | string
}
