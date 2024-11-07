export interface PMenuProps {
  pMode?: 'horizontal' | 'vertical'
  pCollapse?: boolean
  pEllipsis?: boolean
  pDefaultActive?: string
  pRouter?: boolean
  pDefaultOpeneds?: string[]
  pUniqueOpened?: boolean
  pMenuTrigger?: 'hover' | 'click'
  pCollapseTransition?: boolean
}
