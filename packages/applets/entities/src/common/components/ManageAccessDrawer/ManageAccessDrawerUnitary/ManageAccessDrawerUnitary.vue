<template>
  <PDrawer
    v-model="isManageAccessDrawerUnitaryVisible"
    pSize="50%"
    :pTitle="t('manageAccess')"
    destroyOnClose
    data-testid="manage-access-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <div
      class="
        flex
        flex--direction-column
        height--100
      "
    >
      <PUserCard
        pColor="persian"
        pImageName="folder-open-duotone"
        :pTitle="currentEntity?.legalName"
        :pSubtitle="currentEntity?.accountNumber"
        class="margin-bottom--6 width--100"
        data-testid="manage-access-user-card"
      />
      <NoOperation
        v-if="accountOperationsList.length === 0"
        class="width--100"
      />
      <PendingOperations
        v-if="accountOperationsList.length > 0"
        class="width--100"
        :trackingLocalisation="trackingLocalisation"
        :accountOperationsList="accountOperationsList"
        @update-operation-table="handleOperationTableUpdate"
      />
    </div>

    <template #footer>
      <div class="flex flex--justify-content-flex-end">
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PButton, PUserCard } from '@pulse/styleguide/components'
import type { ManageAccessDrawerUnitaryProps } from './ManageAccessDrawerUnitary.types'
import PendingOperations from '../components/PendingOperations'
import NoOperation from '../components/NoOperation'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ManageAccessDrawerUnitaryProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update-operation-table': [void]
}>()

// #region drawer values and events
const isManageAccessDrawerUnitaryVisible = computed({
  get() {
    return props.modelValue
  },
  set(isVisible: boolean) {
    emit('update:modelValue', isVisible)
  },
})

const handleCloseDrawer = () => {
  isManageAccessDrawerUnitaryVisible.value = false
}
// #endregion

const handleOperationTableUpdate = () => {
  emit('update-operation-table')
}
</script>

<i18n lang="yaml">
en-US:
  close: 'Close'
  manageAccess: 'Manage Access'
fr-FR:
  close: 'Fermer'
  manageAccess: 'Gérer les accès'
</i18n>
