<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="t('keyMoments.settings.templateDrawer.title')"
    pSize="560px"
    pTestId="key-moments-settings-template-properties-drawer"
    @close-drawer-button="cancel"
  >
    <PForm>
      <PFormItem :pLabel="t('keyMoments.settings.templateDrawer.label')">
        <PInput
          :modelValue="(draftLabel as string | undefined) ?? ''"
          pSize="small"
          pTestId="key-moments-settings-template-properties-label-input"
          @update:model-value="(label: string | number) => update({ label: String(label) })"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.templateDrawer.code')">
        <PInput
          :modelValue="template.id"
          pSize="small"
          pReadonly
          pTestId="key-moments-settings-template-properties-code-input"
        />
      </PFormItem>

      <p class="font-semibold margin-top--4">
        {{ t('keyMoments.settings.templateDrawer.defaultMeasures') }}
      </p>
      <MeasuresList
        :measures="defaultMeasures"
        testIdPrefix="key-moments-settings-template"
        @add="addMeasure"
        @update="updateMeasure"
        @remove="removeMeasure"
        @move="moveMeasure"
      />
    </PForm>

    <template #footer>
      <PDrawerActions
        :pSecondaryCTA="{
          pLabel: t('keyMoments.settings.drawerActions.cancel'),
          pTestId: 'key-moments-settings-template-properties-cancel-button',
        }"
        :pPrimaryCTA="{
          pLabel: t('keyMoments.settings.drawerActions.save'),
          pDisabled: isLabelEmpty,
          pTestId: 'key-moments-settings-template-properties-save-button',
        }"
        @click-secondary-cta="cancel"
        @click-primary-cta="save"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { PDrawer, PDrawerActions, PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import MeasuresList from './measures-list.vue'
import { useMeasuresList } from '../../composables/use-measures-list.composable'
import { useTemplateEditorStore } from '../../stores/template-editor.store'
import { patchRecord } from '../../utils/patch.utils'
import type { RawMeasure } from './widget-drawer/widget-drawer.types'

const { t } = useI18n()

const store = useTemplateEditorStore()
const { selection, template, draft } = storeToRefs(store)

const isOpen = computed({
  get: () => selection.value?.kind === 'template',
  set: (open: boolean) => {
    if (open === false) {
      cancel()
    }
  },
})

function cancel(): void {
  store.cancelDraft()
}

function save(): void {
  store.commitDraft()
}

function update(patch: Record<string, unknown>): void {
  store.setDraft(patchRecord({ ...draft.value }, patch))
}

const draftLabel = computed(() => draft.value?.label)

/** A template answers to its label everywhere: the catalogue refuses a blank one */
const isLabelEmpty = computed(() => typeof draftLabel.value !== 'string' || draftLabel.value.trim() === '')

/**
 * The columns every widget of the template reads unless it declares its own.
 * Edited here because they belong to the document, not to any one widget.
 */
const defaultMeasures = computed(() => (draft.value?.defaultMeasures ?? []) as RawMeasure[])

const {
  addMeasure,
  updateMeasure,
  removeMeasure,
  moveMeasure,
} = useMeasuresList(defaultMeasures, next => update({ defaultMeasures: next }))
</script>
