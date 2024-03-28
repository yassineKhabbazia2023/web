
export type Delegate = {
  id: number
  firstName: string
  lastName: string
  email: string
}

export type DelegationDetails = {
  delegate: Delegate
  isAutoDelegation: boolean
}

export interface DelegationPreviewListProps {
  delegationDetails: DelegationDetails[]
}
