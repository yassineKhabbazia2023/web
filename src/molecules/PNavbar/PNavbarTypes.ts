import type { PAvatarProps } from '@/atoms/PAvatar/PAvatarTypes'

interface PEntityProps {
  pIdAccount: string
  pName: string
  pIcon: string
  pColor: PAvatarProps['pColor']
}

interface PMenuProps {
  pName: string
  pPath: string
  pIcon: string
}

export interface PNavbarProps {
  pEntities: PEntityProps[]
  pMenuList: PMenuProps[]
  pHandleClickEntity: Function
}
