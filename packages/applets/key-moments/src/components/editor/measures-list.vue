<template>
  <div>
    <div
      class="
        key-moments-editor-list__head
        flex
        flex--align-items-center
        flex-gap--2
      "
    >
      <span class="key-moments-editor-list__cell key-moments-editor-list__cell--handle" />
      <ColumnHead
        cellClass="key-moments-editor-list__cell--wide"
        :label="t('keyMoments.settings.measures.headers.measure')"
        :hint="t('keyMoments.settings.measures.hints.measure')"
        :testId="`${testIdPrefix}-measure-key`"
      />
      <ColumnHead
        cellClass="key-moments-editor-list__cell--grow"
        :label="t('keyMoments.settings.measures.headers.label')"
        :hint="t('keyMoments.settings.measures.hints.label')"
        :testId="`${testIdPrefix}-measure-label`"
      />
      <ColumnHead
        cellClass="key-moments-editor-list__cell--medium"
        :label="t('keyMoments.settings.measures.headers.hidden')"
        :hint="t('keyMoments.settings.measures.hints.hidden')"
        :testId="`${testIdPrefix}-measure-hidden`"
      />
      <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action" />
    </div>

    <ul
      ref="measuresList"
      class="key-moments-editor-list list-style-none"
      :data-list-id="`${testIdPrefix}-measures`"
    >
      <li
        v-for="(measure, index) in measures"
        :key="index"
        class="
          key-moments-editor-list__row
          flex
          flex--align-items-center
          flex-gap--2
        "
        :data-item-id="index"
      >
        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--handle">
          <span class="key-moments-editor-handle">
            <PIcon pName="arrowDownUp" />
          </span>
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--wide">
          <PDropdown
            v-if="measure.role === undefined"
            :modelValue="measure.measure"
            :pOptions="keyOptions"
            pSize="small"
            pFilterable
            pAllowCreate
            :pTestId="`${testIdPrefix}-measure-${index}-key-select`"
            @update:model-value="key => emit('update', index, { measure: key })"
          />
          <PDropdown
            v-else
            :modelValue="measure.role"
            :pOptions="roleOptions"
            pSize="small"
            :pTestId="`${testIdPrefix}-measure-${index}-role-select`"
            @update:model-value="role => emit('update', index, { role })"
          />
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--grow">
          <PInput
            :modelValue="measure.label ?? ''"
            pSize="small"
            :pPlaceholder="t('keyMoments.settings.measures.labelHint')"
            :pTestId="`${testIdPrefix}-measure-${index}-label-input`"
            @update:model-value="(label: string | number) => onLabelChange(index, String(label))"
          />
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--medium">
          <PCheckbox
            :modelValue="measure.hidden === true"
            :pTestId="`${testIdPrefix}-measure-${index}-hidden-checkbox`"
            @update:model-value="toggleHidden(index, measure)"
          >
            {{ t('keyMoments.settings.measures.hidden') }}
          </PCheckbox>
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action">
          <PButton
            pSize="small"
            pIconOnly
            pType="tertiary"
            :aria-label="t('keyMoments.settings.measures.remove')"
            :pTestId="`${testIdPrefix}-measure-${index}-remove-button`"
            @click="emit('remove', index)"
          >
            <PIcon pName="trash" />
          </PButton>
        </span>
      </li>
    </ul>

    <div
      class="
        flex
        flex-gap--2
        margin-top--2
      "
    >
      <PButton
        pSize="small"
        pType="tertiary"
        :pTestId="`${testIdPrefix}-add-named-measure-button`"
        @click="emit('add', 'named')"
      >
        {{ t('keyMoments.settings.measures.addNamed') }}
      </PButton>
      <PButton
        pSize="small"
        pType="tertiary"
        :pTestId="`${testIdPrefix}-add-role-measure-button`"
        @click="emit('add', 'role')"
      >
        {{ t('keyMoments.settings.measures.addRole') }}
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PCheckbox, PDropdown, PIcon, PInput } from '@pulse/styleguide/components'
import ColumnHead from './column-head.vue'
import { useSortableList } from '../../composables/use-sortable-list.composable'
import { MEASURE_KEY_OPTIONS, MEASURE_ROLE_OPTIONS } from './widget-drawer/widget-drawer.consts'
import type { RawMeasure } from './widget-drawer/widget-drawer.types'

defineProps<{
  measures: RawMeasure[]
  /** Prefix of the `data-testid` of each control, naming what owns the columns */
  testIdPrefix: string
}>()

const emit = defineEmits<{
  add: [kind: 'named' | 'role']
  update: [index: number, patch: Record<string, unknown>]
  remove: [index: number]
  move: [from: number, to: number]
}>()

const { t } = useI18n()

const measuresList = useTemplateRef<HTMLElement>('measuresList')

useSortableList(measuresList, {
  handle: '.key-moments-editor-handle',
  onMove: move => emit('move', Number(move.itemId), move.newIndex),
})

const keyOptions = computed(() => MEASURE_KEY_OPTIONS.map(key => ({ pValue: key, pLabel: key })))

const roleOptions = computed(() => MEASURE_ROLE_OPTIONS.map(role => ({
  pValue: role,
  pLabel: t(`keyMoments.settings.measures.roles.${role}`),
})))

/** An emptied label leaves the measure, which then reads its default one */
function onLabelChange(index: number, label: string): void {
  emit('update', index, { label: label === '' ? undefined : label })
}

/** A visible measure carries no flag rather than `hidden: false` */
function toggleHidden(index: number, measure: RawMeasure): void {
  emit('update', index, { hidden: measure.hidden === true ? undefined : true })
}
</script>

<style scoped lang="scss">
@use '../../styles/editor';

.key-moments-editor-handle {
  @include editor.handle;
}

.key-moments-editor-list {
  @include editor.list;
}
</style>
