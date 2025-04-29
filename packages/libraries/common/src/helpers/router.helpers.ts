import { GetMetaFromKeyParams, IsRouteOrAncestorActiveParams } from './helpers.types'

export class RouterHelpers {
  /**
   * Retrieves vue-router meta from a route based on the provided meta key.
   * Will return the metadata from the route itself if it exists.
   * Otherwise it will check the matched ancestor routes and return the first one found by order of closest to farthest.
   * Meaning the closest you are to the route ancestry (or the route itself), the more important the meta are
   *
   * @param route The route object to retrieve metadata from.
   * @param metaKey The key of the metadata to retrieve.
   * @param includeAncestor Whether to include ancestor routes in the search for metadata.
   * @returns The metadata associated with the given key or undefined if not found.
   */
  static getMetaFromKey({ route, metaKey, includeAncestor }: GetMetaFromKeyParams): any {
    if(route.meta?.[metaKey]) {
      return route.meta?.[metaKey]
    }
    if (includeAncestor) {
      return route.matched?.find((ancestor: any) => ancestor.meta?.[metaKey])?.meta?.[metaKey]
    }
    return undefined
  }

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