<template>
  <PDrawer
    v-model="isDrawerVisible"
    :pTitle="t('manageAccessRights')"
    @close-drawer-button="isDrawerVisible = false"
  >
    <PUserCard
      class="margin-bottom--6"
      pAssetLeft="Image"
      pAssetContent="user-male"
      :pTitle="rowData.fullName"
      :pSubtitle="rowData.email"
    >
      <PTag
        pColor="gray-500"
        pSize="default"
        pIconLeft="PIPerson"
        :pContent="rowData.role"
        pEffect="light"
      />
    </PUserCard>

    <CollabRole
      v-if="!state.currentStep"
      @set-drawer-not-visible="closeDrawer"
      @set-selected-role-id="handleSetSelectedRoleId"
    />
    <CollabAccess
      v-if="state.currentStep"
      @set-accesses="handleSetAccess"
      @go-to-previous-step="state.currentStep--"
      :selectedCollabRole=rowData.role
    />
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive } from 'vue'
import {
  PDrawer,
  PICheck,
  PNotification,
  PTag,
  PUserCard,
} from '@kpmg/styleguide'
import type { State, Props } from './types'
import CollabRole from './components/CollabRole'
import CollabAccess from './components/CollabAccess'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps<Props>()

const isDrawerVisible = computed({
  get: () => props.hasDrawerOpened,
  set: value => emit('update:modelValue', value),
})

const closeDrawer = () => {
  isDrawerVisible.value = false
}

const state: State = reactive({
  selectedRoleId: undefined,
  accessesSelected: undefined,
  currentStep: 0,
})

const handleSetSelectedRoleId = (selectedRoleId: number) => {
  state.selectedRoleId = selectedRoleId
  state.currentStep++
}

const handleSetAccess = (accesses: Object) => {
  state.accessesSelected = accesses

  closeDrawer()

  PNotification({
    message: t('notificationSuccess', { fullName: props.rowData.fullName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}
</script>

<i18n lang="yaml">
en-US:
  manageAccessRights: 'Manage access rights'
  notificationSuccess: 'The role of {fullName} has been successfully updated.'
fr-FR:
  manageAccessRights: "Gérer les droits d’accès"
  notificationSuccess: 'Le rôle de {fullName} a bien été mis à jour.'
</i18n>
