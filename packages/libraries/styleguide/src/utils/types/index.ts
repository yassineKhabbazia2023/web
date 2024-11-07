import type { FormInstance, FormRules } from 'element-plus'

export interface VueComponent {
  template?: string
  name: string
  components?: Record<string, any>
  props?: string[]
  emits?: string[]
  methods?: { [key: string]: () => void }
  setup?: () => any
}

export interface StubbedComponents {
  [key: string]: VueComponent
}

export type PFormInstance = FormInstance
export type PFormRules = FormRules
