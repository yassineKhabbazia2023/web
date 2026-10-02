import type { RecommendationRubric } from '../enums/key-moments.enums'

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
 * their anchor is a constant rather than a name derived from a document.
 */
export const RECOMMENDATIONS_ANCHOR_ID = 'key-moments-recommendations'

/** A rubric section, for the sub-entries of the navigation: named by the rubric's key. */
export function rubricAnchorId(rubric: RecommendationRubric): string {
  return `key-moments-recommendations-rubric-${rubric}`
}
