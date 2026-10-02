import type { MaybeRefOrGetter } from 'vue'
import type { SearchableOffer } from '../../../types/key-moments.types'

export interface RecommendationOffersSelectionOptions {
  catalog: MaybeRefOrGetter<SearchableOffer[]>
  /** The offers already attached, read anew on every opening */
  initialSelection: MaybeRefOrGetter<number[]>
  onValidate: (offerIds: number[]) => void
}
