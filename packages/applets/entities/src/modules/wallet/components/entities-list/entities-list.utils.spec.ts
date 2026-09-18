import { RouteName, RouteParam } from '@pulse/common/enums'
import { getEntityRedirectRoute } from './entities-list.utils'

describe('getEntityRedirectRoute', () => {
  it('should target the entity redirect route of the given entity', () => {
    expect(getEntityRedirectRoute(100)).toEqual({
      name: RouteName.ENTITY_REDIRECT,
      params: { [RouteParam.ENTITY_ID]: 100 },
    })
  })
})
