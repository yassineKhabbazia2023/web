interface PHeaderTabsMenu {
  pIcon: string
  pText: string
  pPath: string
}

export interface PHeaderTabsProps {
  pHeaderTabsMenu: PHeaderTabsMenu[]
  pMode?: 'horizontal' | 'vertical'
  pEllipsis?: boolean
  pDefaultActive?: string
}
