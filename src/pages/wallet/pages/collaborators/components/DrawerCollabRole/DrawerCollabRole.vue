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
      v-if="!state.currentStep && !isManageRightsDisplayed"
      :currentRole="rowData.role"
      @set-drawer-not-visible="closeDrawer"
      @set-selected-role-id="handleSetSelectedRoleId"
      @display-manage-rights="isManageRightsDisplayed = true"
    />
    <RightsList
      v-if="isManageRightsDisplayed"
      :contactId="rowData.id"
      v-model="authorizationsState"
    />
    <CollabAccess
      v-if="state.currentStep && !isManageRightsDisplayed"
      @set-accesses="handleSetAccess"
      @go-to-previous-step="state.currentStep--"
      :selectedCollabRole="rowData.role"
    />
    <template #footer>
      <NextPreviousButtons
        v-if="isManageRightsDisplayed"
        data-testid="next-previous-buttons"
        :previousLabel="t('previousLabel')"
        :nextLabel="t('submit')"
        @click-previous="handlePreviousClick"
        @click-next="handleUpdatePermissions"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
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
import RightsList from '@/common/components/ManageRightsDrawer/components/RightsList'
import NextPreviousButtons from '@/common/components/NextPreviousButtons'
import { updateCollaborator } from '@/services/wallet'
import type { AuthorizationState } from '@/common/components/ManageRightsDrawer/ManageRightsTypes'
import { updateUserPermissions } from '@/services/authorization'
import { getPermissionCodes } from '@/common/components/ManageRightsDrawer/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits(['update:modelValue', 'update-collaborator-role'])

const props = defineProps<Props>()

const authorizationsState = ref<Record<string, AuthorizationState>>({})

const isManageRightsDisplayed = ref(false)
const isLoading = ref(false)

const isDrawerVisible = computed({
  get: () => props.hasDrawerOpened,
  set: (value) => emit('update:modelValue', value),
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

const handleUpdatePermissions = async () => {
  isLoading.value = true
  try {
    const permissionsCodes = getPermissionCodes(authorizationsState.value)
    await updateUserPermissions(props.rowData.id, null, permissionsCodes)
    closeDrawer()
    PNotification({
      message: t('modifyRightsSucceeded', {
        userFullName: props.rowData.fullName,
      }),
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 3000,
    })
  } catch (error) {
    console.error('Permission update unsuccessful :', error)
  } finally {
    isLoading.value = false
  }
}

const handlePreviousClick = () => {
  state.currentStep = 0
  isManageRightsDisplayed.value = false
}

const handleSetAccess = async (accesses: object) => {
  try {
    state.accessesSelected = accesses
    const updates = {
      personaId: state.selectedRoleId,
    }
    const contact = await updateCollaborator(props.rowData.id, updates)
    emit('update-collaborator-role', contact)
    closeDrawer()
    PNotification({
      message: t('notificationSuccess', { fullName: props.rowData.fullName }),
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  } catch (error) {
    PNotification({
      message: t('notificationSuccess', { fullName: props.rowData.fullName }),
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  }
}
</script>

<i18n lang="yaml">
en-US:
  submit: 'Submit'
  previousLabel: 'Previous'
  modifyRightsSucceeded: "{userFullName}'s rights have indeed been modified"
  manageAccessRights: 'Manage access rights'
  notificationSuccess: 'The role of {fullName} has been successfully updated.'
fr-FR:
  submit: 'Valider'
  previousLabel: 'Précédent'
  modifyRightsSucceeded: 'Les droits de {userFullName} ont bien été modifiés'
  manageAccessRights: 'Gérer les droits d’accès'
  notificationSuccess: 'Le rôle de {fullName} a bien été mis à jour.'
</i18n>
