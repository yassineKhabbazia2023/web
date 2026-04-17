import { reactive } from 'vue'
import { getMockedProspectWalletData } from '@entities/__mocks__'
import { useProspectsEntitiesList } from './prospect-entity.list.composable'
import { ProspectAction, ProspectColumn } from './prospect-entity.list.enums'
import { ProspectEntityListManager } from './prospect-entity.list.manager'
import { ProspectListType } from '@entities/modules/wallet/enums'
import { SortDirection } from '@pulse/common/enums'
import type { SortChangeEventData } from '@pulse/common/types'

vi.mock('./prospect-entity.list.manager')

const mockMenuElements = [{ pActionName: ProspectAction.ARCHIVE_PROSPECT, pValue: 'Delete', pIconName: 'trash', pState: 'default' }]
vi.mocked(ProspectEntityListManager.getMenuElements).mockReturnValue(mockMenuElements as any)

const createTestSetup = (prospectListType: ProspectListType = ProspectListType.PROSPECT_COLLAB) => {
  const props = reactive({
    data: [],
    prospectListType,
  }) as any
  const emit = vi.fn()
  const result = useProspectsEntitiesList(props, emit)
  return { props, emit, result }
}

describe('useProspectsEntitiesList', () => {
  describe('isColumnVisible', () => {
    it('should return true for shared columns regardless of flow', () => {
      const { result: collabResult } = createTestSetup(ProspectListType.PROSPECT_COLLAB)
      const { result: customerResult } = createTestSetup(ProspectListType.PROSPECT_CUSTOMER)

      expect(collabResult.isColumnVisible(ProspectColumn.COMPANY_NAME)).toBe(true)
      expect(collabResult.isColumnVisible(ProspectColumn.ONBOARDING_STEP)).toBe(true)
      expect(customerResult.isColumnVisible(ProspectColumn.COMPANY_NAME)).toBe(true)
      expect(customerResult.isColumnVisible(ProspectColumn.ONBOARDING_STEP)).toBe(true)
    })

    it('should return true only for the collaborator-specific action column when flow is PROSPECT_COLLAB', () => {
      const { result } = createTestSetup(ProspectListType.PROSPECT_COLLAB)

      expect(result.isColumnVisible(ProspectColumn.CAC_FOLDER)).toBe(false)
      expect(result.isColumnVisible(ProspectColumn.OPTIONS)).toBe(true)
    })

    it('should return false for collab-only columns when flow is PROSPECT_CUSTOMER', () => {
      const { result } = createTestSetup(ProspectListType.PROSPECT_CUSTOMER)

      expect(result.isColumnVisible(ProspectColumn.CAC_FOLDER)).toBe(false)
      expect(result.isColumnVisible(ProspectColumn.OPTIONS)).toBe(false)
    })
  })

  describe('menuElements', () => {
    it('should return menu elements from ProspectEntityListManager', () => {
      const { result } = createTestSetup()

      expect(result.menuElements.value).toEqual(mockMenuElements)
      expect(ProspectEntityListManager.getMenuElements).toHaveBeenCalled()
    })
  })

  describe('isArchiveDialogVisible', () => {
    it('should initially be false', () => {
      const { result } = createTestSetup()

      expect(result.isArchiveDialogVisible.value).toBe(false)
    })
  })

  describe('selectedProspect', () => {
    it('should initially be null', () => {
      const { result } = createTestSetup()

      expect(result.selectedProspect.value).toBe(null)
    })
  })

  describe('onProspectArchived', () => {
    it('should reset selectedProspect to null and emit prospect-archived event', () => {
      const { emit, result } = createTestSetup()
      const row = getMockedProspectWalletData()
      result.onToolboxItemClicked(ProspectAction.ARCHIVE_PROSPECT, row)

      result.onProspectArchived()

      expect(result.selectedProspect.value).toBe(null)
      expect(emit).toHaveBeenCalledWith('prospect-archived')
    })
  })

  describe('onToolboxItemClicked', () => {
    it('should set isArchiveDialogVisible to true when action is archiveProspect', () => {
      const { result } = createTestSetup()
      const row = getMockedProspectWalletData()

      result.onToolboxItemClicked(ProspectAction.ARCHIVE_PROSPECT, row)

      expect(result.isArchiveDialogVisible.value).toBe(true)
    })

    it('should set selectedProspect to the provided row when action is archiveProspect', () => {
      const { result } = createTestSetup()
      const row = getMockedProspectWalletData({ accountId: 42 })

      result.onToolboxItemClicked(ProspectAction.ARCHIVE_PROSPECT, row)

      expect(result.selectedProspect.value).toEqual(row)
    })

  })

  describe('handleSort', () => {
    it('should emit sort-account with descending true when order is DESCENDING', () => {
      const { emit, result } = createTestSetup()
      const sortData: SortChangeEventData = {
        column: {},
        prop: 'name',
        order: SortDirection.DESCENDING,
      }

      result.handleSort(sortData)

      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'name',
        descending: true,
      })
    })

    it('should emit sort-account with descending false when order is ASCENDING', () => {
      const { emit, result } = createTestSetup()
      const sortData: SortChangeEventData = {
        column: {},
        prop: 'date',
        order: SortDirection.ASCENDING,
      }

      result.handleSort(sortData)

      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'date',
        descending: false,
      })
    })
  })

})
