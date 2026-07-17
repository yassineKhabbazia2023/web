import { WalletCountManager } from './wallet-count.manager'
import { WalletTab } from '../enums'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'

const userStoreMock = getStoreMock(useUserStore)

describe('WalletCountManager', () => {
  describe('getCount()', () => {
    it('should return regularEntitiesCount for FOLDERS tab', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(5)

      const result = WalletCountManager.getCount(WalletTab.FOLDERS)

      expect(result).toBe(5)
    })

    it('should return regularEntitiesCount for CUSTOMER_ENTITIES tab', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(12)

      const result = WalletCountManager.getCount(WalletTab.CUSTOMER_ENTITIES)

      expect(result).toBe(12)
    })

    it('should return prospectEntitiesCount for PROSPECTS tab', () => {
      userStoreMock.getProspectEntitiesCount.mockReturnValue(3)

      const result = WalletCountManager.getCount(WalletTab.PROSPECTS)

      expect(result).toBe(3)
    })

    it('should return undefined for a tab without count provider', () => {
      const result = WalletCountManager.getCount(WalletTab.MANDATES)

      expect(result).toBeUndefined()
    })
  })
})
