import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { HTTP_RESPONSES } from '@pulse/common/constants'
import { FIRST_TEMPLATE_VERSION } from '@key-moments/const/key-moments.consts'
import { TemplateEditorService } from '@key-moments/services/template-editor.service'
import { apiErrorKey, readApiStatus } from '@key-moments/utils/api-error.utils'
import { slugify } from '@key-moments/utils/slug.utils'
import type { TemplateCatalogueItem, RawTemplateDocument } from '@key-moments/services/template-editor.service.types'
import type { TemplateDuplicationSource } from './template-create-drawer.types'


/**
 * Creating from nothing or from another template is the same call: only the
 * document sent differs. The copy is taken from what the caller hands over,
 * unsaved changes included.
 */
export function useTemplateCreateDrawer(options: { onCreated: (item: TemplateCatalogueItem) => void }) {
  const { t } = useI18n()

  const isOpen = ref(false)
  const isSaving = ref(false)
  const codeError = ref<string>()
  const form = reactive({ code: '', label: '' })
  const source = ref<TemplateDuplicationSource>()

  const isDuplicate = computed(() => source.value !== undefined)

  function open(label: string, from?: TemplateDuplicationSource): void {
    form.code = ''
    form.label = label
    source.value = from
    codeError.value = undefined
    isOpen.value = true
  }

  function openNew(): void {
    open('')
  }

  function openDuplicate(from: TemplateDuplicationSource): void {
    open(t('keyMoments.settings.templates.createDrawer.copyLabel', { label: from.label }), from)
  }

  function close(): void {
    isOpen.value = false
  }

  /** A duplicate keeps every key the source carries, even ones this editor doesn't know about. */
  function buildContent(code: string): RawTemplateDocument {
    if (source.value === undefined) {
      // no `defaultMeasures` key: an empty list is refused, its absence is not
      return { id: code, label: form.label, screens: [] }
    }

    // Version is set by the API alone; a stray one from elsewhere would only contradict it
    const { version: _version, ...content } = source.value.content

    return { ...content, id: code, label: form.label }
  }

  async function save(): Promise<void> {
    const code = slugify(form.code)

    if (form.label === '') {
      return
    }

    // a code the slug empties — « !!! » — is a code the microservice would
    // never see: said on the field, where a silent button says nothing
    if (code === '') {
      codeError.value = t('keyMoments.settings.templates.createDrawer.codeInvalid')

      return
    }

    isSaving.value = true
    codeError.value = undefined

    try {
      const created = await TemplateEditorService.createTemplate({
        code,
        label: form.label,
        version: FIRST_TEMPLATE_VERSION,
        content: buildContent(code),
      })

      close()
      options.onCreated(created)
    } catch (error) {
      logger.error('[KeyMoments] settings: creating the template failed', error)
      // a refused code is said on the field, never in a notification that
      // leaves the reader looking for what to correct
      codeError.value = readApiStatus(error) === HTTP_RESPONSES.CONFLICT
        ? t('keyMoments.settings.templates.createDrawer.codeTaken')
        : t(apiErrorKey(error, 'keyMoments.settings.templates.createDrawer.error'))
    } finally {
      isSaving.value = false
    }
  }

  return { isOpen, form, isSaving, codeError, isDuplicate, openNew, openDuplicate, close, save }
}
