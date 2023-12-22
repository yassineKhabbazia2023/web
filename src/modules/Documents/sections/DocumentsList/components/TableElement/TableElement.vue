<template>
  <PText
    v-if="fieldType === 'Text'"
    :pContent="formatDateStr(data.created)"
    pType="primary"
    :bold="false"
    :selected="false"
    :disabled="false"
  />

  <PText
    v-else-if="fieldType === 'DocumentName'"
    :pContent="data.name"
    pType="primary"
    :selected="false"
    :disabled="false"
    :pIcon="getFileIcon(data.name)"
    :pBold="false"
  />

  <PTag
    v-else-if="fieldType === 'Tag' && isCertified && fieldName === ''"
    pColor="gray-900"
    pContent="Certifié"
    :pIconLeft="PIPatchCheck"
    pEffect="light"
    size="default"
    :closable="false"
    :disableTransitions="false"
    :hit="false"
    :round="false"
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
    :hit="false"
    :pRound="false"
    pType="primary"
  />

  <DocumentActions
    v-else-if="fieldType === 'ActionGroup'"
    :permissions="data.permissions"
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
  PIPatchCheck
} from '@kpmg/styleguide'
import DocumentActions from '@/modules/Documents/sections/DocumentsList/components/DocumentsActions'
import { formatDateStr } from '@/modules/common/helpers/dateFormatHelper'
import { getFileIcon } from '@/modules/Documents/helpers/filesExtensions'
import type { TableElementPops, PiaStatusTag } from './TableElementTypes'

const props = defineProps<TableElementPops>()

const emit = defineEmits(['actions-dropdown-opened', 'toolbox-action-triggered'])

const tagIconByState = {
  default: PIStars,
  warning: PIArrowRepeat,
  danger: PIExclamationTriangle,
  success: PICheckCircle
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
  if (props.fieldType !== 'Tag' || props.data.piaStatus.technicalName === null) return null
  return tagTypeProps(props.data.piaStatus.technicalName)
})

const isCertified = computed(() => {
  return props.data.properties.HasSubscribedToVault === 'Oui'
})

// Actions dropdown

const handleActionsDropdownOpening = () => {
  emit('actions-dropdown-opened')
}
const emitClickedAction = (action: string) => {
  emit('toolbox-action-triggered', action)
}
</script>
