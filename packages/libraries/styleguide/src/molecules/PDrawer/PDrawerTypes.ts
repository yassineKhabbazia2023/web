import type { BreadcrumbItems } from '../../molecules/PBreadcrumb/PBreadcrumbTypes'
import type { PToolboxProps } from '@styleguide/molecules/PToolbox/PToolboxTypes'
import { ElDrawer } from 'element-plus'

// In order to match expected Element Plus before close signature
type DoneFn = (cancel?: boolean) => void
type PBeforeCloseFn = (done: DoneFn) => void

export interface PDrawerProps {
  modelValue: boolean
  pTitle?: string
  pShowPreviousStep?: boolean
  pDirection?: 'rtl' | 'ltr' | 'ttb' | 'btt'
  pSize?: number | string
  pShowClose?: boolean
  pBreadcrumb?: BreadcrumbItems[]
  pWithHeader?: boolean
  pType?: 'mini' | 'fullscreen'
  pSuffixUnderTitle?: boolean
  pHeaderToolbox?: PToolboxProps
  pBeforeClose?: PBeforeCloseFn
  pTestId?: string
}

export type ElDrawerInstanceType = InstanceType<typeof ElDrawer>
