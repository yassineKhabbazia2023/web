import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { displayNotification } from '@pulse/styleguide'
import { HTTP_RESPONSES } from '@pulse/common/constants'
import { IndicatorSign, ValueKind } from '@key-moments/enums/key-moments.enums'
import { IndicatorsService } from '@key-moments/services/indicators.service'
import { apiErrorKey, readApiStatus } from '@key-moments/utils/api-error.utils'
import { movedInList } from '@key-moments/utils/patch.utils'
import { slugify } from '@key-moments/utils/slug.utils'
import type { Indicator } from '@key-moments/types/key-moments.types'
import type { IndicatorUsageItem } from '@key-moments/services/indicators.service.types'
import type { IndicatorDrawerMode, IndicatorForm } from './indicator-drawer.types'

function emptyForm(): IndicatorForm {
  return {
    code: '',
    label: '',
    shortLabel: '',
    description: '',
    kind: ValueKind.AMOUNT,
    sign: IndicatorSign.INCOME,
  }
}

/** The composition is written by its own call, after the term itself: an aggregate has to exist before it can combine anything. */
export function useIndicatorDrawer(options: { onSaved: (code: string) => void }) {
  const { t } = useI18n()

  const isOpen = ref(false)
  const mode = ref<IndicatorDrawerMode>('create')
  const form = reactive<IndicatorForm>(emptyForm())
  const componentCodes = ref<string[]>([])
  /** The composition as it was opened, so that only a change is ever written */
  const openedComponentCodes = ref<string[]>([])
  const usages = ref<IndicatorUsageItem[]>([])
  const isSaving = ref(false)
  const isLoadingUsages = ref(false)
  const codeError = ref<string>()
  const componentsError = ref<string>()

  function reset(): void {
    Object.assign(form, emptyForm())
    componentCodes.value = []
    openedComponentCodes.value = []
    usages.value = []
    codeError.value = undefined
    componentsError.value = undefined
  }

  function openCreate(): void {
    reset()
    mode.value = 'create'
    isOpen.value = true
  }

  function openEdit(indicator: Indicator): void {
    reset()
    mode.value = 'edit'
    Object.assign(form, {
      code: indicator.id,
      label: indicator.label,
      shortLabel: indicator.shortLabel ?? '',
      description: indicator.description ?? '',
      kind: indicator.kind,
      sign: indicator.sign,
    })
    componentCodes.value = (indicator.components ?? []).map(component => component.indicator)
    openedComponentCodes.value = [...componentCodes.value]
    isOpen.value = true
    loadUsages(indicator.id)
  }

  async function loadUsages(code: string): Promise<void> {
    isLoadingUsages.value = true

    try {
      usages.value = await IndicatorsService.getUsages(code)
    } catch (error) {
      logger.error('[KeyMoments] indicators: reading the usages failed', error)
      usages.value = []
    } finally {
      isLoadingUsages.value = false
    }
  }

  function close(): void {
    isOpen.value = false
  }

  function addComponent(): void {
    componentCodes.value = [...componentCodes.value, '']
  }

  function updateComponent(index: number, code: string): void {
    componentCodes.value = componentCodes.value.map((current, position) => (
      position === index ? code : current
    ))
  }

  function removeComponent(index: number): void {
    componentCodes.value = componentCodes.value.filter((_code, position) => position !== index)
  }

  function moveComponent(from: number, to: number): void {
    componentCodes.value = movedInList(componentCodes.value, from, to)
  }

  function hasComponentsChanged(): boolean {
    return JSON.stringify(componentCodes.value) !== JSON.stringify(openedComponentCodes.value)
  }

  async function save(): Promise<void> {
    const code = mode.value === 'create' ? slugify(form.code) : form.code

    if (form.label === '') {
      return
    }

    // A code the slug empties (e.g. « !!! ») never reaches the API; caught here instead
    if (code === '') {
      codeError.value = t('keyMoments.settings.indicatorDrawer.codeInvalid')

      return
    }

    isSaving.value = true
    codeError.value = undefined
    componentsError.value = undefined

    const payload = {
      label: form.label,
      shortLabel: form.shortLabel === '' ? undefined : form.shortLabel,
      // Sent even when empty, so that clearing the field clears the definition
      description: isNullOrEmpty(form.description.trim()) ? null : form.description.trim(),
      kind: form.kind,
      sign: form.sign,
    }

    try {
      if (mode.value === 'create') {
        await IndicatorsService.createIndicator({ code, ...payload })
        // created once: what follows — its composition, a retry — edits it
        mode.value = 'edit'
        form.code = code
      } else {
        await IndicatorsService.updateIndicator(code, payload)
      }
    } catch (error) {
      logger.error('[KeyMoments] indicators: saving the indicator failed', error)
      isSaving.value = false

      if (readApiStatus(error) === HTTP_RESPONSES.CONFLICT) {
        codeError.value = t('keyMoments.settings.indicatorDrawer.codeTaken')

        return
      }

      displayNotification('error', t(apiErrorKey(error, 'keyMoments.settings.indicatorDrawer.error')))

      return
    }

    // the composition is written apart, and only when it changed: a term that
    // combines nothing has no composition to send
    if (hasComponentsChanged()) {
      try {
        await IndicatorsService.setComponents(code, componentCodes.value.filter(component => component !== ''))
      } catch (error) {
        logger.error('[KeyMoments] indicators: saving the composition failed', error)
        componentsError.value = t(apiErrorKey(error, 'keyMoments.settings.indicatorDrawer.componentsError'))
        isSaving.value = false

        return
      }
    }

    isSaving.value = false
    close()
    displayNotification('success', t('keyMoments.settings.indicatorDrawer.saved'))
    options.onSaved(code)
  }

  return {
    isOpen,
    mode,
    form,
    componentCodes,
    usages,
    isSaving,
    isLoadingUsages,
    codeError,
    componentsError,
    openCreate,
    openEdit,
    close,
    addComponent,
    updateComponent,
    removeComponent,
    moveComponent,
    save,
  }
}
