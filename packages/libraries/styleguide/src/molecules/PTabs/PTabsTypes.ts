export interface PTabsProps {
  modelValue: string | number
  pType?: 'card' | 'border-card' | 'icon' | ''
  pTabPosition?: 'top' | 'right' | 'bottom' | 'left'
  pStretch?: boolean
  pBeforeLeave?: (_newName: string | number, _oldName: string | number) => Promise<boolean | void>
  pSmartWidth?: boolean
  pTestId?: string
}
