import { RouterHelpers } from './router.helpers'

describe('RouterHelpers.getMetaFromKey', () => {
  it('should return meta information when provided with a valid route object', () => {
    const route = { meta: { title: 'Home' } } as any
    const meta = RouterHelpers.getMetaFromKey({ route, metaKey: 'title' })
    expect(meta).toEqual('Home')
  })

  it('should return undefined if no meta is defined on the route', () => {
    const route = {} as any
    const meta = RouterHelpers.getMetaFromKey({ route, metaKey: 'title' })
    expect(meta).toEqual(undefined)
  })

  it('should return ancestor meta when provided in an ancestor', () => {
    const route = { matched: [{ name: 'ancestor', meta: { title: 'Ancestor Title' } }] } as any
    const meta = RouterHelpers.getMetaFromKey({ route, metaKey: 'title', includeAncestor: true })
    expect(meta).toEqual('Ancestor Title')
  })

  it('should return undefined if no meta is defined on the route or ancestors', () => {
    const route = { matched: [] } as any
    const meta = RouterHelpers.getMetaFromKey({ route, metaKey: 'title', includeAncestor: true })
    expect(meta).toEqual(undefined)
  })

  it('should return route meta (and not ancestor one) when provided in route AND in ancestor', () => {
    const route = { meta: { title: 'Route Title' }, matched: [{ name: 'ancestor', meta: { title: 'Ancestor Title' } }] } as any
    const meta = RouterHelpers.getMetaFromKey({ route, metaKey: 'title', includeAncestor: true })
    expect(meta).toEqual('Route Title')
  })
})

describe('RouterHelpers.isRouteOrAncestorActive', () => {
  it('should return true if the route is active', () => {
    const route = { name: 'activeRoute' } as any
    const routesToMatch = ['activeRoute']
    const isActive = RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch })
    expect(isActive).toBe(true)
  })

  it('should return false if the route is not active', () => {
    const route = { name: 'inactiveRoute' } as any
    const routesToMatch = ['activeRoute']
    const isActive = RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch })
    expect(isActive).toBe(false)
  })

  it('should return true if an ancestor route is active', () => {
    const route = { matched: [{ name: 'ancestorRoute' }] } as any
    const routesToMatch = ['ancestorRoute']
    const isActive = RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch })
    expect(isActive).toBe(true)
  })

  it('should return false if no route or ancestor matches', () => {
    const route = { matched: [] } as any
    const routesToMatch = ['nonExistentRoute']
    const isActive = RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch })
    expect(isActive).toBe(false)
  })
})
