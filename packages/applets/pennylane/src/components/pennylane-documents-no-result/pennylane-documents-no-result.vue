<template>
  <div
    data-testid="pennylane-documents-no-result"
    class="
        pennylane-documents-no-result
        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
        flex--grow-1
        flex-gap--3
        text-color--neutral-gray-900
      "
  >
    <PIcon
      :pName="iconName"
      pSize="40"
    />
    <span class="text-center">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PIcon } from '@pulse/styleguide/components'
import type { PennylaneDocumentsNoResultProps } from './pennylane-documents-no-result.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PennylaneDocumentsNoResultProps>()

const iconName = computed(() => props.isError === true ? 'exclamationTriangle' : 'fileText')
const message = computed(() => props.isError === true ? t('errorMessage') : t('noDocuments'))
</script>

<i18n lang="yaml">
  en-US:
    noDocuments: 'No documents received yet'
    errorMessage: 'An error occurred while retrieving documents'
  fr-FR:
    noDocuments: 'Aucun document reçu pour le moment'
    errorMessage: 'Une erreur est survenue lors de la récupération des documents'
</i18n>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.pennylane-documents-no-result {
  @include breakpoints.media(xs) {
    .p-icon {
      margin: 1.6rem;
    }
  }
}
</style>
