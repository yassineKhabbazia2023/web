<template>
  <PDrawer
    v-model="isManageAccessDrawerGlobalVisible"
    pSize="50%"
    :pTitle="t('manageAccess')"
    destroyOnClose
    data-testid="manage-access-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <div
      class="
        position--relative
        height--100
        width--100
      "
    >
      <div
        v-if="isLoadingOperations === true"
        class="
            position--absolute
            z-index-1000
            opacity--50
            bg--neutral-gray-50
            width--100
            height--100
            flex
            flex--direction-column
            flex--justify-content-center
            flex--align-items-center
          "
      >
        <PLoader
          pType="primary"
          pSize="50"
        />
      </div>
      <div
        class="
          flex
          flex--direction-column
          height--100
        "
      >
        <NoOperation
          v-if="showNoOperation === true"
          class="width--100"
        />
        <PendingOperations
          v-if="showNoOperation === false"
          ref="pendingOperations"
          class="width--100"
          isGlobalMode
          :trackingLocalisation="trackingLocalisation"
          :accountOperationsList="searchResult?.items || []"
          :searchTerm="searchTerm"
          @update-operation-table="onUpdateOperationTable"
          @update:search-term="onUpdateSearch"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex flex--justify-content-flex-end">
        <div
          v-if="showPagination"
          class="flex flex--justify-content-center flex--grow-1"
        >
          <PPagination
            v-if="searchResult !== undefined"
            :pCurrentPage="searchResult.currentPage"
            :pPageSize="MANAGE_ACCESS_PAGE_SIZE"
            :pTotal="searchResult.totalItems"
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
import { computed, useTemplateRef, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PButton, PPagination, PLoader } from '@pulse/styleguide/components'
import type { ManageAccessDrawerGlobalProps } from './ManageAccessDrawerGlobal.types'
import PendingOperations from '../components/PendingOperations'
import NoOperation from '../components/NoOperation'
import { useManageAccessOperations } from './composables/manageAccessOperations.composable'

const MANAGE_ACCESS_PAGE_SIZE = 5

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ManageAccessDrawerGlobalProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const {
  isLoadingOperations,
  searchTerm,
  searchResult,
  showPagination,
  showNoOperation,
  refreshManageAccessOperations,
} = useManageAccessOperations(MANAGE_ACCESS_PAGE_SIZE)

const pendingOperationsRef = useTemplateRef('pendingOperations')

// #region drawer values and events
const isManageAccessDrawerGlobalVisible = computed({
  get() {
    return props.modelValue
  },
  set(isVisible: boolean) {
    emit('update:modelValue', isVisible)
  },
})

const handleCloseDrawer = () => {
  isManageAccessDrawerGlobalVisible.value = false
}
// #endregion


function onUpdateSearch(searchValue: string) {
  searchTerm.value = searchValue
  refreshList()
}

const refreshList = async ({ page }: { page?: number } = {}) => {
  await refreshManageAccessOperations({
    page,
  })
  pendingOperationsRef.value?.resetOpenedAccordions()
}

const onUpdateOperationTable = () => {
  refreshList()
}

const onUpdateCurrentPage = (page: number) => {
  refreshList({ page })
}

onMounted(() => {
  refreshList({ page: 1 })
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
