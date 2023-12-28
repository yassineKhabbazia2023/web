<template>
  <div class="document-details-container">
    <div class="details-content">
      <div
        class="field flex-100"
        v-if="isCertified"
      >
        <p class="label certified-tag">
          <PTag
            pColor="gray-900"
            pContent="Certifié"
            :pIconLeft="PIPatchCheck"
            pEffect="light"
            pSize="default"
            :pClosable="false"
            :pDisableTransitions="false"
            :pRound="false"
          />
        </p>
      </div>
      <div class="field flex-100">
        <p class="libelle">
          {{ t('label.type') }}
        </p>
        <p class="label">
          {{ document.type.replace('.', '').toUpperCase() }}
        </p>
      </div>
      <div class="field flex-100">
        <p class="libelle">
          {{ t('label.size') }}
        </p>
        <p class="label size">
          {{ getDocumentSize }}
        </p>
      </div>
      <div class="field flex-100">
        <p class="libelle">
          {{ t('label.path') }}
        </p>
        <p class="label">
          {{ document.folder.path.join(' > ') }}
        </p>
      </div>
      <div class="field flex-100">
        <p class="libelle">
          {{ t('label.createdBy') }}
        </p>
        <p class="label">
          {{ document.createdBy }}
        </p>
      </div>
      <div class="field flex-100">
        <p class="libelle">
          {{ t('label.date') }}
        </p>
        <p class="label">
          {{ formatDateStr(document.created) }}
        </p>
      </div>
      <div class="field flex-100">
        <p class="libelle">
          {{ t('label.modification') }}
        </p>
        <p class="label">
          {{ formatDateStr(document.updated) }}
        </p>
      </div>
      <div class="field flex-100" v-if="shouldDisplayPiaStatusTag">
        <p class="libelle">
          {{ t('label.status') }}
        </p>
        <p class="label">
          <PTag
            :pColor="getTagProps.type"
            :pContent="document.piaStatus.labelFr"
            :pIconLeft="getTagProps.icon"
            pEffect="light"
            pSize="default"
            :pClosable="false"
            :pDisableTransitions="false"
            :pRound="false"
          />
        </p>
      </div>
    </div>
    <PButton
      pType="primary"
      class="drawer-download-button"
      pSize="default"
      :pLoading="isLoading"
      pPlain
      @click="handleDownloadClick"
    >
      <PIcon class="el-button__icon--left">
        <PIUpload />
      </PIcon>
      {{ t('label.download') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { DocumentDetailsTabPaneProps, PiaStatusTag } from './DocumentDetailsTabPaneTypes'
import { formatDateStr } from '@/modules/common/helpers/dateFormatHelper'
import {
  PTag,
  PIPatchCheck,
  PICheckCircle,
  PIUpload,
  PIcon,
  PButton
} from '@kpmg/styleguide'
import { useDownloadDocuments } from
  '@/modules/Documents/components/DownloadDocuments/DownloadDocuments'
import { DownloadDocumentsComposableProps }
  // eslint-disable-next-line max-len
  from '@/modules/Documents/components/DownloadDocuments/DownloadDocumentsTypes'

const props = defineProps<DocumentDetailsTabPaneProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const downloadDocumentsProps:ComputedRef<DownloadDocumentsComposableProps> = computed(() => {
  return {
    selectedDocuments: [props.document],
    currentService: props.currentService,
    selectedEntity: props.selectedEntity
  }
})

const { handleDownloadDocumentsEvent } =
useDownloadDocuments(downloadDocumentsProps)

const tagIconByState = {
  success: PICheckCircle
}

const tagTypeProps = (piaStatus: string): PiaStatusTag => {
  switch (piaStatus) {
    case 'Collected':
      return { icon: tagIconByState.success, type: 'success' }
    case 'Duplicate':
      return { icon: tagIconByState.success, type: 'success' }
    case 'Archived':
      return { icon: tagIconByState.success, type: 'success' }
    default:
      return null
  }
}

const allowedPiaStatusTagsToDisplay = ref<string[]>(['Collected', 'Duplicate', 'Archived'])

const shouldDisplayPiaStatusTag = computed(() =>
  props.document.piaStatus &&
props.document.piaStatus.labelFr &&
allowedPiaStatusTagsToDisplay.value.includes(props.document.piaStatus.technicalName))

const getTagProps = computed(() => {
  return tagTypeProps(props.document.piaStatus.technicalName)
})

const isCertified = computed(() => {
  return props.document.properties?.HasSubscribedToVault
})

const getDocumentSize = computed(() => {
  return (props.document.size === 0 ? 0 : Math.floor(props.document.size / 1024)) + ' Ko'
})

const isLoading = ref(false)

const handleDownloadClick = () => {
  isLoading.value = true
  handleDownloadDocumentsEvent()
  isLoading.value = false
}
</script>
<i18n lang="yaml">
  en-US:
    label:
      type: 'Type du document'
      size: 'Taille du document'
      path: 'Emplacement du document'
      createdBy: 'Déposé par'
      date: 'Date du dépôt'
      modification: 'Dernière modification'
      status: 'Etat de transmission'
      download: 'Télécharger'
  fr-FR:
    label:
      type: 'Type du document'
      size: 'Taille du document'
      path: 'Emplacement du document'
      createdBy: 'Déposé par'
      date: 'Date du dépôt'
      modification: 'Dernière modification'
      status: 'Etat de transmission'
      download: 'Télécharger'
</i18n>
<style lang="scss">
.document-details-container {
  .details-content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;

    .field {
      margin-bottom: 24px;

      &.flex-50 {
        flex: 50%;
      }

      &.flex-100 {
        flex: 100%;
      }

      .libelle {
        padding-bottom: 4px;
        margin: 0;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        display: flex;
        align-items: center;
        color: var(--el-color-neutral-gray-500)
      }

      .label {
        margin: 0;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        display: flex;
        align-items: center;
        color: var(--black);
      }
    }
    .field:last-child {
      padding-bottom: 0px;
    }
  }
      .drawer-download-button{
      float:right;
      clear:left;
    }
}
</style>

