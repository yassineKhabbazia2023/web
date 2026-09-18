<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="mode === 'create'
      ? t('keyMoments.settings.indicatorDrawer.titleCreate')
      : t('keyMoments.settings.indicatorDrawer.titleEdit')"
    pSize="560px"
    pTestId="key-moments-settings-indicator-drawer"
    @close-drawer-button="close"
  >
    <PForm
      :pModel="form"
      pRequireAsteriskPosition="right"
    >
      <PFormItem
        :pLabel="t('keyMoments.settings.indicatorDrawer.code')"
        :pError="codeError"
        pRequired
      >
        <PInput
          v-model="form.code"
          pSize="small"
          :pDisabled="mode === 'edit'"
          :pPlaceholder="t('keyMoments.settings.indicatorDrawer.codeHint')"
          pTestId="key-moments-settings-indicator-code-input"
        />
      </PFormItem>

      <PFormItem
        :pLabel="t('keyMoments.settings.indicatorDrawer.label')"
        pRequired
      >
        <PInput
          v-model="form.label"
          pSize="small"
          pTestId="key-moments-settings-indicator-label-input"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.indicatorDrawer.shortLabel')">
        <PInput
          v-model="form.shortLabel"
          pSize="small"
          :pPlaceholder="t('keyMoments.settings.indicatorDrawer.shortLabelHint')"
          pTestId="key-moments-settings-indicator-short-label-input"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.indicatorDrawer.kind')">
        <PDropdown
          v-model="form.kind"
          :pOptions="kindOptions"
          pSize="small"
          pTestId="key-moments-settings-indicator-kind-select"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.indicatorDrawer.sign')">
        <PDropdown
          v-model="form.sign"
          :pOptions="signOptions"
          pSize="small"
          pTestId="key-moments-settings-indicator-sign-select"
        />
      </PFormItem>

      <p class="font-semibold margin-top--4">
        {{ t('keyMoments.settings.indicatorDrawer.components') }}
      </p>
      <p class="font-small text-color--text-neutral">
        {{ t('keyMoments.settings.indicatorDrawer.componentsHint') }}
      </p>

      <ul
        ref="componentsList"
        class="key-moments-editor-list list-style-none margin-top--2"
        data-list-id="indicator-components"
      >
        <li
          v-for="(component, index) in componentCodes"
          :key="index"
          class="
            key-moments-editor-list__row
            flex
            flex--align-items-center
            flex-gap--2
          "
          :data-item-id="index"
        >
          <span class="key-moments-editor-handle">
            <PIcon pName="arrowDownUp" />
          </span>

          <IndicatorSelect
            class="flex--grow-1"
            :modelValue="component"
            :vocabulary="selectableVocabulary"
            :canCreate="false"
            :testId="`key-moments-settings-indicator-component-${index}-select`"
            @update:model-value="code => updateComponent(index, code ?? '')"
          />

          <PButton
            pSize="small"
            pIconOnly
            pType="tertiary"
            :aria-label="t('keyMoments.settings.indicatorDrawer.removeComponent')"
            :pTestId="`key-moments-settings-indicator-component-${index}-remove-button`"
            @click="removeComponent(index)"
          >
            <PIcon pName="trash" />
          </PButton>
        </li>
      </ul>

      <p
        v-if="componentsError !== undefined"
        class="text-color--text-error margin-top--2"
        data-testid="key-moments-settings-indicator-components-error"
      >
        {{ componentsError }}
      </p>

      <PButton
        class="margin-top--2"
        pSize="small"
        pType="tertiary"
        pTestId="key-moments-settings-add-component-button"
        @click="addComponent"
      >
        {{ t('keyMoments.settings.indicatorDrawer.addComponent') }}
      </PButton>

      <!-- The templates citing the term, which is what a rename or a deprecation weighs on -->
      <template v-if="mode === 'edit'">
        <p class="font-semibold margin-top--6">
          {{ t('keyMoments.settings.indicatorDrawer.usages') }}
        </p>
        <PLoader
          v-if="isLoadingUsages"
          pType="primary"
          pSize="24"
        />
        <p
          v-else-if="usages.length === 0"
          class="font-small text-color--text-neutral"
          data-testid="key-moments-settings-indicator-usages-empty"
        >
          {{ t('keyMoments.settings.indicatorDrawer.noUsage') }}
        </p>
        <ul
          v-else
          class="margin-top--2"
          data-testid="key-moments-settings-indicator-usages"
        >
          <li
            v-for="usage in usages"
            :key="usage.templateId"
          >
            <a
              href="#"
              @click.prevent="openTemplate(usage.templateId)"
            >{{ usage.label }}</a>
            <span
              v-if="(usage.versions ?? []).length > 0"
              class="text-color--text-neutral"
            > · {{ usage.versions?.join(', ') }}</span>
          </li>
        </ul>
      </template>
    </PForm>

    <template #footer>
      <PDrawerActions
        :pSecondaryCTA="{
          pLabel: t('keyMoments.settings.indicatorDrawer.cancel'),
          pTestId: 'key-moments-settings-indicator-cancel-button',
        }"
        :pPrimaryCTA="{
          pLabel: t('keyMoments.settings.indicatorDrawer.save'),
          pLoading: isSaving,
          pDisabled: isIncomplete,
          pTestId: 'key-moments-settings-indicator-save-button',
        }"
        @click-secondary-cta="close"
        @click-primary-cta="save"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import {
  PButton,
  PDrawer,
  PDrawerActions,
  PDropdown,
  PForm,
  PFormItem,
  PIcon,
  PInput,
  PLoader,
} from '@pulse/styleguide/components'
import { IndicatorSign, ValueKind } from '@key-moments/enums/key-moments.enums'
import IndicatorSelect from '../indicator-select.vue'
import { useSortableList } from '@key-moments/composables/use-sortable-list.composable'
import { useIndicatorDrawer } from './indicator-drawer.composable'
import type { Indicator } from '@key-moments/types/key-moments.types'

const props = defineProps<{
  vocabulary: Indicator[]
}>()

const emit = defineEmits<{
  saved: [code: string]
}>()

const { t } = useI18n()
const router = useRouter()

const {
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
} = useIndicatorDrawer({ onSaved: code => emit('saved', code) })

const componentsList = useTemplateRef<HTMLElement>('componentsList')

useSortableList(componentsList, {
  handle: '.key-moments-editor-handle',
  onMove: move => moveComponent(Number(move.itemId), move.newIndex),
})

/** An aggregate never combines itself, and never a term nobody may cite. */
const selectableVocabulary = computed(() => props.vocabulary
  .filter(indicator => indicator.id !== form.code && indicator.isDeprecated !== true))

const kindOptions = computed(() => Object.values(ValueKind).map(kind => ({
  pValue: kind,
  pLabel: t(`keyMoments.settings.indicators.kinds.${kind}`),
})))

const signOptions = computed(() => Object.values(IndicatorSign).map(sign => ({
  pValue: sign,
  pLabel: t(`keyMoments.settings.indicators.signs.${sign}`),
})))

const isIncomplete = computed(() => form.code === '' || form.label === '')

function openTemplate(templateId: number): void {
  router.push({ name: RouteName.KEY_MOMENTS_TEMPLATE_EDITOR, params: { templateId } })
}

defineExpose({ openCreate, openEdit })
</script>

<style scoped lang="scss">
@use '../../../styles/editor';

.key-moments-editor-handle {
  @include editor.handle;
}

.key-moments-editor-list {
  @include editor.list;
}
</style>
