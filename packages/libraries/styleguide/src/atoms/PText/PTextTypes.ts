import { type Component } from 'vue'

export interface PTextProps {
  pIcon?: Component | string
  pContent: string
  pBold?: boolean
  pType: 'primary' | 'secondary' | 'drag'
  selected?: boolean
  disabled?: boolean
}
