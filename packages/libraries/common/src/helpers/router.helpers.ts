import { RouteLocation } from 'vue-router'
import { IsRouteOrAncestorActiveParams } from './helpers.types'
import { RouteParam } from '../enums/route-param.enums'

export class RouterHelpers {
  /**
   * Checks whether the specified route has an ancestor with the given name.
   * This method inspects the route's matched array to determine if any ancestor route
   * has a name that matches the provided ancestorName.
   *
   * @param route - The route object to search for an ancestor.
   * @param ancestorName - The name of the ancestor route to look for.
   * @returns True if an ancestor with the specified name is found; otherwise, false.
   */
  static hasProvidedAncestor({ route, ancestorName }: { route: any, ancestorName: string }): boolean {
    return route.matched?.some((ancestor: any) => ancestor.name === ancestorName) || false
  }

  /**
   * Returns true if the route or any of its ancestors match the provided routesToMatch.
   * This is useful for checking if a route is active or if any of its ancestors are active.
   * @param route The route object to check
   * @param routesToMatch The list of route names to match against
   * @returns boolean
   */
  static isRouteOrAncestorActive({ route, routesToMatch }: IsRouteOrAncestorActiveParams): boolean {
    const isRouteActive = routesToMatch.includes(route.name as string)
    if (isRouteActive) {
      return true
    }
    return route.matched?.some((ancestor: any) => routesToMatch.includes(ancestor.name as string)) || false
  }

  /**
   * Gets a route parameter as an integer from the provided route.
   * @param route - The route to check.
   * @param routeParam - The parameter to parse as an integer.
   * @returns The parsed integer or null if it's not a valid number or it doesn't exist.
   */
  static getRouteParamAsInt(route: RouteLocation, routeParam: RouteParam): number | null {
    const routeParamValue = route.params[routeParam]

    // If the route parameter is undefined or null, return null
    if (routeParamValue === undefined || routeParamValue === null) {
      return null
    }

    // If the route parameter is already a number, return it directly
    if (typeof routeParamValue === 'number') {
      return routeParamValue
    }

    // If the route parameter is a string, trim it and parse it as an integer
    if (typeof routeParamValue === 'string' && routeParamValue.trim() !== '') {
      const parsed = Number(routeParamValue)
      return Number.isNaN(parsed) ? null : parsed
    }

    // If the route parameter is string[] or unexpected type, return null
    return null
  }
}
