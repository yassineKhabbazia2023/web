import {
  MockEntityId,
  MockEntityData,
  getMockUserClientAccount,
  getMockUsersList,
} from '@pulse/common/mocks'

// Re-export canonical entity IDs for backwards compatibility
export const mockedAccountId = MockEntityId.BASIC
export const mockedAccountType = 'Client Company'

// Re-export canonical account data
export const mockedAccount = {
  accountId: MockEntityData.BASIC.accountId,
  name: MockEntityData.BASIC.legalName,
  accountNumber: MockEntityData.BASIC.accountNumber,
}

// User client account based on canonical BASIC entity
export const mockedUserClientAccount = getMockUserClientAccount('BASIC')

// Users list based on canonical BASIC entity
export const mockedUsersList = getMockUsersList('BASIC')
