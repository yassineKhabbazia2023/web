interface PEntityProps {
  pIdAccount: string
  pName: string
  pIcon: string
  pColor: string
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