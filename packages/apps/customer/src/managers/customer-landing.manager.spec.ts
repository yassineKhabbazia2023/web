import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedEntity } from '@pulse/common/mocks'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@pulse/booking/constants'

import { CustomerLandingManager } from './customer-landing.manager'

const entityMock = getMockedEntity()

// Stores mocks
const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('CustomerLandingManager', () => {
  describe('getLandingPage', () => {
    it('should return the customer landing page for single entity user', () => {
      userStoreMock.getIsSingleEntity.mockReturnValue(true)
      currentEntityStoreMock.currentEntity = entityMock as any
      const accountId = entityMock.accountId

      const result = CustomerLandingManager.getLandingPage()

      expect(result).toEqual({
        name: RouteName.HOMEPAGE,
        params: { [RouteParam.ENTITY_ID]: accountId },
      })
    })

    it('should return wallet page for multiple entities user', () => {
      userStoreMock.getIsSingleEntity.mockReturnValue(false)

      const result = CustomerLandingManager.getLandingPage()

      expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
    })

    it('should forward booking params to landing page', () => {
      userStoreMock.getIsSingleEntity.mockReturnValue(false)
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
        userStoreMock.getIsSingleEntity.mockReturnValue(true)
        currentEntityStoreMock.currentEntity = entityMock as any
      })

      it('should return entity landing page without query when no booking params', () => {
        const result = CustomerLandingManager.getCustomerLandingPage({})

        expect(result).toEqual({
          name: RouteName.HOMEPAGE,
          params: { [RouteParam.ENTITY_ID]: entityMock.accountId },
        })
      })

      it('should return entity landing page with booking params when present', () => {
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.HOMEPAGE,
          params: { [RouteParam.ENTITY_ID]: entityMock.accountId },
          query,
        })
      })

      it('should only include booking params, not other query params', () => {
        const query = {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          otherParam: 'ignored',
        }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({
          name: RouteName.HOMEPAGE,
          params: { [RouteParam.ENTITY_ID]: entityMock.accountId },
          query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true' },
        })
      })
    })

    describe('multiple entities user', () => {
      beforeEach(() => {
        userStoreMock.getIsSingleEntity.mockReturnValue(false)
      })

      it('should return wallet page without query when no booking params', () => {
        const result = CustomerLandingManager.getCustomerLandingPage({})

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should return wallet page with booking params when present', () => {
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

      it('should ignore empty bookingWidget param', () => {
        const query = { [BOOKING_QUERY_PARAM_WIDGET]: '' }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should handle array bookingWidget param by extracting first value', () => {
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
        const query = { [BOOKING_QUERY_PARAM_WIDGET]: 'false' }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should ignore bookingWidget=TRUE (case-sensitive)', () => {
        const query = { [BOOKING_QUERY_PARAM_WIDGET]: 'TRUE' }

        const result = CustomerLandingManager.getCustomerLandingPage(query)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should ignore whitespace-only collaboratorId', () => {
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
})
