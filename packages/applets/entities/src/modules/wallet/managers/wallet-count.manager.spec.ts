import { WalletCountManager } from './wallet-count.manager'
import { WalletTab } from '../enums'
import { useUserStore } from '@pulse/common/stores'

vi.mock('@pulse/common/stores')

describe('WalletCountManager', () => {
  describe('getCount()', () => {
    it('should return regularEntitiesCount for FOLDERS tab', () => {
      vi.mocked(useUserStore).mockReturnValue({ getRegularEntitiesCount: () => 5 } as any)

      const result = WalletCountManager.getCount(WalletTab.FOLDERS)

      expect(result).toBe(5)
    })

    it('should return regularEntitiesCount for CUSTOMER_ENTITIES tab', () => {
      vi.mocked(useUserStore).mockReturnValue({ getRegularEntitiesCount: () => 12 } as any)

      const result = WalletCountManager.getCount(WalletTab.CUSTOMER_ENTITIES)

      expect(result).toBe(12)
    })

    it('should return prospectEntitiesCount for PROSPECTS tab', () => {
      vi.mocked(useUserStore).mockReturnValue({ getProspectEntitiesCount: () => 3 } as any)

      const result = WalletCountManager.getCount(WalletTab.PROSPECTS)

      expect(result).toBe(3)
    })

    it('should return undefined for a tab without count provider', () => {
      const result = WalletCountManager.getCount(WalletTab.MANDATES)

      expect(result).toBeUndefined()
    })
  })
})
