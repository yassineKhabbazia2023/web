<template>
  <PTag
    v-if="tagProperties !== undefined"
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
import { PTag } from '@pulse/styleguide/components'
import { type PTagProps } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

type TagProps = {
  status: string
}

const props = defineProps<TagProps>()

interface StatusMap {
  color: PTagProps['pColor']
  iconName: PTagProps['pIconLeftName']
  content: PTagProps['pContent']
}

const statusMap = new Map<number, StatusMap>([
  [99, { color: 'cyan', iconName: 'hourglass', content: t('creating') }],
  [10, { color: 'danger', iconName: 'exclamationTriangle', content: t('incident') }],
  [20, { color: 'warning', iconName: 'upload', content: t('to-do') }],
  [30, { color: 'amethyste', iconName: 'arrowRepeat', content: t('in-progress') }],
  [40, { color: 'success', iconName: 'checkCircle', content: t('active') }],
  [50, { color: 'gray-900', iconName: 'xCircle', content: t('inactive') }],
])

const tagProperties = computed(() => statusMap.get(Number(props.status)))
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
