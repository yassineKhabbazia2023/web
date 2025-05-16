import { IsRouteOrAncestorActiveParams } from './helpers.types'

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
}
