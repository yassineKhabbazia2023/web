import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RecommendationsService } from '../services/recommendations.service'
import type { RecommendationThemePayload } from '../services/recommendations.service.types'

/**
 * The closed list of recommendation themes, read once for the session: it
 * rarely changes. A failed read is not kept, the next call reads again.
 */
export const useRecommendationThemesStore = defineStore('key-moments-recommendation-themes', () => {
  const themes = ref<RecommendationThemePayload[]>([])

  let reading: Promise<void> | undefined

  function readThemes(): Promise<void> {
    reading ??= RecommendationsService.getThemes()
      .then((read) => {
        themes.value = read
      })
      .catch((error: unknown) => {
        reading = undefined
        throw error
      })

    return reading
  }

  return { themes, readThemes }
})
