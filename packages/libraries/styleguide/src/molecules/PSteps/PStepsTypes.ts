import type { Component, StyleValue } from 'vue'
import type { PStepStatus } from './PSteps.enums'

export type PStepsStatus = Exclude<PStepStatus, ''>

export interface PStepsItem {
  pTitle?: string
  pDescription?: string
  pIcon?: string | Component
  pStatus?: PStepStatus
  pDataTestId?: string
  class?: unknown
  style?: StyleValue
}

export interface PStepsProps {
  pSpace?: number | string
  pDirection?: 'vertical' | 'horizontal'
  pActive?: number
  pProcessStatus?: PStepsStatus
  pFinishStatus?: PStepsStatus
  pAlignCenter?: boolean
  pSimple?: boolean
  pSteps?: PStepsItem[]
}
