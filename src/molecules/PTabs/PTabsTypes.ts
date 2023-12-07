export interface PTabsProps {
  pType?: 'card' | 'border-card' | '',
  pClosable?: boolean,
  pAddable?: boolean,
  pEditable?: boolean,
  pTabPosition?: 'top' | 'right' | 'bottom' | 'left',
  pStretch?: boolean,
  pBeforeLeave?: (_newName: string | number, _oldName: string | number) => Promise<boolean | void>
}
