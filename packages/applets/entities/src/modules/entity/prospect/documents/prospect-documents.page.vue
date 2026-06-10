<template>
  <div
    class="
      prospect-documents
      flex
      flex--direction-column
    "
  >
    <PEntityHeader
      v-if="currentEntity"
      :pLegalName="currentEntity.legalName"
      :pAccountNumber="currentEntity.accountNumber"
      :pAccountType="currentEntity.accountType"
      class="prospect-documents__header margin-bottom--4"
    />
    <section
      class="
        prospect-documents__content
        flex
        flex--direction-column
        padding--6
      "
    >
      <div
        class="
          prospect-documents__toolbar
          flex
          flex--align-items-center
          flex--justify-content-space-between
          margin-bottom--4
        "
      >
        <PTitle pTitle="Documents" />
        <PButton
          pType="primary"
          pSize="small"
          data-testid="upload-document-button"
          @click="openFilePicker"
        >
          <PIcon pName="upload" />
          <span class="padding-left--2">Déposer un document</span>
        </PButton>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        class="prospect-documents__file-input"
      >
      <DocumentsList />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PButton, PEntityHeader, PIcon, PTitle } from '@pulse/styleguide/components'
import DocumentsList from './documents-list/documents-list.vue'

const { currentEntity } = storeToRefs(useCurrentEntityStore())

const fileInputRef = useTemplateRef<HTMLInputElement>('fileInputRef')

const openFilePicker = (): void => {
  fileInputRef.value?.click()
}
</script>

<style scoped lang="scss">
.prospect-documents {
  height: 100%;

  &__header {
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }

  &__file-input {
    display: none;
  }
}
</style>
