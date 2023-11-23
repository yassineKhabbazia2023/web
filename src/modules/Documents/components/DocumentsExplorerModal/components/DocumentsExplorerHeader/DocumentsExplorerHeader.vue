<template>
  <PCollapse
    v-if="documents?.length"
    modelValue="1"
    accordion
  >
    <PCollapseItem
      pType="alert"
      :pTitleCollapseItem="firstCollapseItem?.pTitleCollapseItem"
      name="wrapper"
    >
      <div class="files-error-container">
        <PTooltip
          v-for="(file, index) in filteredFailedDocuments"
          :key="index"
          :content="getFileErrorDescription(file?.codeError)"
          placement="bottom"
        >
          <div class="files-error-container__item">
            <PFileAndFolderLineCheck
              :modelValue="false"
              :fileName="file?.name"
              :additionalText="getFileErrorMessage(file?.codeError)"
              state="error"
              class="files-error-item"
            />
          </div>
        </PTooltip>
      </div>
    </PCollapseItem>
  </PCollapse>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import {
  PCollapse,
  PCollapseItem,
  PIExclamationTriangle,
  PFileAndFolderLineCheck,
  PTooltip
} from '@kpmg/styleguide'
import { type DocumentsExplorerHeaderProps } from './DocumentsExplorerHeaderTypes'
import {
  getFileErrorMessage,
  getFileErrorDescription
} from '@/modules/common/helpers/documentCodeErrorHelper'

const props = defineProps<DocumentsExplorerHeaderProps>()

const firstCollapseItem = reactive({
  pTitleCollapseItem: props.headerTitle,
  pIcon: PIExclamationTriangle
})

const filteredFailedDocuments = computed(() => props.documents
  .filter((d) => d.givenActionState === 'ERROR')
  .map(doc => ({ name: doc.content.name, codeError: doc.codeError }))
)
</script>

<style lang="scss">
@use '@/utils/breakpoints';

.files-error-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 8px;
  &__item {
    // using calc divided by 3 is causing bad roundings,
    // so we better use fixed 33% which we'll be litteraly not visible by human eyes
    width: calc(33% - 4px);

    @include breakpoints.media(md) {
      width: calc(50% - 4px);
    }
  }
}

.files-error-item {
  background-color: var(--el-color-base-white);
}
</style>
