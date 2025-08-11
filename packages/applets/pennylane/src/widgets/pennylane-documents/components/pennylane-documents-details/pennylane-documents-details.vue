<template>
  <div
    class="
      text-center
      padding-y--3
      text-color--secondary-amethyste
      border-bottom
      border-bottom--secondary-amethyste
      border-bottom--2px
    "
  >
    {{ t('details') }}
  </div>
  <ul
    class="
      margin-top--6
      list-style-none
    "
  >
    <li
      v-for="({ label, value }, index) in displayData"
      :key="index"
      class="margin-bottom--4"
    >
      <ul
        class="list-style-none"
      >
        <li
          class="
            text-color--neutral-gray-500
            font-small
            margin-bottom--1
          "
        >
          {{ label }}
        </li>
        <li
          class="
            text-color--neutral-gray-900
          "
        >
          {{ value }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PennylaneDocumentsDetailsProps } from './pennylane-documents-details.type'
import { getDisplayData } from './pennylane-documents-details.helper'
import type { PennylaneDocumentsDetailsLabels } from './pennylane-documents-details.type'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PennylaneDocumentsDetailsProps>()

const labels: PennylaneDocumentsDetailsLabels = {
  path: t('fields.path'),
  createdAt: t('fields.createdAt'),
  updatedAt: t('fields.updatedAt'),
}
const displayData = computed(() => getDisplayData(labels, props.pennylaneDocument))
</script>

<i18n lang="yaml">
  en-US:
    details: 'Details'
    pathPrefix: 'Pennylane'
    fields:
      path: 'Document localisation'
      createdAt: 'Filing date'
      updatedAt: 'Last update'
  fr-FR:
    details: 'Détails'
    pathPrefix: 'Pennylane'
    fields:
      path: 'Emplacement du document'
      createdAt: 'Date de dépôt'
      updatedAt: 'Dernière modification'
</i18n>
