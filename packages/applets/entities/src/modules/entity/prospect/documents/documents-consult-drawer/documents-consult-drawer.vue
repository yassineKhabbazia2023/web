<template>
  <PDrawer
    v-model="isOpen"
    :pTitle="t('entities.prospect.documentsConsultDrawer.title')"
    pSize="50%"
    @close-drawer-button="onClose"
  >
    <PAlert
      pType="information"
      class="margin-bottom--4"
    >
      {{ t('entities.prospect.documentsConsultDrawer.alert') }}
    </PAlert>
    <DocumentsList
      v-if="isOpen"
      :visibleColumns="visibleColumns"
    />
    <template #footer>
      <PDrawerActions
        :pPrimaryCTA="{ pLabel: t('entities.prospect.documentsConsultDrawer.close') }"
        @click-primary-cta="onClose"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert, PDrawer, PDrawerActions } from '@pulse/styleguide/components'
import DocumentsList from '../documents-list/documents-list.vue'
import type { DocumentsConsultDrawerProps } from './documents-consult-drawer.types'

const { t } = useI18n()

withDefaults(
  defineProps<DocumentsConsultDrawerProps>(),
  { visibleColumns: () => ['name', 'depositDate', 'options'] },
)

const isOpen = defineModel<boolean>({ required: true })

const onClose = (): void => {
  isOpen.value = false
}
</script>
