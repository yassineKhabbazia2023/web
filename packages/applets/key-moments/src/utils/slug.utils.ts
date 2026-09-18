import { getAlphanumericString } from '@pulse/toolbox/utils/string'

/**
 * The id an authored title becomes: lowercase, unaccented, dash-joined. Used
 * for the ids of the template document and for the code of an indicator, both
 * of which are read by people and never rewritten afterwards.
 */
export function slugify(text: string): string {
  return getAlphanumericString(text).toLowerCase().replaceAll(' ', '-')
}
