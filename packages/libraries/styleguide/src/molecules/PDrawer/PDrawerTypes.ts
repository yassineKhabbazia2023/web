import type { BreadcrumbItems } from '../../molecules/PBreadcrumb/PBreadcrumbTypes'
import type { PToolboxProps } from '@styleguide/molecules/PToolbox/PToolboxTypes'
import { ElDrawer } from 'element-plus'

export interface PDrawerProps {
  modelValue: boolean
  pTitle?: string
  pShowPreviousStep?: boolean
  pDirection?: 'rtl' | 'ltr' | 'ttb' | 'btt' | 'rtl'
  pSize?: number | string
  pShowClose?: boolean
  pBreadcrumb?: BreadcrumbItems[]
  pWithHeader?: boolean
  pType?: 'mini' | 'fullscreen'
  pSuffixUnderTitle?: boolean
  pHeaderToolbox?: PToolboxProps
}

export type ElDrawerInstanceType = InstanceType<typeof ElDrawer>