<template>
  <PTag
    :pColor="tagProperties.color"
    pEffect="light"
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
  PTag,
} from '@pulse/styleguide/components'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps({
  status: { type: String, required: true },
})
const statusMap = new Map([
  ['Todo', { color: 'cyan', content: t('to-do') }],
  ['Done', { color: 'success', content: t('done') }],
  ['Draft', { color: 'gray-900', content: t('draft') }],
])

const tagProperties: any = computed(() => statusMap.get(props.status))
</script>

<i18n lang="yaml">
  en-US:
    to-do: 'To do'
    draft: 'Draft'
    done: 'Done'
  fr-FR:
    to-do: 'En attente'
    draft: 'Brouillon'
    done: 'Fait'
</i18n>
