<template>
  <div
    class="documents-list"
    :class="{ 'documents-list--no-valid-document': !filteredSortedDocuments?.length }"
  >
    <PFileAndFolderLineCheck
      v-for="(document, index) in filteredSortedDocuments"
      :key="index"
      v-model="document.isSelected"
      :pFileName="document.content.name"
      pIsFolderLine
      :pState="getDocumentState(document?.givenActionState)"
      class="documents-list__document"
    />

    <div
      v-if="filteredSortedDocuments?.length === 0"
      class="no-documents-badge"
    >
      <div class="no-documents-badge__wrapper">
        <PImage
          class="no-documents-badge__wrapper__illustration"
          pType="badges"
          pName="warning"
        />

        <div class="no-documents-badge__wrapper__label">
          <p>{{ documentsSelectorEmptyDocumentsListLabel }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DocumentsListProps } from './DocumentsListTypes'
import { PFileAndFolderLineCheck, PImage } from '@kpmg/styleguide'

const props = withDefaults(defineProps<DocumentsListProps>(), {
  isFolderLine: false,
})
const documents = ref(props.documents)

const getDocumentState = (givenActionState: string) => {
  switch (givenActionState) {
    case 'TO_DO':
      return 'default'
    case 'IN_PROGRESS':
      return 'loading'
    case 'DONE':
      return 'success'
    case 'FAILED':
      return 'error'
    default:
      return 'default'
  }
}

const sortedDocumentsByState = computed(() => {
  const stateOrder = ['IN_PROGRESS', 'TO_DO', 'ERROR', 'DONE']

  const getSateIndex = (input: any) => {
    return stateOrder.indexOf(input?.givenActionState)
  }
  const sortedDocuments = documents.value
  return sortedDocuments.sort((a, b) => getSateIndex(a) - getSateIndex(b))
})

const filteredSortedDocuments = computed(() => sortedDocumentsByState.value.filter(
  (x) => x?.givenActionState !== 'ERROR',
))
// eslint-disable-next-line vitest/require-hook
watch(
  () => props.documents,
  (updatedDocuments) => {
    documents.value = updatedDocuments
  },
)
</script>

<style lang="scss">
.documents-list {

  &--no-valid-document {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__document {
    margin-bottom: 4px;
    width: 100%;
  }

  .no-documents-badge {

    transform: translateY(-25%);

    &__wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &__illustration {
        width: 75px;
        height: 80px;
        margin-bottom: 24px;
      }

      &__label {
        max-width: 242px;
        text-align: center;
        color: var(--el-color-neutral-gray-500);
        font-size: 12px;
        font-weight: 400;
        line-height: 120%;
      }
    }
  }
}

svg.p-loader__icon--gradient {
  path[fill-rule='evenodd']{
    fill: var(--el-color-persian-500)
  }
}
</style>
