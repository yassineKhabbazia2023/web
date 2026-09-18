import type { PTagProps } from '../atoms/PTag/PTagTypes'

/**
 * What a tag is written in when the référentiel names one nothing styles yet:
 * an unknown label is still worth showing, and `info` is the neutral of the set.
 */
export const DEFAULT_OFFER_TAG_COLOR: PTagProps['pColor'] = 'info'

/**
 * The colour of every offer tag of the référentiel, keyed by the label the
 * référentiel itself serves.
 *
 * Shared rather than held by the catalogue: the same offers are browsed from
 * the offers catalogue and from the key moments picker, and two tables would
 * end up disagreeing on the colour of the same label.
 *
 * Kept here rather than in `@pulse/common`, which owns data and would have had
 * to import the design system to name a colour: what a tag is painted in is a
 * design-system arbitration, and `PTagProps` already lives next door. The
 * labels are the référentiel's own, and this is the one place they are read.
 */
export const OFFER_TAG_COLORS: Record<string, PTagProps['pColor']> = {
  'Gérer': 'info',
  'ERC': 'info',
  'Pack': 'blue',
  'Développer': 'blue',
  'Transmettre': 'tranquil',
  'Conseil Patrimonial': 'warning',
  'Gestion Privée': 'success',
  'ESC': 'tranquil',
  'Conseil': 'blue',
  'Gestion sociale': 'warning',
  'Transverse': 'warning',
  'Avocats': 'success',
  'Filiale Gestion Privée': 'blue',
  'Partenariat': 'blue',
}
