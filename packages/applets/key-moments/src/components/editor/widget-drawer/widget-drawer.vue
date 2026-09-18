<template>
  <!-- Wide: the sections below are lists — of lines, of columns and of series -->
  <PDrawer
    v-model="isOpen"
    :pTitle="widget?.display.title"
    pSize="75%"
    pTestId="key-moments-settings-widget-drawer"
    @close-drawer-button="cancel"
  >
    <PForm>
      <PCollapse
        v-if="widget !== undefined"
        pTestId="key-moments-settings-widget-sections"
      >
        <PCollapseItem :pTitleCollapseItem="t('keyMoments.settings.widgetDrawer.sections.general')">
          <WidgetGeneralSection />
        </PCollapseItem>

        <PCollapseItem :pTitleCollapseItem="t('keyMoments.settings.widgetDrawer.sections.lines')">
          <WidgetLinesSection />
        </PCollapseItem>

        <PCollapseItem :pTitleCollapseItem="t('keyMoments.settings.widgetDrawer.sections.measures')">
          <WidgetMeasuresSection />
        </PCollapseItem>

        <PCollapseItem
          v-if="renderer === Renderer.CARDS"
          :pTitleCollapseItem="t('keyMoments.settings.widgetDrawer.sections.cards')"
        >
          <WidgetCardsSection />
        </PCollapseItem>

        <PCollapseItem
          v-if="hasChart"
          :pTitleCollapseItem="t('keyMoments.settings.widgetDrawer.sections.chart')"
        >
          <WidgetChartSection />
        </PCollapseItem>
      </PCollapse>

      <!--
        Said here rather than on one field: what it names — a title, the lines —
        sits in a section the reader may have folded away.
      -->
      <PAlert
        v-if="draftError !== undefined"
        class="margin-top--4"
        pType="error"
        data-testid="key-moments-settings-widget-drawer-error"
      >
        {{ draftError }}
      </PAlert>
    </PForm>

    <template #footer>
      <PDrawerActions
        :pSecondaryCTA="{
          pLabel: t('keyMoments.settings.drawerActions.cancel'),
          pTestId: 'key-moments-settings-widget-drawer-cancel-button',
        }"
        :pPrimaryCTA="{
          pLabel: t('keyMoments.settings.drawerActions.save'),
          pDisabled: draftIdError !== undefined || draftError !== undefined,
          pTestId: 'key-moments-settings-widget-drawer-save-button',
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
import {
  PAlert,
  PCollapse,
  PCollapseItem,
  PDrawer,
  PDrawerActions,
  PForm,
} from '@pulse/styleguide/components'
import { Renderer } from '@key-moments/enums/key-moments.enums'
import WidgetCardsSection from './widget-cards-section.vue'
import WidgetChartSection from './widget-chart-section.vue'
import WidgetGeneralSection from './widget-general-section.vue'
import WidgetLinesSection from './widget-lines-section.vue'
import WidgetMeasuresSection from './widget-measures-section.vue'
import { useWidgetDrawer } from './widget-drawer.composable'

const { t } = useI18n()

const { isOpen, widget, renderer, draftIdError, draftError, cancel, save } = useWidgetDrawer()

/**
 * A chart is a block a widget may carry beside its renderer: the cards of the
 * financial analysis are drawn from one, and the balance image is one.
 */
const hasChart = computed(() => renderer.value === Renderer.CHART
  || renderer.value === Renderer.BALANCE_IMAGE
  || renderer.value === Renderer.CARDS)
</script>
