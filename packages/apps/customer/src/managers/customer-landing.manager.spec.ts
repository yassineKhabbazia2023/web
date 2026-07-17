import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@pulse/booking/constants'
import { navigateToCurrentEntityHomepage } from '@pulse/shared/guards'

import { CustomerLandingManager } from './customer-landing.manager'

const homepageRouteMock = {
  name: RouteName.HOMEPAGE,
  params: { [RouteParam.ENTITY_ID]: 1 },
}
const prospectHomepageRouteMock = {
  name: RouteName.PROSPECT_HOMEPAGE,
  params: { [RouteParam.ENTITY_ID]: 2 },
}

// Stores mocks
const userStoreMock = getStoreMock(useUserStore)

describe('CustomerLandingManager', () => {
  describe('getLandingPage', () => {
    it('should return the homepage route for single entity user', () => {
      userStoreMock.hasSingleEntity = true
      vi.mocked(navigateToCurrentEntityHomepage).mockReturnValue(homepageRouteMock as any)

      const result = CustomerLandingManager.getLandingPage()

      expect(result).toEqual(homepageRouteMock)
    })

    it('should return wallet entities tab for multi-entity user with regular entities', () => {
      userStoreMock.hasSingleEntity = false
      userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(0)

      const result = CustomerLandingManager.getLandingPage()

      expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
    })

    it('should forward booking params to wallet landing page', () => {
      userStoreMock.hasSingleEntity = false
      userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
      const query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
      }

      const result = CustomerLandingManager.getLandingPage(query)

      expect(result).toEqual({
        name: RouteName.CUSTOMER_ENTITIES,
        query,
      })
    })
  })

  describe('getCustomerLandingPage', () => {
    describe('single entity user', () => {
      beforeEach(() => {
        userStoreMock.hasSingleEntity = true
      })

      it('should return the regular homepage route without query when no booking params', () => {
        vi.mocked(navigateToCurrentEntityHomepage).mockReturnValue(homepageRouteMock as any)

        const result = CustomerLandingManager.getCustomerLandingPage({})

        expect(navigateToCurrentEntityHomepage).toHaveBeenCalled()
        expect(result).toEqual(homepageRouteMock)
      })

      it('should return the regular homepage route with booking params when present', () => {
        vi.mocked(navigateToCurrentEntityHomepage).mockReturnValue(homepageRouteMock as any)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          ...homepageRouteMock,
          query,
        })
      })

      it('should NOT forward booking params to a prospect homepage', () => {
        vi.mocked(navigateToCurrentEntityHomepage).mockReturnValue(prospectHomepageRouteMock as any)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual(prospectHomepageRouteMock)
      })

      it('should only include booking params, not other query params', () => {
        vi.mocked(navigateToCurrentEntityHomepage).mockReturnValue(homepageRouteMock as any)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          otherParam: 'ignored',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          ...homepageRouteMock,
          query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true' },
        })
      })
    })

    describe('multiple entities user', () => {
      beforeEach(() => {
        userStoreMock.hasSingleEntity = false
      })

      it('should return wallet entities tab when regular entities exist', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        userStoreMock.getProspectEntitiesCount.mockReturnValue(0)

        const result = CustomerLandingManager.getCustomerLandingPage({})

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should return wallet prospects tab when only prospects exist', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
        userStoreMock.getProspectEntitiesCount.mockReturnValue(2)

        const result = CustomerLandingManager.getCustomerLandingPage({})

        expect(result).toEqual({ name: RouteName.CUSTOMER_PROSPECTS })
      })

      it('should return wallet entities tab as fallback when both counts are 0', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
        userStoreMock.getProspectEntitiesCount.mockReturnValue(0)

        const result = CustomerLandingManager.getCustomerLandingPage({})

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should return wallet entities tab with booking params when present', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '456',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.CUSTOMER_ENTITIES,
          query,
        })
      })

      it('should return wallet prospects tab with booking params when present', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
        userStoreMock.getProspectEntitiesCount.mockReturnValue(2)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '456',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.CUSTOMER_PROSPECTS,
          query,
        })
      })

      it('should ignore empty bookingWidget param', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = { [BOOKING_QUERY_PARAM_WIDGET]: '' }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should handle array bookingWidget param by extracting first value', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: ['true'],
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.CUSTOMER_ENTITIES,
          query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true', [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123' },
        })
      })

      it('should handle array collaboratorId param by extracting first value', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: ['42', '43'],
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.CUSTOMER_ENTITIES,
          query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true', [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '42' },
        })
      })

      it('should ignore bookingWidget=false', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = { [BOOKING_QUERY_PARAM_WIDGET]: 'false' }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should ignore bookingWidget=TRUE (case-sensitive)', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = { [BOOKING_QUERY_PARAM_WIDGET]: 'TRUE' }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should ignore whitespace-only collaboratorId', () => {
        userStoreMock.getRegularEntitiesCount.mockReturnValue(2)
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '   ',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.CUSTOMER_ENTITIES,
          query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true' },
        })
      })
    })
  })

  describe('getWalletDefaultTab', () => {
    it('should return entities tab when regular entities exist', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(1)

      const result = CustomerLandingManager.getWalletDefaultTab()

      expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
    })

    it('should return prospects tab when no regular entities but prospects exist', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(1)

      const result = CustomerLandingManager.getWalletDefaultTab()

      expect(result).toEqual({ name: RouteName.CUSTOMER_PROSPECTS })
    })

    it('should fallback to entities tab when both counts are 0', () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(0)

      const result = CustomerLandingManager.getWalletDefaultTab()

      expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
    })
  })
})
