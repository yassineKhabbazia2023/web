<template>
  <PTag
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeft="tagProperties.icon"
    :pContent="tagProperties.content"
    :pClosable="false"
    :pRound="false"
    pSize="default"
    :pDisableTransitions="false"
  />
</template>

<i18n lang="yaml">
    en-US:
        incident: 'Incident'
        to-do: 'To do'
        in-progress: 'In progress'
        active: 'Active'
        inactive: 'Inactive'
    fr-FR:
        incident: 'Incident'
        to-do: 'A déposer'
        in-progress: 'En cours'
        active: 'Actif'
        inactive: 'Résilié'
</i18n>

<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PTag,
  PIExclamationTriangle,
  PIUpload,
  PIArrowRepeat,
  PICheckCircle,
  PIXCircle
} from '@kpmg/styleguide'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps({
  status: { type: String, required: true }
})
const statusMap = new Map([
  [10, { color: 'danger', icon: PIExclamationTriangle, content: t('incident') }],
  [20, { color: 'warning', icon: PIUpload, content: t('to-do') }],
  [30, { color: 'persian', icon: PIArrowRepeat, content: t('in-progress') }],
  [40, { color: 'success', icon: PICheckCircle, content: t('active') }],
  [50, { color: 'gray-300', icon: PIXCircle, content: t('inactive') }]
])

const tagProperties: any = computed(() => statusMap.get(Number(props.status)))
</script>
