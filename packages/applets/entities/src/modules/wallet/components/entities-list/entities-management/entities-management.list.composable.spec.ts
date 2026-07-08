import { SortDirection } from '@pulse/common/enums'
import { EntitiesManagementListManager } from './entities-management.list.manager'
import { useEntitiesManagementList } from './entities-management.list.composable'
import type { EntitiesManagementListEmit } from './entities-management.list.types'
import type { RegularWalletData } from '../../../types/wallet-data.types'
import { EntitiesManagementAction } from './entities-management.list.enums'

vi.mock('./entities-management.list.manager')

const buildRow = (overrides: Partial<RegularWalletData> = {}): RegularWalletData => ({
  owner: {
    contactId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    initials: 'JD',
    avatarColor: 'orange',
  },
  city: 'Paris',
  hub: 'Hub1',
  deploymentStatus: 'deployed' as any,
  id: '1',
  accountId: 100,
  accountNumber: 'ACC-100',
  name: 'Test Entity',
  isFavorite: false,
  isCustomerRelation: false,
  lastActivityDate: null,
  ...overrides,
})

const createTestSetup = () => {
  const emit = vi.fn() as unknown as EntitiesManagementListEmit
  const result = useEntitiesManagementList(emit)
  return { emit: emit as unknown as ReturnType<typeof vi.fn>, result }
}

describe('useEntitiesManagementList', () => {
  describe('menuElements', () => {
    it('should return empty array when getMenuElements returns empty', () => {
      vi.mocked(EntitiesManagementListManager.getMenuElements).mockReturnValue([])
      const { result } = createTestSetup()

      expect(result.menuElements.value).toEqual([])
      expect(vi.mocked(EntitiesManagementListManager.getMenuElements)).toHaveBeenCalled()
    })

    it('should call EntitiesManagementListManager.getMenuElements', () => {
      const mockMenuItems = [{ pActionName: 'manageAccountRights', pValue: 'test' }]
      vi.mocked(EntitiesManagementListManager.getMenuElements).mockReturnValue(mockMenuItems as any)

      const { result } = createTestSetup()

      expect(result.menuElements.value).toEqual(mockMenuItems)
    })
  })

  describe('isToolboxDisabled', () => {
    it('should return true when menuElements is empty', () => {
      vi.mocked(EntitiesManagementListManager.getMenuElements).mockReturnValue([])
      const { result } = createTestSetup()

      expect(result.isToolboxDisabled.value).toBe(true)
    })

    it('should return false when menuElements has items', () => {
      vi.mocked(EntitiesManagementListManager.getMenuElements).mockReturnValue([
        { pActionName: 'manageAccountRights', pValue: 'test' } as any,
      ])
      const { result } = createTestSetup()

      expect(result.isToolboxDisabled.value).toBe(false)
    })
  })

  describe('handleSort', () => {
    it('should emit sort-account with descending true when order is DESCENDING', () => {
      const { emit, result } = createTestSetup()

      result.handleSort({ prop: 'name', order: SortDirection.DESCENDING, column: {} as any })

      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'name',
        descending: true,
      })
    })

    it('should emit sort-account with descending false when order is ASCENDING', () => {
      const { emit, result } = createTestSetup()

      result.handleSort({ prop: 'city', order: SortDirection.ASCENDING, column: {} as any })

      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'city',
        descending: false,
      })
    })
  })

  describe('onDirectFolderAccess', () => {
    it('should emit access with accountId', () => {
      const { emit, result } = createTestSetup()

      result.onDirectFolderAccess(100)

      expect(emit).toHaveBeenCalledWith('access', 100)
    })
  })

  describe('onToolboxItemClicked', () => {
    const row = buildRow({
      accountId: 200,
      accountNumber: 'ACC-200',
      name: 'Management Entity',
    })

    it('should emit displayAccountRightsDrawer for manageAccountRights action', () => {
      const { emit, result } = createTestSetup()

      result.onToolboxItemClicked(EntitiesManagementAction.MANAGE_ACCOUNT_RIGHTS, row)

      expect(emit).toHaveBeenCalledWith('displayAccountRightsDrawer', row)
    })

    it('should emit displayResendActivationEmailDrawer for retryMassActivationEmail action', () => {
      const { emit, result } = createTestSetup()

      result.onToolboxItemClicked(EntitiesManagementAction.RETRY_MASS_ACTIVATION_EMAIL, row)

      expect(emit).toHaveBeenCalledWith('displayResendActivationEmailDrawer', row)
    })
  })
})
