import type { ExtendedCollab } from './../../types'


export enum CollabRightsDrawerSteps {
  ROLES,
  MANAGE_RIGHTS,
}


export interface Role {
  id: number
  name: string
  description: string
}

export interface CollabRightsDrawerProps {
  rowData: ExtendedCollab
  hasDrawerOpened: boolean
}
