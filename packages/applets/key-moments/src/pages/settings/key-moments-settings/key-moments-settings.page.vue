<template>
  <div
    class="padding--6"
    data-testid="key-moments-settings-page"
  >
    <PTitle class="margin-bottom--4">
      {{ t('keyMoments.settings.title') }}
    </PTitle>

    <PTabs
      v-model="activeTab"
      pTestId="key-moments-settings-tabs"
    >
      <PTabPane
        :pLabel="t('keyMoments.settings.tabs.templates')"
        :pName="SettingsTab.TEMPLATES"
        pTestId="key-moments-settings-templates-tab"
      >
        <TemplatesList />
      </PTabPane>

      <PTabPane
        :pLabel="t('keyMoments.settings.tabs.indicators')"
        :pName="SettingsTab.INDICATORS"
        pLazy
        pTestId="key-moments-settings-indicators-tab"
      >
        <Indicators />
      </PTabPane>

      <PTabPane
        :pLabel="t('keyMoments.settings.tabs.recommendations')"
        :pName="SettingsTab.RECOMMENDATIONS"
        pLazy
        pTestId="key-moments-settings-recommendations-tab"
      >
        <RecommendationsSettings />
      </PTabPane>
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTabs, PTabPane, PTitle } from '@pulse/styleguide/components'
import Indicators from '../indicators/indicators.page.vue'
import RecommendationsSettings from '../recommendations/recommendations-settings.page.vue'
import TemplatesList from '../templates-list/templates-list.page.vue'
import { SettingsTab } from './key-moments-settings.enums'

const { t } = useI18n()

const activeTab = ref<SettingsTab>(SettingsTab.TEMPLATES)
</script>
