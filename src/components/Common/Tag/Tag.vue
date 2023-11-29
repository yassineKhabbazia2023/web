<template>
    <PTag
    v-if="status==='10'"
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeft="tagProperties.icon"
    :pContent="t('incident')"
    :pClosable="false"
    :pRound="false"
    pSize="default"
    :pDisableTransitions="false"
  />
  <PTag
    v-else-if="status==='20'"
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeft="tagProperties.icon"
    :pContent="t('to-do')"
    :pClosable="false"
    :pRound="false"
    pSize="default"
    :pDisableTransitions="false"
  />
  <PTag
    v-else-if="status==='30'"
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeft="tagProperties.icon"
    :pContent="t('in-progress')"
    :pClosable="false"
    :pRound="false"
    pSize="default"
    :pDisableTransitions="false"
  />
  <PTag
    v-else-if="status==='40'"
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeft="tagProperties.icon"
    :pContent="`${t('active')}`"
    :pClosable="false"
    :pRound="false"
    pSize="default"
    :pDisableTransitions="false"
  />
  <PTag
    v-else
    :pColor="tagProperties.color"
    pEffect="light"
    :pIconLeft="tagProperties.icon"
    :pContent="t('inactive')"
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

const tagProperties = computed(() => {
  // Fetch the tag property based on status
  let properties: any = statusMap.get(Number(props.status))

  // If no property is found or the icon is not set, set a default value
  if (!properties || !properties.icon) {
    properties = {
      ...properties,
      icon: PIXCircle // Default icon
    }
  }
  return properties
})
</script>
