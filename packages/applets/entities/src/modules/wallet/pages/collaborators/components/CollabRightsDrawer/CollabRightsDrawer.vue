<template>
  <PDrawer
    v-model="isDrawerVisible"
    :pTitle="t('manageAccessRights')"
    destroyOnClose
    pSize="50%"
    @close-drawer-button="isDrawerVisible = false"
  >
    <PUserCard
      class="margin-bottom--6"
      pImageName="user-duotone"
      pColor="gray"
      :pTitle="rowData.fullName"
      :pSubtitle="rowData.email"
    >
      <PTag
        pColor="gray"
        pSize="default"
        pIconLeftName="person"
        :pContent="rowData.role"
      />
    </PUserCard>
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="collab-roles-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <template v-else>
      <CollabRoles
        v-if="currentStep === CollabRightsDrawerSteps.ROLES && selectedRoleId"
        v-model:selectedRoleId="selectedRoleId"
        :roles="roles"
        :currentRole="rowData.role"
        :preSelectedRoleId="preSelectedRoleId"
        @display-manage-rights="++currentStep"
      />
      <RightsList
        v-if="currentStep === CollabRightsDrawerSteps.MANAGE_RIGHTS"
        v-model="authorizationsState"
        :contactId="rowData.id"
      />
    </template>
    <template #footer>
      <NextPreviousButtons
        :previousLabel="previousLabel"
        :nextLabel="t('submitLabel')"
        :isNextButtonDisabled="isSelectedRoleNotChanged"
        data-testid="next-previous-buttons"
        @click-previous="handlePreviousClick"
        @click-next="handleNextClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import {
  PDrawer,
  PTag,
  PUserCard,
  PLoader,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import CollabRoles from './components/CollabRoles'
import RightsList from '@entities/components/ManageRightsDrawer/components/RightsList'
import NextPreviousButtons from '@entities/components/NextPreviousButtons'
import { updateCollaborator, fetchContactRoles } from '@entities/services/wallet'
import type { AuthorizationState } from '@entities/components/ManageRightsDrawer/ManageRightsTypes'
import { updateUserPermissions } from '@entities/services/authorization'
import { getPermissionCodes } from '@entities/components/ManageRightsDrawer/utils'
import { ContactType } from '@pulse/common/enums'
import { CollabRightsDrawerSteps } from '@entities/modules/wallet/enums'
import type { CollabRightsDrawerProps } from './CollabRightsDrawerTypes'
import type { Role } from '@entities/types'
import type { Contact } from '@entities/services/contact/contactTypes'
import { refreshPageWhenCurrentUserPermissionChange } from '@entities/composables/permission.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update-collaborator-role': [Contact]
}>()
const props = defineProps<CollabRightsDrawerProps>()

const isLoading = ref(true)
const roles = ref<Role[]>([])
const currentStep = ref<number>(0)
const preSelectedRoleId = ref<number>()
const selectedRoleId = ref<number>()
const authorizationsState = ref<Record<string, AuthorizationState>>({})

const previousLabel = computed(() =>
  currentStep.value === CollabRightsDrawerSteps.MANAGE_RIGHTS
    ? t('previousLabel')
    : t('cancelLabel'),
)
const isDrawerVisible = computed({
  get: () => props.hasDrawerOpened,
  set: (value) => emit('update:modelValue', value),
})
const isSelectedRoleNotChanged = computed(
  () =>
    selectedRoleId.value === preSelectedRoleId.value &&
    currentStep.value !== CollabRightsDrawerSteps.MANAGE_RIGHTS,
)

const handleNextClick = () => {
  if (currentStep.value === CollabRightsDrawerSteps.MANAGE_RIGHTS) {
    handleUpdatePermissions()
  } else {
    handleUpdateRole()
  }
}

const handleUpdatePermissions = async () => {
  isLoading.value = true
  try {
    const permissionsCodes = getPermissionCodes(authorizationsState.value)
    await updateUserPermissions(props.rowData.id, null, permissionsCodes)
    // I added a setTimeout to enhance the user experience (UX)
    setTimeout(async () => {
      isDrawerVisible.value = false
      refreshPageWhenCurrentUserPermissionChange(props.rowData.id)
    }, 600)
    PNotification({
      message: t('modifyRightsSucceeded', {
        fullName: props.rowData.fullName,
      }),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 3000,
    })
  } catch (error) {
    PNotification({
      message: t('modifyRightsFailed', { fullName: props.rowData.fullName }),
      iconName: 'xCircle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 3000,
    })
    logger.error('Permission update unsuccessful: ', error)
  } finally {
    isLoading.value = false
  }
}

const handlePreviousClick = () => {
  if (currentStep.value === CollabRightsDrawerSteps.ROLES) {
    isDrawerVisible.value = false
  }
  currentStep.value = 0
}

const handleUpdateRole = async () => {
  isLoading.value = true
  try {
    const contact = await updateCollaborator(props.rowData.id, {
      personaId: selectedRoleId.value,
    })
    emit('update-collaborator-role', contact)
    isDrawerVisible.value = false
    PNotification({
      message: t('successNotification', { fullName: props.rowData.fullName }),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 3000,
    })
  } catch (error) {
    PNotification({
      message: t('errorNotification', { fullName: props.rowData.fullName }),
      iconName: 'xCircle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 3000,
    })
    logger.error('Role update unsuccessful: ', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    roles.value = await fetchContactRoles(ContactType.COLLABORATOR)
    selectedRoleId.value = roles.value.find(
      (role: Role) => role.name === props.rowData.role,
    )?.id
    preSelectedRoleId.value = selectedRoleId.value
  } catch (error) {
    logger.error('Unable to fetch collaborator roles: ', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<i18n lang="yaml">
en-US:
  submitLabel: 'Submit'
  cancelLabel: 'Cancel'
  previousLabel: 'Previous'
  modifyRightsSucceeded: "{userFullName}'s rights have indeed been modified"
  modifyRightsFailed: "The update of {fullName}'s access rights failed."
  manageAccessRights: 'Manage access rights'
  successNotification: 'The role of {fullName} has been successfully updated.'
  errorNotification: 'The role of {fullName} was not updated due to a technical error.'
fr-FR:
  submitLabel: 'Valider'
  cancelLabel: 'Annuler'
  previousLabel: 'Précédent'
  modifyRightsSucceeded: 'Les droits de {fullName} ont bien été modifiés'
  modifyRightsFailed: "La mise à jour des droits d'accès de {fullName} a échoué"
  manageAccessRights: "Gérer les droits d'accès"
  successNotification: 'Le rôle de {fullName} a bien été mis à jour.'
  errorNotification: "Le rôle de {fullName} n'a pas été mis à jour suite à une erreur technique."
</i18n>
