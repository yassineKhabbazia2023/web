import { RouteParam } from '../enums/route-param.enums'
import { RouterHelpers } from './router.helpers'

describe('RouterHelpers', () => {
  describe('RouterHelpers.hasProvidedAncestor', () => {
    it('should return true if the ancestor exists', () => {
      const route = { matched: [{ name: 'ancestorRoute' }] } as any
      const ancestorName = 'ancestorRoute'
      const hasAncestor = RouterHelpers.hasProvidedAncestor({ route, ancestorName })
      expect(hasAncestor).toBe(true)
    })

    it('should return false if the ancestor does not exist', () => {
      const route = { matched: [{ name: 'otherRoute' }] } as any
      const ancestorName = 'ancestorRoute'
      const hasAncestor = RouterHelpers.hasProvidedAncestor({ route, ancestorName })
      expect(hasAncestor).toBe(false)
    })

    it('should return false if no ancestors are present', () => {
      const route = { matched: [] } as any
      const ancestorName = 'ancestorRoute'
      const hasAncestor = RouterHelpers.hasProvidedAncestor({ route, ancestorName })
      expect(hasAncestor).toBe(false)
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

  describe('RouterHelpers.getRouteParamAsInt', () => {
    it('should return the number when param is a valid number string', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: '123' } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBe(123)
    })

    it('should return the number when param is already a number', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: 456 } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBe(456)
    })

    it('should return null when param does not exist', () => {
      const route = { params: {} } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })

    it('should return null when param is null', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: null } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })

    it('should return null when param is undefined', () => {
      const route = { params: { id: undefined } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })

    it('should return null when param is an empty string', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: '' } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })

    it('should return null when param is a string that does not represent a valid number', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: '123abc' } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })

    it('should return null when param is a whitespace string', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: '   ' } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })

    it('should return null when param is an array', () => {
      const route = { params: { [RouteParam.ENTITY_ID]: ['123'] } } as any
      const result = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
      expect(result).toBeNull()
    })
  })
})
