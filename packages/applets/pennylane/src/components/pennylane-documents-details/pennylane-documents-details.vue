<template>
  <div>
    <div
      class="
      text-center
      padding-y--3
      text-color--secondary-amethyste
      border-bottom
      border-bottom--jungle-400
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
            word-break--break-all
          "
          >
            {{ value }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
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
  messages: {
    'en-US': {
      details: 'Details',
      pathPrefix: 'Pennylane',
      fields: {
        name: 'Document name',
        path: 'Document localisation',
        createdAt: 'Filing date',
        updatedAt: 'Last update',
      },
    },
    'fr-FR': {
      details: 'Détails',
      pathPrefix: 'Pennylane',
      fields: {
        name: 'Nom du document',
        path: 'Emplacement du document',
        createdAt: 'Date de dépôt',
        updatedAt: 'Dernière modification',
      },
    },
  },
})

const props = defineProps<PennylaneDocumentsDetailsProps>()

const labels: PennylaneDocumentsDetailsLabels = {
  name: t('fields.name'),
  path: t('fields.path'),
  createdAt: t('fields.createdAt'),
  updatedAt: t('fields.updatedAt'),
}
const displayData = computed(() => getDisplayData(labels, props.pennylaneDocument))
</script>

