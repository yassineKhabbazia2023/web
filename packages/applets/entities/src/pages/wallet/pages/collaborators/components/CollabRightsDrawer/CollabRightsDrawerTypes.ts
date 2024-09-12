import type { ExtendedCollab } from './../../types'

/* eslint-disable no-unused-vars */
export enum CollabRightsDrawerSteps {
  ROLES,
  MANAGE_RIGHTS,
}
/* eslint-disable no-unused-vars */

export interface Role {
  id: number
  name: string
  description: string
}

export interface CollabRightsDrawerProps {
  rowData: ExtendedCollab
  hasDrawerOpened: boolean
}
