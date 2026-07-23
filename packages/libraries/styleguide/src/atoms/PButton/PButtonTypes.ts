import type { Component } from 'vue'

export interface PButtonProps {
  pType?: 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'white'
    | 'danger'
    | 'active'
  pCircle?: boolean
  pDisabled?: boolean
  pLoading?: boolean
  pSize?: 'default' | 'small'
  pIconOnly?: boolean
  pIsActive?: boolean
  pIsUnderlined?: boolean
  pTag?: string | Component
  pTestId?: string
}
