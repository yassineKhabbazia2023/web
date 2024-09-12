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
    :pIcon="getFileIcon(data.name)"
    :pBold="false"
  />

  <PDoubleText
    v-else-if="fieldType === 'DocumentName' && isInSearchScope"
    pType="primary"
    :pDisabled="false"
    pProfile=""
    :pTitle="data.name"
    :pContent="getPathFromArray(data.folder?.path)"
    :pIcon="getFileIcon(data.name)"
    :pSelected="false"
  />

  <PTag
    v-else-if="fieldType === 'Tag' && isCertified && fieldName === ''"
    pColor="gray-900"
    pContent="Certifié"
    :pIconLeft="PIPatchCheck"
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
    :pIconLeft="getTagProps.icon"
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
  PIStars,
  PIArrowRepeat,
  PIExclamationTriangle,
  PICheckCircle,
  PText,
  PTag,
  PIPatchCheck,
  PDoubleText,
} from '@kpmg/styleguide'
import DocumentActions from '@/modules/Documents/sections/DocumentsList/components/DocumentsActions'
import { formatDateStr } from '@/modules/common/helpers/dateFormatHelper'
import { getFileIcon } from '@/modules/Documents/helpers/filesExtensions'
import type { TableElementPops, PiaStatusTag } from './TableElementTypes'
import { getPathFromArray } from '@/modules/Documents/helpers/pathBuildingHelper'

const props = defineProps<TableElementPops>()
const emit = defineEmits(['actions-dropdown-opened', 'toolbox-action-triggered'])

const tagIconByState = {
  default: PIStars,
  warning: PIArrowRepeat,
  danger: PIExclamationTriangle,
  success: PICheckCircle,
}

const tagTypeProps = (piaStatus: string): PiaStatusTag => {
  switch (piaStatus) {
    case 'New':
      return { icon: tagIconByState.default, type: '' }
    case 'Collectable':
      return { icon: tagIconByState.warning, type: 'warning' }
    case 'Collected':
      return { icon: tagIconByState.success, type: 'success' }
    case 'Duplicate':
      return { icon: tagIconByState.success, type: 'success' }
    case 'Error':
      return { icon: tagIconByState.danger, type: 'danger' }
    case 'Archived':
      return { icon: tagIconByState.success, type: 'success' }
    case 'NotTransmitted':
      return { icon: tagIconByState.danger, type: 'danger' }
    default:
      return { icon: tagIconByState.danger, type: 'danger' }
  }
}

const getTagProps = computed(() => {
  if (!props.data.piaStatus) return null
  if (props.fieldType !== 'Tag' || props.data.piaStatus.technicalName === null) return null
  return tagTypeProps(props.data.piaStatus.technicalName)
})

const isCertified = computed(() => {
  if (!props.data.properties?.HasSubscribedToVault) return false
  return props.data.properties.HasSubscribedToVault === 'Oui'
})

// Actions dropdown

const handleActionsDropdownOpening = () => {
  emit('actions-dropdown-opened', props.data, { label: props.fieldName })
}
const emitClickedAction = (action: string) => {
  emit('toolbox-action-triggered', action)
}
</script>
