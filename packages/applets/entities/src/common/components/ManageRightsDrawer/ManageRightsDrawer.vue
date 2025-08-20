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
      v-if="isLoading === true"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="manage-rights-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <RightsList
      v-if="isLoading === false"
      v-model="authorizationsState"
      v-model:additionalOptionByActionCode="additionalOptionByActionCode"
      :contactId="selectedUser.contactId"
      :accountNumber="selectedEntity.accountNumber"
    />
    <template #footer>
      <div class="margin-left--auto">
        <PButton
          :pDisabled="isFormValid === false"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PDrawer,
  PUserCard,
  PTag,
  PButton,
  PLoader,
} from '@pulse/styleguide/components'

import { displayNotification } from '@pulse/styleguide'
import type {
  ManageRightsDrawerProps,
  AuthorizationState,
  LabelByPermission,
} from './ManageRightsTypes'
import RightsList from './components/RightsList'
import { RouteParam } from '@pulse/common/enums'
import { logger } from '@pulse/core'
import { RouterHelpers } from '@pulse/common/helpers'
import { saveUserPermissions, getAdditionalOptionByActionCode, getIsFormValid } from './utils'
import { refreshPageWhenCurrentUserPermissionChange } from '@entities/composables/permission.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ManageRightsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const route = useRoute()
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
const getEntityId = () => RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const handleUpdateUserPermissions = async () => {
  isLoading.value = true
  // If it's a collab, the entityId will be null and that's fine
  const entityId = getEntityId()
  const isSuccess = await saveUserPermissions({
    contactId: props.selectedUser.contactId,
    entityId,
    authorizationsState: authorizationsState.value,
    additionalOptionByActionCode: additionalOptionByActionCode.value,
    additionalOptionByActionCodeOrigin: additionalOptionByActionCodeOrigin.value,
  })
  const notificationMessage = isSuccess === true
    ? t('rightsModificationSucceeded', { userFullName: props.selectedUser.fullName })
    : t('rightsModificationFailed')

  if (isSuccess === true) {
    // I added a setTimeout to enhance the user experience (UX)
    setTimeout(async () => {
      isManageRightsDrawerVisible.value = false
      refreshPageWhenCurrentUserPermissionChange(props.selectedUser.contactId)
    }, 600)
  }
  displayNotification(
    isSuccess ? 'success' : 'error',
    notificationMessage,
  )

  isLoading.value = false
}

const additionalOptionByActionCode = ref<LabelByPermission >()
const additionalOptionByActionCodeOrigin = ref<LabelByPermission >()

const isFormValid = computed(() => getIsFormValid(
  authorizationsState.value,
  additionalOptionByActionCode.value,
))

watch(
  () => props.modelValue && props.selectedUser.contactId,
  () => initAdditionalOptionByActionCodeOrigin(),
)

onMounted(async () => {
  initAdditionalOptionByActionCodeOrigin()
})

async function initAdditionalOptionByActionCodeOrigin() {
  if (props.modelValue === false) {
    return
  }
  const entityId = getEntityId()
  const contactId = props.selectedUser.contactId
  additionalOptionByActionCodeOrigin.value = {}
  if (entityId !== null) {
    try {
      additionalOptionByActionCodeOrigin.value = await getAdditionalOptionByActionCode({
        entityId,
        contactId,
      })
    } catch (e) {
      logger.error(e)
    }
  }
  additionalOptionByActionCode.value = {
    ...additionalOptionByActionCodeOrigin.value,
  }
}
</script>

<i18n lang="yaml">
en-US:
  submit: 'Submit'
  modifyUserRights: 'Modify user rights'
  rightsModificationSucceeded: "{userFullName}'s rights have indeed been modified"
  rightsModificationFailed: 'A technical error has occurred'
fr-FR:
  submit: 'Valider'
  modifyUserRights: 'Modifier les droits utilisateur'
  rightsModificationSucceeded: 'Les droits de {userFullName} ont bien été modifiés'
  rightsModificationFailed: 'Une erreur technique est survenue'
</i18n>
