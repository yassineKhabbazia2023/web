import { AmplitudeService } from '@pulse/common/services/amplitude'
import { WalletTrackingManager } from './wallet-tracking.manager'
import {
  WalletFilterType,
  WalletActivityFilterValue,
  WalletMenuActionValue,
  WalletMenuActionType,
  WalletFavoriteActivation,
  WalletMissionTypeFilterValue,
  WalletDeploymentStatusFilterValue,
} from './wallet-tracking.enum'
import { MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import { LastActivityPeriodInDays } from '@entities/enums'

describe('WalletTrackingManager', () => {
  describe('trackCustomFilterValidated', () => {
    it('should track with the ["none"] type and no value when no filters are active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.NONE],
          wallet_action_filter_value: [],
        },
      )
    })

    it('should track with ["favoris"] type and no value when favorite filter is active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: true,
        isCustomerRelationFilter: false,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.FAVORITES],
          wallet_action_filter_value: [],
        },
      )
    })

    it('should track with ["en relation client"] type and no value when customer relation filter is active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: true,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.CUSTOMER_RELATION],
          wallet_action_filter_value: [],
        },
      )
    })

    it('should track with array of both filter types when both are active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: true,
        isCustomerRelationFilter: true,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.FAVORITES, WalletFilterType.CUSTOMER_RELATION],
          wallet_action_filter_value: [],
        },
      )
    })

    it('should track the mission type labels selected', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        missionTypeFilter: [MISSION_TYPE.TENUE, MISSION_TYPE.REVISION, MISSION_TYPE.NOT_SPECIFIED],
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.MISSION_TYPE],
          wallet_action_filter_value: [
            WalletMissionTypeFilterValue.TENUE,
            WalletMissionTypeFilterValue.REVISION,
            WalletMissionTypeFilterValue.NOT_SPECIFIED,
          ],
        },
      )
    })

    it('should track a single mission type label', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        missionTypeFilter: [MISSION_TYPE.TENUE],
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.MISSION_TYPE],
          wallet_action_filter_value: [WalletMissionTypeFilterValue.TENUE],
        },
      )
    })

    it('should track an unknown mission type as its raw value', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        missionTypeFilter: ['UnknownMission'],
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.MISSION_TYPE],
          wallet_action_filter_value: ['UnknownMission'],
        },
      )
    })

    it('should track the deployment status labels instead of their raw ids', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        deploymentStatusFilter: [EntityStatus.TO_DEPLOY.toString(), EntityStatus.IN_PROGRESS.toString()],
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.STATUS],
          wallet_action_filter_value: [
            WalletDeploymentStatusFilterValue.TO_DEPLOY,
            WalletDeploymentStatusFilterValue.IN_PROGRESS,
          ],
        },
      )
    })

    it('should track the last activity filter as a category and its period as the value', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        lastActivityPeriodFilter: LastActivityPeriodInDays.LAST_THIRTY_DAYS,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [WalletFilterType.LAST_ACTIVITY],
          wallet_action_filter_value: [WalletActivityFilterValue.THIRTY_DAYS],
        },
      )
    })

    it('should track mission types and statuses as separate type entries and real values when both are active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: true,
        isCustomerRelationFilter: false,
        missionTypeFilter: [MISSION_TYPE.TENUE, MISSION_TYPE.REVISION],
        deploymentStatusFilter: [EntityStatus.CONNECTED.toString()],
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        {
          wallet_action_filter_type: [
            WalletFilterType.FAVORITES,
            WalletFilterType.MISSION_TYPE,
            WalletFilterType.STATUS,
          ],
          wallet_action_filter_value: [
            WalletMissionTypeFilterValue.TENUE,
            WalletMissionTypeFilterValue.REVISION,
            WalletDeploymentStatusFilterValue.CONNECTED,
          ],
        },
      )
    })
  })

  describe('trackStatusClicked', () => {
    it('should track status clicked event', () => {
      WalletTrackingManager.trackStatusClicked('A déployer')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Status Clicked',
        { wallet_action_status_value: 'A déployer' },
      )
    })
  })

  describe('trackFolderMenuAction', () => {
    it('should track menu opened event as a unitary action', () => {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.MENU_OPENED, WalletMenuActionType.UNITARY)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Folder Menu Requested',
        {
          wallet_action_menu_type: WalletMenuActionType.UNITARY,
          wallet_action_menu_value: WalletMenuActionValue.MENU_OPENED,
        },
      )
    })

    it('should track access folder event as a unitary action', () => {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.ACCESS_FOLDER, WalletMenuActionType.UNITARY)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Folder Menu Requested',
        {
          wallet_action_menu_type: WalletMenuActionType.UNITARY,
          wallet_action_menu_value: WalletMenuActionValue.ACCESS_FOLDER,
        },
      )
    })

    it('should track a global action', () => {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.DELEGATE_WALLET, WalletMenuActionType.GLOBAL)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Folder Menu Requested',
        {
          wallet_action_menu_type: WalletMenuActionType.GLOBAL,
          wallet_action_menu_value: WalletMenuActionValue.DELEGATE_WALLET,
        },
      )
    })

    it('should track a bulk action', () => {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.REMOVE_FROM_FOLDERS, WalletMenuActionType.BULK)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Folder Menu Requested',
        {
          wallet_action_menu_type: WalletMenuActionType.BULK,
          wallet_action_menu_value: WalletMenuActionValue.REMOVE_FROM_FOLDERS,
        },
      )
    })
  })

  describe('trackFavoriteRequest', () => {
    it('should track activate when adding to favorites', () => {
      WalletTrackingManager.trackFavoriteRequest(true)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Favorite Request',
        { wallet_action_favorite_activation: WalletFavoriteActivation.ACTIVATE },
      )
    })

    it('should track deactivate when removing from favorites', () => {
      WalletTrackingManager.trackFavoriteRequest(false)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Favorite Request',
        { wallet_action_favorite_activation: WalletFavoriteActivation.DEACTIVATE },
      )
    })
  })

  describe('trackPaginationSizeChanged', () => {
    it('should track pagination size change', () => {
      WalletTrackingManager.trackPaginationSizeChanged(30)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Pagination Requested',
        { wallet_action_pagination_size: 30 },
      )
    })
  })

  describe('trackPaginationPageClicked', () => {
    it('should track pagination page click', () => {
      WalletTrackingManager.trackPaginationPageClicked(5)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Pagination Consulted',
        { wallet_action_pagination_page: 5 },
      )
    })
  })

  describe('trackColumnSortRequested', () => {
    it('should track column sort request', () => {
      WalletTrackingManager.trackColumnSortRequested('Raison sociale')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Column Sort Requested',
        { wallet_action_sort_column: 'Raison sociale' },
      )
    })
  })

  describe('trackSearchResearched', () => {
    it('should track search event with term and type list', () => {
      WalletTrackingManager.trackWalletSearched('test', ['raison sociale', 'email'])
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Search Researched',
        {
          wallet_action_search_term: 'test',
          wallet_action_search_type: ['raison sociale', 'email'],
        },
      )
    })

    it('should track search event with empty type list', () => {
      WalletTrackingManager.trackWalletSearched('foo', [])
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Search Researched',
        {
          wallet_action_search_term: 'foo',
          wallet_action_search_type: [],
        },
      )
    })

    it('should track search event with empty string as term', () => {
      WalletTrackingManager.trackWalletSearched('', ['code client'])
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Search Researched',
        {
          wallet_action_search_term: '',
          wallet_action_search_type: ['code client'],
        },
      )
    })
  })
})
