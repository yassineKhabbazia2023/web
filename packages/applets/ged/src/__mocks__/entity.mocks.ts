import type { Entity } from '@pulse/common/types'
import { AccountType } from '@pulse/common/enums'
import { MockEntityData } from '@pulse/common/mocks'

// Derived from the canonical BASIC entity fixture so GED specs stay aligned
// with the shared test data instead of hand-rolling their own entity.
export const defaultEntityMock: Entity = {
  ...MockEntityData.BASIC,
  accountType: AccountType.REGULAR,
}
