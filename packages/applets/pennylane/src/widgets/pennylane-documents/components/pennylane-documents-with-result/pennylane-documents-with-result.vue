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
      v-for="({ name, path, iconName }, index) in internalPennylaneDocuments"
      :key="index"
      class="
        flex
        flex--align-items-center
        margin-x--3
        margin-y--2
      "
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
        class="list-style-none"
      >
        <li
          class="
            text-color--neutral-gray-900
            overflow-hidden
            text-overflow--ellipsis
            no-wrap
          "
        >
          {{ name }}
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
          {{ path }}
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

const props = defineProps<PennylaneDocumentsWithResultProps>()

const internalPennylaneDocuments = computed(() => getInternalPennylaneDocuments(props.pennylaneDocuments))
</script>
