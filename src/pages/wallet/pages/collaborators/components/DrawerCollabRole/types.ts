import type { IExtendedCollab } from './../../types'
import type { selectedRoleId } from './components/CollabRole/types'

export interface Props {
  rowData: IExtendedCollab
  hasDrawerOpened: boolean
}

export interface State {
  accessesSelected: object | undefined
  selectedRoleId: selectedRoleId
  currentStep: number
}
