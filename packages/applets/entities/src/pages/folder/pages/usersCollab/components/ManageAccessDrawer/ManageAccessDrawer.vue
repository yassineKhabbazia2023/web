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
      v-if="defaultEntity?.legalName"
      pColor="persian"
      pAssetLeft="Image"
      pAssetContent="company"
      :pTitle="defaultEntity?.legalName"
      :pSubtitle="defaultEntity?.accountNumber"
      class="margin-bottom--6"
      data-testid="manage-access-user-card"
    />
    <PendingOperationsTable
      @update-operation-table="handleOperationTableUpdate"
    />
    <template #footer>
      <div class="margin-left--auto">
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
import { storeToRefs } from 'pinia'
import { commonStore } from '@pulse/common'
import { PDrawer, PButton, PUserCard } from '@pulse/styleguide/components'
import type { ManageAccessDrawerProps } from './ManageAccessDrawerTypes'
import PendingOperationsTable from './components/PendingOperationsTable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ManageAccessDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update-operation-table': [void]
}>()

const { defaultEntity } = storeToRefs(commonStore())

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
</script>

<i18n lang="yaml">
en-US:
  close: 'Close'
  manageAccess: 'Manage Access'
fr-FR:
  close: 'Fermer'
  manageAccess: 'Gérer les accès'
</i18n>
