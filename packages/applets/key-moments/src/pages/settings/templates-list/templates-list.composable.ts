import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import type { TemplateCatalogueItem } from '@key-moments/services/template-editor.service.types'

/** The catalogue as the settings page reads it: hidden templates included. */
export function useTemplatesList() {
  const { t } = useI18n()

  const catalogue = ref<TemplateCatalogueItem[]>([])
  const isLoading = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      catalogue.value = await TemplateEditorService.getCatalogue()
    } catch (error) {
      logger.error('[KeyMoments] settings: reading the templates catalogue failed', error)
      displayNotification('error', t('keyMoments.settings.templates.loadError'))
    } finally {
      isLoading.value = false
    }
  }

  onMounted(load)

  return { catalogue, isLoading, load }
}
