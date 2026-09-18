<template>
  <div>
    <PFormItem
      v-if="renderer !== Renderer.BALANCE_IMAGE"
      :pLabel="t('keyMoments.settings.widgetDrawer.chart.kind')"
    >
      <PDropdown
        :modelValue="chart?.kind ?? ChartKind.GROUPED_BARS"
        :pOptions="kindOptions"
        pSize="small"
        pTestId="key-moments-settings-widget-chart-kind-select"
        @update:model-value="kind => setChartKind(String(kind))"
      />
    </PFormItem>

    <!-- Period charts: one series per indicator drawn, in reading order -->
    <template v-if="isComposition === false">
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
          :label="t('keyMoments.settings.widgetDrawer.chart.headers.indicator')"
          :hint="t('keyMoments.settings.widgetDrawer.chart.hints.indicator')"
          testId="key-moments-settings-series-indicator"
        />
        <ColumnHead
          cellClass="key-moments-editor-list__cell--wide"
          :label="t('keyMoments.settings.widgetDrawer.chart.headers.color')"
          :hint="t('keyMoments.settings.widgetDrawer.chart.hints.color')"
          testId="key-moments-settings-series-color"
        />
        <ColumnHead
          cellClass="key-moments-editor-list__cell--wide"
          :label="t('keyMoments.settings.widgetDrawer.chart.headers.type')"
          :hint="t('keyMoments.settings.widgetDrawer.chart.hints.type')"
          testId="key-moments-settings-series-type"
        />
        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action" />
      </div>

      <ul
        ref="seriesList"
        class="key-moments-editor-list list-style-none"
        data-list-id="widget-series"
      >
        <li
          v-for="(entry, index) in series"
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

          <span class="key-moments-editor-list__cell key-moments-editor-list__cell--grow">
            <IndicatorSelect
              :modelValue="entry.indicator"
              :vocabulary="vocabulary"
              :testId="`key-moments-settings-series-${index}-indicator-select`"
              @update:model-value="indicator => setSeriesIndicator(index, indicator)"
            />
          </span>

          <span class="key-moments-editor-list__cell key-moments-editor-list__cell--wide">
            <PDropdown
              :modelValue="entry.color"
              :pOptions="colorOptions"
              pSize="small"
              :pTestId="`key-moments-settings-series-${index}-color-select`"
              @update:model-value="color => updateSeries(index, { color })"
            />
          </span>

          <span class="key-moments-editor-list__cell key-moments-editor-list__cell--wide">
            <PDropdown
              :modelValue="entry.type ?? ChartSeriesType.BAR"
              :pOptions="seriesTypeOptions"
              pSize="small"
              :pTestId="`key-moments-settings-series-${index}-type-select`"
              @update:model-value="type => setSeriesType(index, type)"
            />
          </span>

          <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action">
            <PButton
              pSize="small"
              pIconOnly
              pType="tertiary"
              :aria-label="t('keyMoments.settings.widgetDrawer.chart.removeSeries')"
              :pTestId="`key-moments-settings-series-${index}-remove-button`"
              @click="removeSeries(index)"
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
          pTestId="key-moments-settings-add-series-button"
          @click="addSeries"
        >
          {{ t('keyMoments.settings.widgetDrawer.chart.addSeries') }}
        </PButton>
        <PButton
          pSize="small"
          pType="tertiary"
          pTestId="key-moments-settings-sync-lines-button"
          @click="syncLinesFromSeries"
        >
          {{ t('keyMoments.settings.widgetDrawer.chart.syncLines') }}
        </PButton>
      </div>

      <PFormItem
        class="margin-top--3"
        :pLabel="t('keyMoments.settings.widgetDrawer.chart.primaryAxisTitle')"
      >
        <PInput
          :modelValue="chart?.primaryAxisTitle ?? ''"
          pSize="small"
          pTestId="key-moments-settings-chart-primary-axis-input"
          @update:model-value="(title: string | number) => setAxisTitle('primaryAxisTitle', String(title))"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.chart.secondaryAxisTitle')">
        <PInput
          :modelValue="chart?.secondaryAxisTitle ?? ''"
          pSize="small"
          pTestId="key-moments-settings-chart-secondary-axis-input"
          @update:model-value="(title: string | number) => setAxisTitle('secondaryAxisTitle', String(title))"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.chart.periods')">
        <PDropdown
          :modelValue="chart?.periods ?? []"
          :pOptions="periodKeyOptions"
          pSize="small"
          pMultiple
          :pPlaceholder="t('keyMoments.settings.widgetDrawer.chart.allPeriods')"
          pTestId="key-moments-settings-chart-periods-select"
          @update:model-value="setChartPeriods"
        />
      </PFormItem>
    </template>

    <!-- Composition: one period split into labelled columns -->
    <template v-else>
      <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.chart.period')">
        <PDropdown
          :modelValue="chart?.period ?? PeriodRole.CURRENT"
          :pOptions="periodOptions"
          pSize="small"
          pTestId="key-moments-settings-chart-period-select"
          @update:model-value="period => setChart({ period })"
        />
      </PFormItem>

      <PFormItem :pLabel="t('keyMoments.settings.widgetDrawer.chart.stacks')">
        <PDropdown
          :modelValue="chart?.stacks ?? []"
          :pOptions="indicatorOptions"
          pSize="small"
          pMultiple
          pFilterable
          pTestId="key-moments-settings-chart-stacks-select"
          @update:model-value="stacks => setChart({ stacks })"
        />
      </PFormItem>

      <div
        class="
          key-moments-editor-list__head
          flex
          flex--align-items-center
          flex-gap--2
        "
      >
        <ColumnHead
          cellClass="key-moments-editor-list__cell--grow"
          :label="t('keyMoments.settings.widgetDrawer.chart.headers.group')"
          :hint="t('keyMoments.settings.widgetDrawer.chart.hints.group')"
          testId="key-moments-settings-group-label"
        />
        <ColumnHead
          cellClass="key-moments-editor-list__cell--wide"
          :label="t('keyMoments.settings.widgetDrawer.chart.headers.color')"
          :hint="t('keyMoments.settings.widgetDrawer.chart.hints.color')"
          testId="key-moments-settings-group-color"
        />
        <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action" />
      </div>

      <ul class="key-moments-editor-list list-style-none">
        <li
          v-for="(group, index) in groups"
          :key="index"
          class="key-moments-editor-list__row"
        >
          <div
            class="
              flex
              flex--align-items-center
              flex-gap--2
            "
          >
            <span class="key-moments-editor-list__cell key-moments-editor-list__cell--grow">
              <PInput
                :modelValue="group.label"
                pSize="small"
                :pPlaceholder="t('keyMoments.settings.widgetDrawer.chart.groupLabel')"
                :pTestId="`key-moments-settings-group-${index}-label-input`"
                @update:model-value="(label: string | number) => updateGroup(index, { label: String(label) })"
              />
            </span>
            <span class="key-moments-editor-list__cell key-moments-editor-list__cell--wide">
              <PDropdown
                :modelValue="group.color"
                :pOptions="colorOptions"
                pSize="small"
                :pTestId="`key-moments-settings-group-${index}-color-select`"
                @update:model-value="color => updateGroup(index, { color })"
              />
            </span>
            <span class="key-moments-editor-list__cell key-moments-editor-list__cell--action">
              <PButton
                pSize="small"
                pIconOnly
                pType="tertiary"
                :aria-label="t('keyMoments.settings.widgetDrawer.chart.removeGroup')"
                :pTestId="`key-moments-settings-group-${index}-remove-button`"
                @click="removeGroup(index)"
              >
                <PIcon pName="trash" />
              </PButton>
            </span>
          </div>

          <PDropdown
            class="margin-top--2"
            :modelValue="group.indicators"
            :pOptions="indicatorOptions"
            pSize="small"
            pMultiple
            pFilterable
            :pTestId="`key-moments-settings-group-${index}-indicators-select`"
            @update:model-value="indicators => updateGroup(index, { indicators })"
          />
        </li>
      </ul>

      <PButton
        class="margin-top--2"
        pSize="small"
        pType="tertiary"
        pTestId="key-moments-settings-add-group-button"
        @click="addGroup(t('keyMoments.settings.widgetDrawer.chart.newGroup'))"
      >
        {{ t('keyMoments.settings.widgetDrawer.chart.addGroup') }}
      </PButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { PButton, PDropdown, PFormItem, PIcon, PInput } from '@pulse/styleguide/components'
import { ChartKind, ChartSeriesType, PeriodRole, Renderer } from '@key-moments/enums/key-moments.enums'
import { KEY_MOMENTS_COLOR } from '@key-moments/const/key-moments.consts'
import ColumnHead from '../column-head.vue'
import IndicatorSelect from '../../indicators/indicator-select.vue'
import { useTemplateEditorStore } from '@key-moments/stores/template-editor.store'
import { useSortableList } from '@key-moments/composables/use-sortable-list.composable'
import {
  CHART_PERIOD_OPTIONS,
  COLOR_TOKEN_OPTIONS,
  PERIOD_OPTIONS,
  SERIES_TYPE_OPTIONS,
} from './widget-drawer.consts'
import { useWidgetDrawer } from './widget-drawer.composable'

const { t } = useI18n()

const { vocabulary } = storeToRefs(useTemplateEditorStore())

const {
  renderer,
  chart,
  series,
  groups,
  setChart,
  setChartKind,
  setAxisTitle,
  setChartPeriods,
  addSeries,
  updateSeries,
  setSeriesIndicator,
  setSeriesType,
  removeSeries,
  moveSeries,
  addGroup,
  updateGroup,
  removeGroup,
  syncLinesFromSeries,
} = useWidgetDrawer()

const seriesList = useTemplateRef<HTMLElement>('seriesList')

useSortableList(seriesList, {
  handle: '.key-moments-editor-handle',
  onMove: move => moveSeries(Number(move.itemId), move.newIndex),
})

/** The balance image is a composition and nothing else: its kind is not offered */
const isComposition = computed(() => renderer.value === Renderer.BALANCE_IMAGE
  || chart.value?.kind === ChartKind.COMPOSITION)

const kindOptions = computed(() => Object.values(ChartKind).map(kind => ({
  pValue: kind,
  pLabel: t(`keyMoments.settings.widgetDrawer.chart.kinds.${kind}`),
})))

const seriesTypeOptions = computed(() => SERIES_TYPE_OPTIONS.map(type => ({
  pValue: type,
  pLabel: t(`keyMoments.settings.widgetDrawer.chart.seriesTypes.${type}`),
})))

/** Named by the token the template writes, and by the ink it resolves to */
const colorOptions = computed(() => COLOR_TOKEN_OPTIONS.map(token => ({
  pValue: token,
  pLabel: t(`keyMoments.settings.colors.${token}`),
  pDescription: KEY_MOMENTS_COLOR[token],
})))

const periodOptions = computed(() => PERIOD_OPTIONS.map(period => ({
  pValue: period,
  pLabel: period === PeriodRole.CURRENT || period === PeriodRole.REFERENCE
    ? t(`keyMoments.settings.widgetDrawer.chart.periodRoles.${period}`)
    : period,
})))

const periodKeyOptions = computed(() => CHART_PERIOD_OPTIONS.map(key => ({ pValue: key, pLabel: key })))

const indicatorOptions = computed(() => vocabulary.value.map(indicator => ({
  pValue: indicator.id,
  pLabel: `${indicator.label} · ${indicator.id}`,
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
