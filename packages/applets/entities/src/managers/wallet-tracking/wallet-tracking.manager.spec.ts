import { AmplitudeService } from '@pulse/common/services/amplitude'
import { WalletTrackingManager } from './wallet-tracking.manager'
import { WalletFilterValue, WalletMenuActionValue, WalletFavoriteActivation } from './wallet-tracking.enum'

vi.mock('@pulse/common/services/amplitude')

describe('WalletTrackingManager', () => {
  describe('trackCustomFilterValidated', () => {
    it('should track with ["none"] when no filters are active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        { wallet_action_filter_value: [WalletFilterValue.NONE] },
      )
    })

    it('should track with ["favoris"] when favorite filter is active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: true,
        isCustomerRelationFilter: false,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        { wallet_action_filter_value: [WalletFilterValue.FAVORITES] },
      )
    })

    it('should track with ["en relation client"] when customer relation filter is active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: false,
        isCustomerRelationFilter: true,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        { wallet_action_filter_value: [WalletFilterValue.CUSTOMER_RELATION] },
      )
    })

    it('should track with array of both filters when both are active', () => {
      WalletTrackingManager.trackCustomFilterValidated({
        isFavoriteFilter: true,
        isCustomerRelationFilter: true,
      })

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Wallet Action Custom Filter Validated',
        { wallet_action_filter_value: [WalletFilterValue.FAVORITES, WalletFilterValue.CUSTOMER_RELATION] },
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
    it('should track menu opened event', () => {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.MENU_OPENED)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Folder Menu Requested',
        { wallet_action_menu_value: WalletMenuActionValue.MENU_OPENED },
      )
    })

    it('should track access folder event', () => {
      WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.ACCESS_FOLDER)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Wallet Action Folder Menu Requested',
        { wallet_action_menu_value: WalletMenuActionValue.ACCESS_FOLDER },
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
