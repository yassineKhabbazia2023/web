import type { Entity } from '@kpmg/common'

export interface Delegation {
  // Move delegation type here from the delegation feature that should be merged by the time
  // This will maybe help us to create types for the history section
  account: {
    id: Entity['accountId']
  }
}
