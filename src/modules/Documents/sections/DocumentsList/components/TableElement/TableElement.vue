<template>
  <PText
    v-if="fieldType === 'Text'"
    :content="formatDate(data.created)"
    type="primary"
    :bold="false"
    :selected="false"
    :disabled="false"
  />

  <PText
    v-else-if="fieldType === 'DocumentName'"
    :content="data.name"
    :icon="getFileIcon(data.name)"
    type="primary"
    :bold="false"
    :selected="false"
    :disabled="false"
  />

  <PTag
    v-else-if="fieldType === 'Tag' && isCertified && fieldName === ''"
    pColor="gray-900"
    content="Certifié"
    :iconLeft="PIPatchCheck"
    color=""
    effect="light"
    size="default"
    type=""
    :closable="false"
    :disableTransitions="false"
    :hit="false"
    :round="false"
  />

  <PTag
    v-else-if="fieldType === 'Tag' && getTagProps !== null && fieldName === 'Statut'"
    :pColor="getTagProps.type"
    :content="data.piaStatus.labelFr"
    :iconLeft="getTagProps.icon"
    color=""
    effect="light"
    size="default"
    type=""
    :closable="false"
    :disableTransitions="false"
    :hit="false"
    :round="false"
  />

  <DocumentActions
    v-else-if="fieldType === 'ActionGroup'"
    :permissions="data.permissions"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PIFileText,
  PIFiletypeBmp,
  PIFiletypeCsv,
  PIFiletypeDoc,
  PIFiletypeDocx,
  PIFiletypeGif,
  PIFiletypeHeic,
  PIFiletypeJpg,
  PIFiletypeMd,
  PIFiletypePdf,
  PIFiletypePng,
  PIFiletypePpt,
  PIFiletypePptx,
  PIFiletypeRaw,
  PIFiletypeSvg,
  PIFiletypeTiff,
  PIFiletypeTxt,
  PIFiletypeXls,
  PIFiletypeXlsx,
  PIFiletypeXml,
  PIStars,
  PIArrowRepeat,
  PIExclamationTriangle,
  PICheckCircle,
  PText,
  PTag,
  PIPatchCheck
} from '@kpmg/styleguide'
import DocumentActions from '@/modules/Documents/sections/DocumentsList/components/DocumentsActions'
import { formatDate } from '@/modules/common/helpers/dateFormatHelper'
import type { TableElementPops, PiaStatusTag } from './TableElementTypes'

const props = defineProps<TableElementPops>()

const getFileIcon = (fileName: string) => {
  switch (fileName.split('.').pop()) {
    case 'bmp':
      return PIFiletypeBmp
    case 'csv':
      return PIFiletypeCsv
    case 'doc':
      return PIFiletypeDoc
    case 'docx':
      return PIFiletypeDocx
    case 'gif':
      return PIFiletypeGif
    case 'heic':
      return PIFiletypeHeic
    case 'jpg':
      return PIFiletypeJpg
    case 'md':
      return PIFiletypeMd
    case 'pdf':
      return PIFiletypePdf
    case 'png':
      return PIFiletypePng
    case 'ppt':
      return PIFiletypePpt
    case 'pptx':
      return PIFiletypePptx
    case 'raw':
      return PIFiletypeRaw
    case 'svg':
      return PIFiletypeSvg
    case 'tiff':
      return PIFiletypeTiff
    case 'txt':
      return PIFiletypeTxt
    case 'xls':
      return PIFiletypeXls
    case 'xlsx':
      return PIFiletypeXlsx
    case 'xml':
      return PIFiletypeXml
    default:
      return PIFileText
  }
}

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
</script>
