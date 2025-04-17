<template>
  <PDrawer
    v-model="isManageAccessDrawerVisible"
    pSize="50%"
    :pTitle="t('manageAccess')"
    destroyOnClose
    data-testid="manage-access-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <PUserCard
      v-if="!showAccountName && selectedEntity?.legalName"
      pColor="persian"
      pImageName="folder-open-duotone"
      :pTitle="selectedEntity?.legalName"
      :pSubtitle="selectedEntity?.accountNumber"
      class="margin-bottom--6"
      data-testid="manage-access-user-card"
    />
    <PendingOperations
      ref="pendingOperations"
      :showAccountName="showAccountName"
      :trackingLocalisation="trackingLocalisation"
      :accountOperationsList="accountOperationsList"
      @update-operation-table="handleOperationTableUpdate"
    />
    <template #footer>
      <div class="flex flex--justify-content-flex-end">
        <div
          v-if="showPagination"
          class="flex flex--justify-content-center flex--grow-1"
        >
          <PPagination
            :pCurrentPage="currentPage"
            :pPageSize="pageSize"
            :pTotal="pageCount"
            pHidePageSize
            @update:p-current-page="onUpdateCurrentPage"
          />
        </div>
        <PButton
          pType="default"
          pPlain
          data-testid="manage-access-close-button"
          @click="handleCloseDrawer"
        >
          {{ t('close') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { PDrawer, PButton, PUserCard, PPagination } from '@pulse/styleguide/components'
import type { ManageAccessDrawerProps } from './ManageAccessDrawerTypes'
import PendingOperations from './components/PendingOperations'
import { useSelectedEntityStore } from '@pulse/common/stores'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = withDefaults(defineProps<ManageAccessDrawerProps>(), {
  showAccountName: false,
  pageCount: 1,
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update-operation-table': [void]
  'update:current-page': [number]
}>()

const pendingOperationsRef = useTemplateRef('pendingOperations')

const selectedEntityStore = useSelectedEntityStore()
const { selectedEntity } = storeToRefs(selectedEntityStore)

// #region drawer values and events
const isManageAccessDrawerVisible = computed({
  get() {
    return props.modelValue
  },
  set(isVisible: boolean) {
    emit('update:modelValue', isVisible)
  },
})

const handleCloseDrawer = () => {
  isManageAccessDrawerVisible.value = false
}
// #endregion

const handleOperationTableUpdate = () => {
  emit('update-operation-table')
}

const onUpdateCurrentPage = (currentPage: number) => {
  emit('update:current-page', currentPage)
}

function resetOpenedAccordions() {
  pendingOperationsRef.value?.resetOpenedAccordions()
}

defineExpose({
  resetOpenedAccordions,
})
</script>

<i18n lang="yaml">
en-US:
  close: 'Close'
  manageAccess: 'Manage Access'
fr-FR:
  close: 'Fermer'
  manageAccess: 'Gérer les accès'
</i18n>
