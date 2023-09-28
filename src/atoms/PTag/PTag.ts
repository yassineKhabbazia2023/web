import { type TagProps } from 'element-plus'
import { type Component } from 'vue'

export interface PTagProps extends TagProps {
  pColor: ''
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'persian'
    | 'fuschia'
    | 'cyan'
    | 'amethyste'
    | 'gray-300'
    | 'gray-500'
    | 'gray-900'
  content: string
  iconLeft?: Component | string
  iconRight?: Component | string
}
