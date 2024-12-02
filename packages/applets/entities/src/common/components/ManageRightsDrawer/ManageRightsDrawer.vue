<template>
  <PDrawer
    v-model="isManageRightsDrawerVisible"
    :pTitle="t('modifyUserRights')"
    destroyOnClose
    @close-drawer-button="handleCloseDrawer"
  >
    <PUserCard
      :pTitle="selectedUser.fullName"
      :pSubtitle="selectedUser.email"
      pColor="gray"
      pImageName="user-duotone"
      class="margin-bottom--6"
      data-testid="manage-rights-user-card"
    >
      <PTag
        v-if="selectedUser.role"
        pSize="default"
        pEffect="light"
        pColor="gray-900"
        pIconLeftName="person"
        :pContent="selectedUser.role"
      />
    </PUserCard>
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="manage-rights-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <RightsList
      v-else
      v-model="authorizationsState"
      :contactId="selectedUser.contactId"
    />
    <template #footer>
      <div class="margin-left--auto">
        <PButton
          pType="primary"
          data-testid="manage-rights-submit-button"
          @click="handleUpdateUserPermissions"
        >
          {{ t('submit') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  PDrawer,
  PUserCard,
  PTag,
  PButton,
  PLoader,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import type {
  ManageRightsDrawerProps,
  AuthorizationState,
} from './ManageRightsTypes'
import { updateUserPermissions } from '@entities/services/authorization'
import { getPermissionCodes } from './utils'
import RightsList from './components/RightsList'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ManageRightsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const authorizationsState = ref<Record<string, AuthorizationState>>({})

const isManageRightsDrawerVisible = computed({
  get() {
    return props.modelValue
  },
  set(isOpened: boolean) {
    emit('update:modelValue', isOpened)
  },
})

const handleCloseDrawer = () => {
  isManageRightsDrawerVisible.value = false
}

const handleUpdateUserPermissions = async () => {
  isLoading.value = true
  try {
    /**
     * To obtain an array of strings containing all permission codes.
     * Because that's what the backend is waiting for to update permissions.
     * exp: ['CODE1', 'CODE2', 'CODE3']
     */
    const permissionsCodes = getPermissionCodes(authorizationsState.value)
    // If it's a collab, there's no need to specify the account ID (Global View)
    await updateUserPermissions(
      props.selectedUser.contactId,
      route.params.id ? +route.params.id : null,
      permissionsCodes,
    )
    // I added a setTimeout to enhance the user experience (UX)
    setTimeout(() => {
      isManageRightsDrawerVisible.value = false
      // The page will be reloaded 30ms after the drawer is closed
      setTimeout(() => {
        router.go(0)
      }, 30)
    }, 600)
    PNotification({
      message: t('rightsModificationSucceeded', {
        userFullName: props.selectedUser.fullName,
      }),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 3000,
    })
  } catch (error) {
    logger.error('Permission update unsuccessful :', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<i18n lang="yaml">
en-US:
  submit: 'Submit'
  modifyUserRights: 'Modify user rights'
  rightsModificationSucceeded: "{userFullName}'s rights have indeed been modified"
fr-FR:
  submit: 'Valider'
  modifyUserRights: 'Modifier les droits utilisateur'
  rightsModificationSucceeded: 'Les droits de {userFullName} ont bien été modifiés'
</i18n>
