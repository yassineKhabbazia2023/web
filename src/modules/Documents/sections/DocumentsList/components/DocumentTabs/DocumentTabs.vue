<template>
  <PTabs
    v-model="tabSettingsActiveName"
    :stretch="tabSetting.stretch"
  >
    <PTabPane
      :pLabel="t('tabs.detail.label')"
      pName="1"
    >
      <DocumentDetailsTabPane
        :document="document"
        :selectedEntity="selectedEntity"
        :currentService="currentService"
      />
    </PTabPane>
  </PTabs>
</template>

<script setup lang="ts">
import { PTabs, PTabPane } from '@kpmg/styleguide'
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DocumentTabsProps } from './DocumentTabsTypes'
import DocumentDetailsTabPane from './conponents/DocumentDetailsTabPane'

defineProps<DocumentTabsProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const tabSetting = reactive({
  activeName: '1',
  stretch: false
})
const emit = defineEmits([
  'update:modelValue'
])

const tabSettingsActiveName = computed({
  get() {
    return tabSetting.activeName
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
<i18n lang="yaml">
  en-US:
    tabs:
      detail:
        label: 'Détails'
  fr-FR:
    tabs:
      detail:
        label: 'Détails'
</i18n>
