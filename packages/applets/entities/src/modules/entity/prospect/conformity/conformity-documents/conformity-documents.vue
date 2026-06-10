<template>
  <section
    :id="`step-${SUPPORTING_DOCS_STEP_ID}`"
    class="
      conformity-documents
      flex
      flex--direction-column
      padding--8
    "
  >
    <h2
      class="
        conformity-documents__title
        font-size--21
        font-semibold
        margin--0
        margin-bottom--3
      "
    >
      Documents justificatifs
    </h2>
    <p
      class="
        conformity-documents__description
        font-size--14
        margin--0
      "
    >
      Ceci est l'écran de l'étape « Documents justificatifs ».<br>
      Cliquez sur une étape dans le tracker à gauche pour naviguer ici.
    </p>
    <div
      class="
        conformity-documents__footer
        flex
        flex--justify-content-flex-end
        margin-top--auto
      "
    >
      <PButton
        pType="secondary"
        @click="openDrawer"
      >
        Consulter
      </PButton>
    </div>

    <PDrawer
      v-model="isDrawerOpen"
      pTitle="Documents"
      pSize="50%"
      @close-drawer-button="closeDrawer"
    >
      <PAlert
        pType="information"
        class="margin-bottom--4"
      >
        Retrouvez ici vos documents.
      </PAlert>
      <DocumentsList
        v-if="isDrawerOpen"
        :visibleColumns="drawerVisibleColumns"
      />
      <template #footer>
        <PDrawerActions
          :pPrimaryCTA="{ pLabel: 'Fermer' }"
          @click-primary-cta="closeDrawer"
        />
      </template>
    </PDrawer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PAlert, PButton, PDrawer, PDrawerActions } from '@pulse/styleguide/components'
import type { PDocumentsListColumn } from '@pulse/styleguide/types'
import DocumentsList from '../../documents/documents-list/documents-list.vue'
import { SUPPORTING_DOCS_STEP_ID } from '../prospect-conformity.consts'

const isDrawerOpen = ref(false)

const drawerVisibleColumns: PDocumentsListColumn[] = ['name', 'depositDate', 'options']

const openDrawer = (): void => {
  isDrawerOpen.value = true
}

const closeDrawer = (): void => {
  isDrawerOpen.value = false
}
</script>

<style scoped lang="scss">
.conformity-documents {
  border: 1px solid var(--p-stroke-secondary);
  border-radius: 8px;
  background-color: var(--p-surface-primary);
  min-height: 400px;

  &__description {
    color: var(--p-text-neutral);
    line-height: 1.6;
  }
}
</style>
