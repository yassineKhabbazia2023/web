import { RedirectActionRegistry } from '@pulse/common/managers'
import { RouteName, RedirectAction } from '@pulse/common/enums'
import { DELEGATION_QUERY_PARAM_DRAWER } from '@entities/constants'
import { DelegationRedirectActionManager } from './delegation-redirect-action.manager'

beforeEach(() => {
  RedirectActionRegistry.clear()
  DelegationRedirectActionManager.registerResolvers()
})

describe('DelegationRedirectActionManager.registerResolvers', () => {
  it('should register a resolver reachable through the OPEN_DELEGATION_DRAWER action key', async () => {
    const result = await RedirectActionRegistry.resolve({
      action: RedirectAction.OPEN_DELEGATION_DRAWER,
    })

    expect(result).not.toBeNull()
  })

  describe('OPEN_DELEGATION_DRAWER resolver', () => {
    it('should redirect to LANDING with delegationDrawer=true', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: RedirectAction.OPEN_DELEGATION_DRAWER,
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' },
      })
    })

    it('should ignore any unrelated query params present on the redirect-action URL', async () => {
      const result = await RedirectActionRegistry.resolve({
        action: RedirectAction.OPEN_DELEGATION_DRAWER,
        unrelated: 'value',
      })

      expect(result).toEqual({
        name: RouteName.LANDING,
        query: { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' },
      })
    })
  })
})
