<template>
  <div>
    <PCheckbox
      :modelValue="usesDefaultMeasures"
      pTestId="key-moments-settings-widget-default-measures-checkbox"
      @update:model-value="setUsesDefaultMeasures(usesDefaultMeasures === false)"
    >
      {{ t('keyMoments.settings.measures.useDefaults') }}
    </PCheckbox>

    <MeasuresList
      v-if="usesDefaultMeasures === false"
      class="margin-top--3"
      :measures="measures"
      testIdPrefix="key-moments-settings-widget"
      @add="addMeasure"
      @update="updateMeasure"
      @remove="removeMeasure"
      @move="moveMeasure"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PCheckbox } from '@pulse/styleguide/components'
import MeasuresList from '../measures-list.vue'
import { useWidgetDrawer } from './widget-drawer.composable'

const { t } = useI18n()

const {
  usesDefaultMeasures,
  measures,
  setUsesDefaultMeasures,
  addMeasure,
  updateMeasure,
  removeMeasure,
  moveMeasure,
} = useWidgetDrawer()
</script>
