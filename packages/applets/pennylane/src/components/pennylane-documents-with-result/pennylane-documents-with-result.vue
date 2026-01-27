<template>
  <ul
    data-testid="pennylane-documents-with-result"
    class="
      list-style-none
      flex
      flex--direction-column
      flex-gap--3
      margin-right--2
      overflow-hidden
      width--100
    "
  >
    <li
      v-for="(pennylaneDocument, index) in internalPennylaneDocuments"
      :key="index"
      class="
        flex
        flex--align-items-center
        padding-y--2
        cursor-pointer
        hover-bg--tranquil-50
        overflow-hidden
      "
      @click="onClickDocument(pennylaneDocument)"
    >
      <div
        class="
          text-color--neutral-gray-900
          margin-right--2
        "
      >
        <PIcon
          :pName="pennylaneDocument.iconName"
          pSize="16"
        />
      </div>
      <ul
        class="
          list-style-none
          overflow-hidden
          min-width--0
        "
      >
        <li
          class="
            text-color--neutral-gray-900
            overflow-hidden
            text-overflow--ellipsis
            no-wrap
          "
        >
          {{ pennylaneDocument.name }}
        </li>
        <li
          class="
            text-color--neutral-gray-500
            overflow-hidden
            text-overflow--ellipsis
            no-wrap
            font-small
            margin-top--1
          "
        >
          {{ pennylaneDocument.path }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PIcon } from '@pulse/styleguide/components'
import { PennylaneDocumentsWithResultProps } from './pennylane-documents-with-result.types'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

const props = defineProps<PennylaneDocumentsWithResultProps>()
const emit = defineEmits<{
  'open-document': [FormattedPennylaneDocument],
}>()

const internalPennylaneDocuments = computed(() => {
  return props.pennylaneDocuments
    .slice(0, 4)
    .toSorted((a, b) => a.updatedAt > b.updatedAt ? -1 : 1)
})

function onClickDocument(pennylaneDocument: FormattedPennylaneDocument) {
  emit('open-document', pennylaneDocument)
}
</script>
