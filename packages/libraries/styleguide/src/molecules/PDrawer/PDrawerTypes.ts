import type { BreadcrumbItems } from '../../molecules/PBreadcrumb/PBreadcrumbTypes'

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
}
