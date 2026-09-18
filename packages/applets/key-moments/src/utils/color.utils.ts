/**
 * How the report decides what to write on a colour it did not choose.
 *
 * The palette of a balance sheet runs from the darkest navy to the palest
 * turquoise, and a chart stacks the two ends of it in one column: a single ink
 * is unreadable on one end or the other. Which one to use is not a taste, it is
 * a measurement — the relative luminance of the background, as WCAG defines it.
 *
 * Stated here rather than in each component: it is arithmetic of a spec, it
 * cannot be checked by eye, and a second copy is a second chance of being
 * wrong in one place only.
 */

/** Above this relative luminance, a background carries dark ink rather than white. */
const LIGHT_BACKGROUND_LUMINANCE = 0.5

/**
 * Relative luminance of a colour, as WCAG defines it: 0 for black, 1 for white.
 *
 * Only the hex notations a template ships are read — `#abc` as well as
 * `#aabbcc`. Anything else is not a colour this can measure, and says so.
 */
export function relativeLuminance(color: string): number | undefined {
  const hex = color.replaceAll('#', '')
  const expanded = hex.length === 3
    ? [...hex].map(channel => channel + channel).join('')
    : hex

  if (/^[0-9a-f]{6}$/i.test(expanded) === false) {
    return undefined
  }

  const [red, green, blue] = [0, 2, 4]
    .map(offset => parseInt(expanded.slice(offset, offset + 2), 16) / 255)
    .map(channel => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/** Whether a colour is pale enough to carry dark ink; unmeasurable colours default to dark (white ink). */
export function isLightColor(color: string): boolean {
  const luminance = relativeLuminance(color)

  return luminance !== undefined && luminance > LIGHT_BACKGROUND_LUMINANCE
}
