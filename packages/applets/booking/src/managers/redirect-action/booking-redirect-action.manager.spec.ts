import { RedirectActionRegistry } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@booking/constants'
import { BookingRedirectAction } from '@booking/enums/booking-redirect-action.enums'
import { BookingRedirectActionManager } from './booking-redirect-action.manager'

vi.mock('@pulse/toolbox')

beforeEach(() => {
  RedirectActionRegistry.clear()
  BookingRedirectActionManager.registerResolvers()
})

describe('BookingRedirectActionManager.registerResolvers', () => {
  it('should register a resolver reachable through the OPEN_BOOKING_WIDGET action key', async () => {
    const result = await RedirectActionRegistry.resolve({
      action: BookingRedirectAction.OPEN_BOOKING_WIDGET,
    })

    expect(result).not.toBeNull()
  })

  describe('OPEN_BOOKING_WIDGET resolver', () => {
    it('should redirect to LANDING with bookingWidget=true when no collaboratorId is provided', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: BookingRedirectAction.OPEN_BOOKING_WIDGET,
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true' },
      })
    })

    it('should forward a valid collaboratorId alongside bookingWidget=true', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: BookingRedirectAction.OPEN_BOOKING_WIDGET,
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '42',
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '42',
        },
      })
    })

    it('should extract the first value when collaboratorId is an array', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: BookingRedirectAction.OPEN_BOOKING_WIDGET,
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: ['42', '43'],
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '42',
        },
      })
    })

    it('should omit collaboratorId when the query value is empty', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: BookingRedirectAction.OPEN_BOOKING_WIDGET,
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '',
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true' },
      })
    })

    it('should ignore any unrelated query params present on the redirect-action URL', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: BookingRedirectAction.OPEN_BOOKING_WIDGET,
        unrelated: 'value',
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: { [BOOKING_QUERY_PARAM_WIDGET]: 'true' },
      })
    })
  })
})
