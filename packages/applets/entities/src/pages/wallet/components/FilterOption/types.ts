import type { Component } from 'vue'

export interface FilterOptionProps {
  number: number
  content: string
  icon: Component
  color: any
  isSelected?: boolean
  clickable: boolean
}
