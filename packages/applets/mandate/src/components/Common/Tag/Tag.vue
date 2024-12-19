<template>
  <PTag
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeftName="tagProperties.iconName"
    :pContent="tagProperties.content"
    :pClosable="false"
    :pRound="false"
    pSize="default"
    :pDisableTransitions="false"
  />
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PIArrowRepeat,
  PICheckCircle,
  PIExclamationTriangle,
  PIHourglass,
  PIUpload,
  PIXCircle,
  PTag,
} from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

type TagProps = {
  status: string
}

const props = defineProps<TagProps>()

const statusMap = new Map([
  [99, { color: 'cyan', icon: PIHourglass, content: t('creating') }],
  [10, { color: 'danger', icon: PIExclamationTriangle, content: t('incident') }],
  [20, { color: 'warning', icon: PIUpload, content: t('to-do') }],
  [30, { color: 'amethyste', icon: PIArrowRepeat, content: t('in-progress') }],
  [40, { color: 'success', icon: PICheckCircle, content: t('active') }],
  [50, { color: 'gray-900', icon: PIXCircle, content: t('inactive') }],
])

const tagProperties: any = computed(() => statusMap.get(Number(props.status)))
</script>

<i18n lang="yaml">
  en-US:
    creating: 'Creating'
    incident: 'Incident'
    to-do: 'To do'
    in-progress: 'In progress'
    active: 'Active'
    inactive: 'Inactive'
  fr-FR:
    creating: 'En création'
    incident: 'Incident'
    to-do: 'À déposer'
    in-progress: 'En cours'
    active: 'Actif'
    inactive: 'Résilié'
</i18n>
