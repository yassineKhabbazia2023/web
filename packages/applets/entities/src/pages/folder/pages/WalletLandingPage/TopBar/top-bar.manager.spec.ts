import { useUserStore } from '@pulse/common/stores'
import {
  getStoreMock,
  getMockedUser as getMockedUserCollab,
  getMockedUserInfo as getMockedUserCustomer,
} from '@pulse/common/mocks'
import { TopBarManager } from './top-bar.manager'
import { CurrentUserManager } from '@pulse/common/managers'

vi.mock('@pulse/common/managers')

const userStore = getStoreMock(useUserStore)

describe('TopBarManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isPennylaneSSODisplayed', () => {
    it('should return true when user has pennylane permission', () => {
      vi.mocked(CurrentUserManager).hasSelectedEntityPennylanePermission.mockReturnValue(true)
      expect(TopBarManager.isPennylaneSSODisplayed()).toBe(true)
    })

    it('should return false when user does not have pennylane permission', () => {
      vi.mocked(CurrentUserManager).hasSelectedEntityPennylanePermission.mockReturnValue(false)
      expect(TopBarManager.isPennylaneSSODisplayed()).toBe(false)
    })
  })

  describe('shouldDisplayCustomerSSO', () => {
    it('should return true when user is customer', () => {
      userStore.user = getMockedUserCustomer()
      expect(TopBarManager.shouldDisplayCustomerSSO()).toBe(true)
    })

    it('should return false when user is not customer', () => {
      userStore.user = getMockedUserCollab()
      expect(TopBarManager.shouldDisplayCustomerSSO()).toBe(false)
    })
  })
})
