/**
 * Ids the report puts on its sections and its blocks so that the navigation can
 * scroll to them. Screens and widgets are named in two separate namespaces of
 * the template, so their ids are prefixed apart: nothing forbids a screen and a
 * widget from carrying the same one.
 */

export function screenAnchorId(screenId: string): string {
  return `key-moments-screen-${screenId}`
}

export function widgetAnchorId(widgetId: string): string {
  return `key-moments-widget-${widgetId}`
}

/**
 * The recommendations close the report without coming from the template, so
 * their anchor is a constant rather than a name derived from a document: there
 * is no screen id to build it from, and there never will be.
 */
export const OFFERS_ANCHOR_ID = 'key-moments-offers'
