<template>
  <PText
    v-if="fieldType === 'Text'"
    :pContent="formatDateStr(data.created)"
    pType="primary"
    :pBold="false"
    :selected="false"
    :disabled="false"
  />

  <PText
    v-else-if="fieldType === 'DocumentName' && !isInSearchScope"
    :pContent="data.name"
    pType="primary"
    :selected="false"
    :disabled="false"
    :pIconName="getIconName(data.name, 'fileText')"
    :pBold="false"
  />

  <PDoubleText
    v-else-if="fieldType === 'DocumentName' && isInSearchScope"
    pType="primary"
    :pDisabled="false"
    pProfile=""
    :pTitle="data.name"
    :pContent="getPathFromArray(data.folder?.path)"
    :pIconName="getIconName(data.name, 'fileText')"
    :pSelected="false"
  />

  <PTag
    v-else-if="fieldType === 'Tag' && isCertified && fieldName === ''"
    pColor="gray-900"
    pContent="Certifié"
    pIconLeftName="patchCheck"
    pEffect="light"
    pSize="default"
    :pClosable="false"
    :pDisableTransitions="false"
    :pRound="false"
  />

  <PTag
    v-else-if="fieldType === 'Tag' && getTagProps !== null && fieldName === 'Statut'"
    :pColor="getTagProps.type"
    :pContent="data.piaStatus.labelFr"
    :pIconLeftName="getTagProps.iconName"
    pEffect="light"
    pSize="default"
    :pClosable="false"
    :pDisableTransitions="false"
    :pRound="false"
    pType="primary"
  />

  <DocumentActions
    v-else-if="fieldType === 'ActionGroup'"
    :permissions="data.permissions"
    :isInSearchScope="isInSearchScope"
    @p-toolbox-item-clicked="emitClickedAction"
    @actions-dropdown-opened="handleActionsDropdownOpening"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PText,
  PTag,
  PDoubleText,
} from '@pulse/styleguide/components'
import DocumentActions from '@ged/modules/Documents/sections/DocumentsList/components/DocumentsActions'
import { formatDateStr } from '@ged/modules/common/helpers/dateFormatHelper'
import { getIconName } from '@pulse/styleguide'
import { type IconName } from '@pulse/styleguide/types'
import type { TableElementPops, PiaStatusTag } from './TableElementTypes'
import { getPathFromArray } from '@ged/modules/Documents/helpers/pathBuildingHelper'

const props = defineProps<TableElementPops>()
const emit = defineEmits(['actions-dropdown-opened', 'toolbox-action-triggered'])

const tagIconByState: Record<string, IconName> = {
  default: 'stars',
  warning: 'arrowRepeat',
  danger: 'exclamationTriangle',
  success: 'checkCircle',
}

const tagTypeProps = (piaStatus: string): PiaStatusTag => {
  switch (piaStatus) {
  case 'New':
    return { iconName: tagIconByState.default, type: '' }
  case 'Collectable':
    return { iconName: tagIconByState.warning, type: 'warning' }
  case 'Collected':
    return { iconName: tagIconByState.success, type: 'success' }
  case 'Duplicate':
    return { iconName: tagIconByState.success, type: 'success' }
  case 'Error':
    return { iconName: tagIconByState.danger, type: 'danger' }
  case 'Archived':
    return { iconName: tagIconByState.success, type: 'success' }
  case 'NotTransmitted':
    return { iconName: tagIconByState.danger, type: 'danger' }
  default:
    return { iconName: tagIconByState.danger, type: 'danger' }
  }
}

const getTagProps = computed(() => {
  if (!props.data.piaStatus) {
    return null
  }
  if (props.fieldType !== 'Tag' || props.data.piaStatus.technicalName === null) {
    return null
  }
  return tagTypeProps(props.data.piaStatus.technicalName)
})

const isCertified = computed(() => {
  return props.data.properties?.HasSubscribedToVault !== undefined
})

// Actions dropdown

const handleActionsDropdownOpening = () => {
  emit('actions-dropdown-opened', props.data, { label: props.fieldName })
}
const emitClickedAction = (action: string) => {
  emit('toolbox-action-triggered', action)
}
</script>
