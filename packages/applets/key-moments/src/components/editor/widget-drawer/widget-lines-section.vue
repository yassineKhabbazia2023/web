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
        cellClass="key-moments-editor-list__cell--grow"
        :label="t('keyMoments.settings.widgetDrawer.lines.headers.indicator')"
        :hint="t('keyMoments.settings.widgetDrawer.lines.hints.indicator')"
        testId="key-moments-settings-lines-indicator"
      />
      <ColumnHead
        cellClass="key-moments-editor-list__cell--medium"
        :label="t('keyMoments.settings.widgetDrawer.lines.headers.role')"
        :hint="t('keyMoments.settings.widgetDrawer.lines.hints.role')"
        testId="key-moments-settings-lines-role"
      />
      <ColumnHead
        v-if="renderer === Renderer.BALANCE_SHEET"
        cellClass="key-moments-editor-list__cell--medium"
        :label="t('keyMoments.settings.widgetDrawer.lines.headers.side')"
        :hint="t('keyMoments.settings.widgetDrawer.lines.hints.side')"
        testId="key-moments-settings-lines-side"
      />
      <ColumnHead
        v-if="renderer === Renderer.CARDS"
        cellClass="key-moments-editor-list__cell--grow"
        :label="t('keyMoments.settings.widgetDrawer.lines.headers.reference')"
        :hint="t('keyMoments.settings.widgetDrawer.lines.hints.reference')"
        testId="key-moments-settings-lines-reference"
      />
      <ColumnHead
        v-if="renderer === Renderer.CARDS"
        cellClass="key-moments-editor-list__cell--wide"
        :label="t('keyMoments.settings.widgetDrawer.lines.headers.card')"
        :hint="t('keyMoments.settings.widgetDrawer.lines.hints.card')"
        testId="key-moments-settings-lines-card"
      />
      <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action" />
    </div>

    <ul
      ref="linesList"
      class="key-moments-editor-list list-style-none"
      data-list-id="widget-lines"
    >
      <li
        v-for="(line, index) in lines"
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
            <PIcon pName="gripVertical" />
          </span>
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--grow">
          <IndicatorSelect
            :modelValue="line.indicator"
            :vocabulary="vocabulary"
            :testId="`key-moments-settings-line-${index}-indicator-select`"
            @update:model-value="indicator => setLineIndicator(index, indicator)"
          />
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--medium">
          <PDropdown
            :modelValue="line.role"
            :pOptions="roleOptions"
            :pPlaceholder="t('keyMoments.settings.widgetDrawer.lines.roles.none')"
            pSize="small"
            pClearable
            :pTestId="`key-moments-settings-line-${index}-role-select`"
            @update:model-value="role => setLineRole(index, role)"
          />
        </span>

        <span
          v-if="renderer === Renderer.BALANCE_SHEET"
          class="key-moments-editor-list__cell key-moments-editor-list__cell--medium"
        >
          <PDropdown
            :modelValue="line.side"
            :pOptions="sideOptions"
            pSize="small"
            :pTestId="`key-moments-settings-line-${index}-side-select`"
            @update:model-value="side => updateLine(index, { side })"
          />
        </span>

        <span
          v-if="renderer === Renderer.CARDS"
          class="key-moments-editor-list__cell key-moments-editor-list__cell--grow"
        >
          <IndicatorSelect
            :modelValue="line.reference"
            :vocabulary="vocabulary"
            :testId="`key-moments-settings-line-${index}-reference-select`"
            @update:model-value="reference => setLineReference(index, reference)"
          />
        </span>

        <span
          v-if="renderer === Renderer.CARDS"
          class="key-moments-editor-list__cell key-moments-editor-list__cell--wide"
        >
          <PCheckbox
            :modelValue="isCardHidden(line.indicator)"
            :pTestId="`key-moments-settings-line-${index}-hide-card-checkbox`"
            @update:model-value="toggleHiddenCard(line.indicator)"
          >
            {{ t('keyMoments.settings.widgetDrawer.lines.hideCard') }}
          </PCheckbox>
        </span>

        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action">
          <PButton
            pSize="small"
            pIconOnly
            pType="tertiary"
            :aria-label="t('keyMoments.settings.widgetDrawer.lines.remove')"
            :pTestId="`key-moments-settings-line-${index}-remove-button`"
            @click="removeLine(index)"
          >
            <PIcon pName="trash" />
          </PButton>
        </span>
      </li>
    </ul>

    <PButton
      class="margin-top--2"
      pSize="small"
      pType="tertiary"
      pTestId="key-moments-settings-add-line-button"
      @click="addLine"
    >
      {{ t('keyMoments.settings.widgetDrawer.lines.add') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { PButton, PCheckbox, PDropdown, PIcon } from '@pulse/styleguide/components'
import { BalanceSheetSide, Renderer } from '@key-moments/enums/key-moments.enums'
import ColumnHead from '../column-head.vue'
import IndicatorSelect from '../../indicators/indicator-select.vue'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useSortableList } from '@key-moments/composables/use-sortable-list.composable'
import { LINE_ROLE_OPTIONS } from './widget-drawer.consts'
import { useWidgetDrawer } from './widget-drawer.composable'

const { t } = useI18n()

const { vocabulary } = storeToRefs(useTemplateEditorStore())

const {
  lines,
  renderer,
  addLine,
  removeLine,
  updateLine,
  moveLine,
  setLineIndicator,
  setLineRole,
  setLineReference,
  isCardHidden,
  toggleHiddenCard,
} = useWidgetDrawer()

const linesList = useTemplateRef<HTMLElement>('linesList')

// the id of a line is its place: a line is not named by anything else
useSortableList(linesList, {
  handle: '.key-moments-editor-handle',
  onMove: move => moveLine(Number(move.itemId), move.newIndex),
})

const roleOptions = computed(() => LINE_ROLE_OPTIONS.map(role => ({
  pValue: role,
  pLabel: t(`keyMoments.settings.widgetDrawer.lines.roles.${role}`),
})))

const sideOptions = computed(() => Object.values(BalanceSheetSide).map(side => ({
  pValue: side,
  pLabel: t(`keyMoments.settings.widgetDrawer.lines.sides.${side}`),
})))
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
