import { RouterHelpers } from './router.helpers'

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
