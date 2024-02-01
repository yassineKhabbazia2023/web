import { Component } from 'vue'

export interface IProps {
  number: number
  content: string
  icon: Component
  color: any
  isSelected?: boolean
  clickable: boolean
}
