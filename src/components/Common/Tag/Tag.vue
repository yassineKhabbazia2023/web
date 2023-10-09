<template>
    <PTag
    v-if="status==='10'"
    :pColor="tagProperties.color"
    effect="light"
    :iconLeft="tagProperties.icon"
    :content="t('incident')"
    type=""
    color=""
    :closable="false"
    :round="false"
    :hit="false"
    size="default"
    :disableTransitions="false"
  />
  <PTag
    v-else-if="status==='20'"
    :pColor="tagProperties.color"
    effect="light"
    :iconLeft="tagProperties.icon"
    :content="t('to-do')"
    type=""
    color=""
    :closable="false"
    :round="false"
    :hit="false"
    size="default"
    :disableTransitions="false"
  />
  <PTag
    v-else-if="status==='30'"
    :pColor="tagProperties.color"
    effect="light"
    :iconLeft="tagProperties.icon"
    :content="t('in-progress')"
    type=""
    color=""
    :closable="false"
    :round="false"
    :hit="false"
    size="default"
    :disableTransitions="false"
  />
  <PTag
    v-else-if="status==='40'"
    :pColor="tagProperties.color"
    effect="light"
    :iconLeft="tagProperties.icon"
    :content="`${t('active')}`"
    type=""
    color=""
    :closable="false"
    :round="false"
    :hit="false"
    size="default"
    :disableTransitions="false"
  />
  <PTag
    v-else
    :pColor="tagProperties.color"
    effect="light"
    :iconLeft="tagProperties.icon"
    :content="t('inactive')"
    type=""
    color=""
    :closable="false"
    :round="false"
    :hit="false"
    size="default"
    :disableTransitions="false"
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
import { useI18n } from 'vue-i18n'
import {
  PTag, PIExclamationTriangle, PIUpload, PIArrowRepeat,
  PICheckCircle, PIXCircle
} from '@kpmg/styleguide'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps({
  status: { type: String, required: true }
})
const statusMap = new Map([
  [10, { color: 'danger', icon: PIExclamationTriangle }],
  [20, { color: 'warning', icon: PIUpload }],
  [30, { color: 'persian', icon: PIArrowRepeat }],
  [40, { color: 'success', icon: PICheckCircle }],
  [50, { color: 'gray-300', icon: PIXCircle }]
])

const tagProperties: any = statusMap.get(Number(props.status))
</script>

