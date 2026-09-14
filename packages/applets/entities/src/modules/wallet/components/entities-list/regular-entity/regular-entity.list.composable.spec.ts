import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock, isMobileMockRef } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { ref } from 'vue'
import { SortDirection, AmplitudeFeatureLocalisation } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { TrackingCenter } from '@pulse/common/services/amplitude'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import {
  WalletMenuActionValue,
  WalletMenuActionType,
  WalletSortColumn,
} from '@entities/managers/wallet-tracking/wallet-tracking.enum'
import { useRegularEntitiesList } from './regular-entity.list.composable'
import type { RegularWalletData } from '@entities/modules/wallet/types'
import type { EntitiesListRegularProps, EntitiesListRegularEmit } from './regular-entity.list.types'
import { RegularEntityAction } from './regular-entity.list.enums'

const isMobileMock = isMobileMockRef

// isMobileMockRef is a plain worker-shared ref: mockReset does not touch it, so
// a test leaving it true would leak mobile mode to the next file (doctrine: shared-dom).
afterEach(() => {
  isMobileMock.value = false
})

beforeEach(() => {
  isMobileMock.value = false
  vi.spyOn(FeatureFlagManager, 'isFavoriteSortActivated').mockReturnValue(true)
  vi.spyOn(WalletTrackingManager, 'trackFavoriteRequest').mockImplementation(() => undefined)
  vi.spyOn(WalletTrackingManager, 'trackColumnSortRequested').mockImplementation(() => undefined)
  vi.spyOn(WalletTrackingManager, 'trackFolderMenuAction').mockImplementation(() => undefined)
  vi.spyOn(WalletTrackingManager, 'trackWalletSearched').mockImplementation(() => undefined)
  vi.spyOn(TrackingCenter, 'trackHomepageConsulted').mockImplementation(() => undefined)
})

const _userStore = getStoreMock(useUserStore)

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

const defaultProps: EntitiesListRegularProps = {
  data: [buildRow()],
}

const createEmit = (): EntitiesListRegularEmit => vi.fn() as unknown as EntitiesListRegularEmit

const setupComposable = (
  propsOverride: Partial<EntitiesListRegularProps> = {},
  emit?: EntitiesListRegularEmit,
  selectedFolderIds = ref<number[]>([]),
) => {
  const props = { ...defaultProps, ...propsOverride }
  const emitFn = emit ?? createEmit()
  const [result, app] = withSetup(() => useRegularEntitiesList(props, emitFn, selectedFolderIds))
  return { result, app, emit: emitFn, selectedFolderIds }
}

describe('useRegularEntitiesList', () => {
  describe('callHandleAddFavorite', () => {
    it('emits add-favorite and tracks favorite request', () => {
      const { result, app, emit } = setupComposable()

      result.callHandleAddFavorite(100, true)

      expect(vi.mocked(WalletTrackingManager.trackFavoriteRequest)).toHaveBeenCalledWith(true)
      expect(emit).toHaveBeenCalledWith('add-favorite', 100, true)

      app.unmount()
    })
  })

  describe('handleSort', () => {
    it('emits sort-account with correct criteria and tracks column sort', () => {
      const { result, app, emit } = setupComposable()

      result.handleSort({ prop: 'companyName', order: SortDirection.DESCENDING, column: {} as any })

      expect(vi.mocked(WalletTrackingManager.trackColumnSortRequested)).toHaveBeenCalledWith(WalletSortColumn.COMPANY_NAME)
      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'companyName',
        descending: true,
      })

      app.unmount()
    })

    it('emits sort-account with ascending when order is not descending', () => {
      const { result, app, emit } = setupComposable()

      result.handleSort({ prop: 'city', order: SortDirection.ASCENDING, column: {} as any })

      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'city',
        descending: false,
      })

      app.unmount()
    })

    it('emits sort-account and tracks column sort for the lastActivityDate column', () => {
      const { result, app, emit } = setupComposable()

      result.handleSort({ prop: 'lastActivityDate', order: SortDirection.DESCENDING, column: {} as any })

      expect(vi.mocked(WalletTrackingManager.trackColumnSortRequested)).toHaveBeenCalledWith(WalletSortColumn.LAST_ACTIVITY_DATE)
      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'lastActivityDate',
        descending: true,
      })

      app.unmount()
    })

    it('does not track column sort when prop is not in tracking map', () => {
      const { result, app } = setupComposable()

      result.handleSort({ prop: 'unknownProp', order: SortDirection.ASCENDING, column: {} as any })

      expect(vi.mocked(WalletTrackingManager.trackColumnSortRequested)).not.toHaveBeenCalled()

      app.unmount()
    })

    it('emits sort-account and tracks column sort for the isFavorite column', () => {
      const { result, app, emit } = setupComposable()

      result.handleSort({ prop: 'isFavorite', order: SortDirection.DESCENDING, column: {} as any })

      expect(vi.mocked(WalletTrackingManager.trackColumnSortRequested)).toHaveBeenCalledWith(WalletSortColumn.FAVORITE)
      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: 'isFavorite',
        descending: true,
      })

      app.unmount()
    })

    it('emits an empty field and does not track when the sort is cleared', () => {
      const { result, app, emit } = setupComposable()

      result.handleSort({ prop: 'isFavorite', order: null, column: {} as any })

      expect(vi.mocked(WalletTrackingManager.trackColumnSortRequested)).not.toHaveBeenCalled()
      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: '',
        descending: false,
      })

      app.unmount()
    })

    it('emits an empty field and does not track when the sort is cleared on any other column', () => {
      const { result, app, emit } = setupComposable()

      result.handleSort({ prop: 'companyName', order: null, column: {} as any })

      expect(vi.mocked(WalletTrackingManager.trackColumnSortRequested)).not.toHaveBeenCalled()
      expect(emit).toHaveBeenCalledWith('sort-account', {
        field: '',
        descending: false,
      })

      app.unmount()
    })
  })

  describe('isSortedByFavorite', () => {
    it('is true when the current sorting field is isFavorite', () => {
      const { result, app } = setupComposable({ sorting: { field: 'isFavorite', descending: true } })

      expect(result.isSortedByFavorite.value).toBe(true)

      app.unmount()
    })

    it('is false when another column is sorted', () => {
      const { result, app } = setupComposable({ sorting: { field: 'companyName', descending: false } })

      expect(result.isSortedByFavorite.value).toBe(false)

      app.unmount()
    })

    it('is false when no sorting is applied', () => {
      const { result, app } = setupComposable()

      expect(result.isSortedByFavorite.value).toBe(false)

      app.unmount()
    })

    it('is false when the favorite sort feature is disabled', () => {
      vi.mocked(FeatureFlagManager.isFavoriteSortActivated).mockReturnValue(false)

      const { result, app } = setupComposable({ sorting: { field: 'isFavorite', descending: true } })

      expect(result.isSortedByFavorite.value).toBe(false)

      app.unmount()
    })
  })

  describe('isLastActivityFeatureActivated', () => {
    it('exposes the last activity feature flag to the list', () => {
      vi.spyOn(FeatureFlagManager, 'isLastActivityFeatureActivated').mockReturnValue(true)

      const { result, app } = setupComposable()

      expect(result.isLastActivityFeatureActivated.value).toBe(true)

      app.unmount()
    })
  })

  describe('favoriteSortable', () => {
    it('makes the favorite column sortable when the feature is activated', () => {
      const { result, app } = setupComposable()

      expect(result.favoriteSortable.value).toBe('custom')

      app.unmount()
    })

    it('keeps the favorite column not sortable when the feature is disabled', () => {
      vi.mocked(FeatureFlagManager.isFavoriteSortActivated).mockReturnValue(false)

      const { result, app } = setupComposable()

      expect(result.favoriteSortable.value).toBe(false)

      app.unmount()
    })
  })

  describe('favoriteDefaultSort', () => {
    it('returns the favorite default sort when the list is already sorted by favorite', () => {
      const { result, app } = setupComposable({ sorting: { field: 'isFavorite', descending: true } })

      expect(result.favoriteDefaultSort.value).toEqual({
        prop: 'isFavorite',
        order: SortDirection.DESCENDING,
      })

      app.unmount()
    })

    it('returns undefined when the list is not sorted by favorite', () => {
      const { result, app } = setupComposable({ sorting: { field: 'companyName', descending: false } })

      expect(result.favoriteDefaultSort.value).toBeUndefined()

      app.unmount()
    })
  })

  describe('onDirectFolderAccess', () => {
    it('emits access and tracks homepage consulted', () => {
      const { result, app, emit } = setupComposable()

      result.onDirectFolderAccess(100)

      expect(vi.mocked(TrackingCenter.trackHomepageConsulted)).toHaveBeenCalledWith(AmplitudeFeatureLocalisation.PORTEFEUILLE)
      expect(emit).toHaveBeenCalledWith('access', 100)

      app.unmount()
    })
  })

  describe('onToolboxVisibleChange', () => {
    it('tracks menu opened when visible is true', () => {
      const { result, app } = setupComposable()

      result.onToolboxVisibleChange(true)

      expect(vi.mocked(WalletTrackingManager.trackFolderMenuAction))
        .toHaveBeenCalledWith(WalletMenuActionValue.MENU_OPENED, WalletMenuActionType.UNITARY)

      app.unmount()
    })

    it('does not track when visible is false', () => {
      const { result, app } = setupComposable()

      result.onToolboxVisibleChange(false)

      expect(vi.mocked(WalletTrackingManager.trackFolderMenuAction)).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('onToolboxItemClicked', () => {
    const row = buildRow({
      accountId: 200,
      accountNumber: 'ACC-200',
      name: 'Deploy Entity',
      isCustomerRelation: true,
    })

    it('emits click-deploy for deploy action', () => {
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.DEPLOY, row)

      expect(emit).toHaveBeenCalledWith('click-deploy', 200, 'ACC-200', 'Deploy Entity')

      app.unmount()
    })

    it('emits access for access action and tracks it', () => {
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.ACCESS, row)

      expect(vi.mocked(WalletTrackingManager.trackFolderMenuAction))
        .toHaveBeenCalledWith(WalletMenuActionValue.ACCESS_FOLDER, WalletMenuActionType.UNITARY)
      expect(emit).toHaveBeenCalledWith('access', 200)

      app.unmount()
    })

    it('emits displayDelegationDrawer for delegateFolder action', () => {
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.DELEGATE_FOLDER, row)

      expect(emit).toHaveBeenCalledWith('displayDelegationDrawer', row)

      app.unmount()
    })

    it('emits displayRemoveCurrentUserFromFolderModal for removeCurrentUserFromFolder action', () => {
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.REMOVE_CURRENT_USER_FROM_FOLDER, row)

      expect(emit).toHaveBeenCalledWith('displayRemoveCurrentUserFromFolderModal', row)

      app.unmount()
    })

    it('emits displayResendActivationEmailDrawer for retryMassActivationEmail action', () => {
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.RETRY_MASS_ACTIVATION_EMAIL, row)

      expect(emit).toHaveBeenCalledWith('displayResendActivationEmailDrawer', row)

      app.unmount()
    })

    it('emits displayCustomerRelationDrawer for declareCustomerRelation action', () => {
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.DECLARE_CUSTOMER_RELATION, row)

      expect(vi.mocked(WalletTrackingManager.trackFolderMenuAction))
        .toHaveBeenCalledWith(WalletMenuActionValue.DECLARE_CUSTOMER_RELATION, WalletMenuActionType.UNITARY)
      expect(emit).toHaveBeenCalledWith('displayCustomerRelationDrawer', row, true)

      app.unmount()
    })

    it('emits displayCustomerRelationDrawer for removeCustomerRelation action', () => {
      const customerRelationRow = buildRow({ isCustomerRelation: true })
      const { result, app, emit } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.REMOVE_CUSTOMER_RELATION, customerRelationRow)

      expect(vi.mocked(WalletTrackingManager.trackFolderMenuAction))
        .toHaveBeenCalledWith(WalletMenuActionValue.REMOVE_CUSTOMER_RELATION, WalletMenuActionType.UNITARY)
      expect(emit).toHaveBeenCalledWith(
        'displayCustomerRelationDrawer',
        customerRelationRow,
        false,
      )

      app.unmount()
    })

    it('does not track when action is not in tracking map', () => {
      const { result, app } = setupComposable()

      result.onToolboxItemClicked(RegularEntityAction.DEPLOY, row)

      expect(vi.mocked(WalletTrackingManager.trackFolderMenuAction)).not.toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('toggleSelectedFolder', () => {
    it('adds selected folder id when folder is not selected', () => {
      const row = buildRow({
        accountId: 300,
        accountNumber: 'ACC-300',
        name: 'Selected Entity',
        owner: {
          contactId: 2,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@test.com',
          initials: 'JD',
          avatarColor: 'cyan',
        },
      })

      const { result, app, selectedFolderIds } = setupComposable()

      result.toggleSelectedFolder(row.accountId)

      expect(selectedFolderIds.value).toStrictEqual([300])

      app.unmount()
    })

    it('removes selected folder id when folder is already selected', () => {
      const row = buildRow()
      const { result, app, selectedFolderIds } = setupComposable()

      result.toggleSelectedFolder(row.accountId)
      result.toggleSelectedFolder(row.accountId)

      expect(selectedFolderIds.value).toStrictEqual([])

      app.unmount()
    })

    it('keeps other selected folder ids when toggling one folder', () => {
      const row = buildRow()
      const selectedFolderIds = ref<number[]>([200])
      const { result, app } = setupComposable({}, undefined, selectedFolderIds)

      result.toggleSelectedFolder(row.accountId)

      expect(selectedFolderIds.value).toStrictEqual([200, 100])
      app.unmount()
    })
  })

  describe('areAllFoldersSelected', () => {
    it('is false when no folder from the current page is selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const { result, app } = setupComposable({ data: rows })

      expect(result.areAllFoldersSelected.value).toBe(false)

      app.unmount()
    })

    it('is false when only some folders from the current page are selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const selectedFolderIds = ref<number[]>([100])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      expect(result.areAllFoldersSelected.value).toBe(false)

      app.unmount()
    })

    it('is true when every folder from the current page is selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const selectedFolderIds = ref<number[]>([100, 200])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      expect(result.areAllFoldersSelected.value).toBe(true)

      app.unmount()
    })

    it('is false when the current page has no rows', () => {
      const { result, app } = setupComposable({ data: [] })

      expect(result.areAllFoldersSelected.value).toBe(false)

      app.unmount()
    })
  })

  describe('isFoldersSelectionIndeterminate', () => {
    it('is false when no folder from the current page is selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const { result, app } = setupComposable({ data: rows })

      expect(result.isFoldersSelectionIndeterminate.value).toBe(false)

      app.unmount()
    })

    it('is true when only some folders from the current page are selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const selectedFolderIds = ref<number[]>([100])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      expect(result.isFoldersSelectionIndeterminate.value).toBe(true)

      app.unmount()
    })

    it('is false when every folder from the current page is selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const selectedFolderIds = ref<number[]>([100, 200])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      expect(result.isFoldersSelectionIndeterminate.value).toBe(false)

      app.unmount()
    })
  })

  describe('toggleAllSelectedFolders', () => {
    it('selects every folder from the current page when none is selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const { result, app, selectedFolderIds } = setupComposable({ data: rows })

      result.toggleAllSelectedFolders()

      expect(selectedFolderIds.value).toStrictEqual([100, 200])

      app.unmount()
    })

    it('deselects every folder from the current page when all are selected', () => {
      const rows = [buildRow({ accountId: 100 }), buildRow({ accountId: 200 })]
      const selectedFolderIds = ref<number[]>([100, 200])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      result.toggleAllSelectedFolders()

      expect(selectedFolderIds.value).toStrictEqual([])

      app.unmount()
    })

    it('keeps folders selected from another page when selecting the current page', () => {
      const rows = [buildRow({ accountId: 100 })]
      const selectedFolderIds = ref<number[]>([999])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      result.toggleAllSelectedFolders()

      expect(selectedFolderIds.value).toStrictEqual([999, 100])

      app.unmount()
    })

    it('only deselects the current page folders, keeping folders selected from another page', () => {
      const rows = [buildRow({ accountId: 100 })]
      const selectedFolderIds = ref<number[]>([999, 100])
      const { result, app } = setupComposable({ data: rows }, undefined, selectedFolderIds)

      result.toggleAllSelectedFolders()

      expect(selectedFolderIds.value).toStrictEqual([999])

      app.unmount()
    })
  })

  describe('isFolderSelected', () => {
    it('returns true when row id is selected', () => {
      const selectedFolderIds = ref<number[]>([100])
      const { result, app } = setupComposable({}, undefined, selectedFolderIds)

      expect(result.isFolderSelected(100)).toBe(true)

      app.unmount()
    })

    it('returns false when row id is not selected', () => {
      const selectedFolderIds = ref<number[]>([200])
      const { result, app } = setupComposable({}, undefined, selectedFolderIds)

      expect(result.isFolderSelected(100)).toBe(false)

      app.unmount()
    })
  })

  describe('onRowClick', () => {
    beforeEach(() => {
      isMobileMock.value = false
    })

    it('emits access on mobile', () => {
      isMobileMock.value = true
      const { result, app, emit } = setupComposable()

      result.onRowClick(buildRow({ accountId: 100 }))

      expect(emit).toHaveBeenCalledWith('access', 100)

      app.unmount()
    })

    it('does not emit access on desktop', () => {
      isMobileMock.value = false
      const { result, app, emit } = setupComposable()

      result.onRowClick(buildRow({ accountId: 100 }))

      expect(emit).not.toHaveBeenCalledWith('access', 100)

      app.unmount()
    })

    it('calls trackWalletSearch regardless of mobile', () => {
      const { result, app } = setupComposable({ searchValue: 'test' })

      result.onRowClick(buildRow({ name: 'test entity' }))

      expect(vi.mocked(WalletTrackingManager.trackWalletSearched)).toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('trackWalletSearch', () => {
    it('does not track when searchValue is empty', () => {
      const { result, app } = setupComposable({ searchValue: '' })

      result.trackWalletSearch(buildRow())

      expect(vi.mocked(WalletTrackingManager.trackWalletSearched)).not.toHaveBeenCalled()

      app.unmount()
    })

    it('does not track when searchValue is undefined', () => {
      const { result, app } = setupComposable()

      result.trackWalletSearch(buildRow())

      expect(vi.mocked(WalletTrackingManager.trackWalletSearched)).not.toHaveBeenCalled()

      app.unmount()
    })

    it('tracks with matching field labels for several matches', () => {
      const row = buildRow({
        name: 'Société ABC',
        accountNumber: '12345',
        owner: {
          contactId: 1,
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'abc@email.com',
          initials: 'JD',
          avatarColor: 'cyan',
        },
      })
      const { result, app } = setupComposable({ searchValue: 'abc' })

      result.trackWalletSearch(row)

      expect(vi.mocked(WalletTrackingManager.trackWalletSearched)).toHaveBeenCalledWith(
        'abc',
        expect.arrayContaining(['raison sociale', 'email']),
      )

      app.unmount()
    })

    it('tracks with single match label for a single match', () => {
      const row = buildRow({
        name: 'Société ABC',
        accountNumber: '12345',
        owner: {
          contactId: 1,
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@email.com',
          initials: 'JD',
          avatarColor: 'cyan',
        },
      })
      const { result, app } = setupComposable({ searchValue: 'dupont' })

      result.trackWalletSearch(row)

      expect(vi.mocked(WalletTrackingManager.trackWalletSearched)).toHaveBeenCalledWith('dupont', ['nom'])

      app.unmount()
    })

    it('tracks with empty array when no fields match', () => {
      const row = buildRow({
        name: 'Société XYZ',
        accountNumber: '99999',
        owner: {
          contactId: 1,
          firstName: 'Sousou',
          lastName: 'Martin',
          email: 'martin@email.com',
          initials: 'SM',
          avatarColor: 'cyan',
        },
      })
      const { result, app } = setupComposable({ searchValue: 'foobar' })

      result.trackWalletSearch(row)

      expect(vi.mocked(WalletTrackingManager.trackWalletSearched)).toHaveBeenCalledWith('foobar', [])

      app.unmount()
    })
  })
})
