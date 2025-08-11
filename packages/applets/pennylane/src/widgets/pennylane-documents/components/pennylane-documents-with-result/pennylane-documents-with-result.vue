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
    "
  >
    <li
      v-for="({ pennylaneDocument, iconName }, index) in internalPennylaneDocuments"
      :key="index"
      class="
        flex
        flex--align-items-center
        padding-x--3
        padding-y--2
        cursor-pointer
        hover-bg--base-persian-light
      "
      @click="onClickDocument(pennylaneDocument)"
    >
      <div
        class="
          text-color--neutral-gray-900
          padding-x--3
        "
      >
        <PIcon
          :pName="iconName"
          pSize="16"
        />
      </div>
      <ul
        class="
          list-style-none
          overflow-hidden
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
import { getInternalPennylaneDocuments } from './pennylane-documents-with-result.utils'
import type { PennylaneDocument } from '@pulse/common/types'

const props = defineProps<PennylaneDocumentsWithResultProps>()
const emit = defineEmits<{
  'open-document': [PennylaneDocument],
}>()

const internalPennylaneDocuments = computed(() => getInternalPennylaneDocuments(props.pennylaneDocuments))

function onClickDocument(pennylaneDocument: PennylaneDocument) {
  emit('open-document', pennylaneDocument)
}
</script>
