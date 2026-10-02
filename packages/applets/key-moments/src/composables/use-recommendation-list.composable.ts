import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { RECOMMENDATIONS_MAX_COUNT } from '../const/key-moments.consts'
import { useOffersCatalogStore } from '../stores/offers-catalog.store'
import { useRecommendationThemesStore } from '../stores/recommendation-themes.store'
import {
  emptyRecommendation,
  movedInRubric,
  patched,
  refusedThemeKeysOf,
  toRubricViews,
  without,
} from '../utils/recommendations.utils'
import { withoutValue } from '../utils/set.utils'
import type { RecommendationRubric } from '../enums/key-moments.enums'
import type { WorkingRecommendation } from '../types/recommendations.types'

/**
 * A working list of recommendations, as both editors hold it — the exercice's
 * and a category's: the lines, their views by rubric, the gestures on them and
 * the themes a save was refused for. When and how the list is written is each
 * editor's own.
 */
export function useRecommendationList() {
  const { t } = useI18n()
  const { themes } = storeToRefs(useRecommendationThemesStore())
  const { catalog } = storeToRefs(useOffersCatalogStore())

  const recommendations = ref<WorkingRecommendation[]>([])
  /** The lines the last save was refused for their theme, until they change it */
  const refusedThemeKeys = ref(new Set<string>())

  const rubricViews = computed(() => (
    toRubricViews(recommendations.value, catalog.value, themes.value, refusedThemeKeys.value)
  ))
  const canAdd = computed(() => recommendations.value.length < RECOMMENDATIONS_MAX_COUNT)

  /** Another list altogether: the refusals of the previous one no longer apply. */
  function hold(next: WorkingRecommendation[]): void {
    recommendations.value = next
    refusedThemeKeys.value = new Set()
  }

  /** An empty line at the end of the rubric; its key opens the card. */
  function addRecommendation(rubric: RecommendationRubric): string {
    const added = emptyRecommendation(rubric)

    recommendations.value = [...recommendations.value, added]

    return added.key
  }

  function updateRecommendation(key: string, patch: Partial<WorkingRecommendation>): void {
    if (patch.themeId !== undefined && refusedThemeKeys.value.has(key)) {
      refusedThemeKeys.value = withoutValue(refusedThemeKeys.value, key)
    }

    recommendations.value = patched(recommendations.value, key, patch)
  }

  function removeRecommendation(key: string): void {
    recommendations.value = without(recommendations.value, key)
  }

  function moveRecommendation(key: string, index: number): void {
    recommendations.value = movedInRubric(recommendations.value, key, index, themes.value)
  }

  function clearRefusals(): void {
    refusedThemeKeys.value = new Set()
  }

  /**
   * The lines a refused save names for their theme, marked and said. False for
   * a refusal of another kind, which the editor words itself.
   */
  function recordThemeRefusal(error: unknown, sent: WorkingRecommendation[]): boolean {
    const refusedKeys = refusedThemeKeysOf(error, sent)

    if (refusedKeys === undefined) {
      return false
    }

    refusedThemeKeys.value = new Set(refusedKeys)
    displayNotification('error', t('keyMoments.recommendations.unknownThemeError'))

    return true
  }

  return {
    recommendations,
    themes,
    catalog,
    rubricViews,
    canAdd,
    hold,
    addRecommendation,
    updateRecommendation,
    removeRecommendation,
    moveRecommendation,
    clearRefusals,
    recordThemeRefusal,
  }
}
