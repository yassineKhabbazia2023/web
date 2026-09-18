import type { CommentVariant } from '../types/key-moments.types'

/**
 * The most recent text a closing delivered, among the readings of a slot: the
 * tab the encart opens on when nothing else is selected. The tabs read
 * chronologically — the oldest delivery on the left — so it is the last of the
 * delivered ones, and never the first tab.
 *
 * A matter of display and of nothing else. What a publication would carry is
 * never worked out from here: the microservice marks it on the readings
 * themselves — see `isPublishable` — and its rule differs from this one as soon
 * as an earlier closing is published.
 *
 * Absent only when a slot carries no delivered reading at all, which the
 * callers of `variantsFor` never produce: it always stands one in.
 */
export function mostRecentDeliveredVariant(
  variants: CommentVariant[],
): CommentVariant | undefined {
  return variants.filter(variant => variant.contributorId === null).at(-1)
}
