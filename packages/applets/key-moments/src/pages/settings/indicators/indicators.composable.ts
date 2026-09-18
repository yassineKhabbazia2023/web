import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { removeDiacritics } from '@pulse/toolbox/utils/string'
import { displayNotification } from '@pulse/styleguide'
import { HTTP_RESPONSES } from '@pulse/common/constants'
import { IndicatorsService } from '@key-moments/services/indicators.service'
import { readApiErrorDetail, readApiStatus } from '@key-moments/utils/api-error.utils'
import type { Indicator } from '@key-moments/types/key-moments.types'

/** Accent- and case-insensitive, so that « resultat » finds « Résultat ». */
function normalize(text: string): string {
  return removeDiacritics(text).toLowerCase()
}

/**
 * The vocabulary as the settings page reads it: the deprecated terms included,
 * since this is the one surface where they are seen — and restored.
 */
export function useIndicators() {
  const { t } = useI18n()

  const indicators = ref<Indicator[]>([])
  const isLoading = ref(false)
  const searchText = ref('')
  const showDeprecated = ref(false)

  const visibleIndicators = computed(() => {
    const needle = normalize(searchText.value.trim())

    return indicators.value.filter(indicator => (
      (showDeprecated.value === true || indicator.isDeprecated !== true)
      && (needle.length === 0
        || normalize(indicator.id).includes(needle)
        || normalize(indicator.label).includes(needle))
    ))
  })

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      indicators.value = await IndicatorsService.getIndicators()
    } catch (error) {
      logger.error('[KeyMoments] indicators: reading the vocabulary failed', error)
      displayNotification('error', t('keyMoments.settings.indicators.loadError'))
    } finally {
      isLoading.value = false
    }
  }

  /**
   * A `409` says the indicator is already in the asked state: nothing to undo,
   * the list is simply behind — reloading is the whole answer.
   */
  async function transition(action: () => Promise<void>, successKey: string): Promise<void> {
    try {
      await action()
      displayNotification('success', t(successKey))
    } catch (error) {
      if (readApiStatus(error) === HTTP_RESPONSES.CONFLICT) {
        displayNotification('warning', t('keyMoments.settings.indicators.alreadyInState'))
      } else {
        logger.error('[KeyMoments] indicators: the transition failed', error)
        displayNotification(
          'error',
          readApiErrorDetail(error) ?? t('keyMoments.settings.indicators.actionError'),
        )
      }
    }

    await load()
  }

  function deprecate(code: string): Promise<void> {
    return transition(() => IndicatorsService.deprecate(code), 'keyMoments.settings.indicators.deprecated')
  }

  function restore(code: string): Promise<void> {
    return transition(() => IndicatorsService.restore(code), 'keyMoments.settings.indicators.restored')
  }

  onMounted(load)

  return { indicators, visibleIndicators, isLoading, searchText, showDeprecated, load, deprecate, restore }
}
