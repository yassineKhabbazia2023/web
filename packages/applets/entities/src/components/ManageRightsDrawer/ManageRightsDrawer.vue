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
        pColor="gray"
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
      v-model:pennylaneAvailableRoles="pennylaneAvailableRoles"
      :contactId="selectedUser.contactId"
      :accountNumber="currentEntity.accountNumber"
    />
    <template #footer>
      <PDrawerActions
        :pPrimaryCTA="primaryCTA"
        @click-primary-cta="handleUpdateUserPermissions"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PDrawer,
  PDrawerActions,
  PUserCard,
  PTag,
  PLoader,
} from '@pulse/styleguide/components'
import type { PDrawerActionButton } from '@pulse/styleguide/types'

import { displayNotification } from '@pulse/styleguide'
import type {
  ManageRightsDrawerProps,
  AuthorizationState,
  LabelByPermission,
} from './ManageRightsTypes'
import RightsList from './components/RightsList'
import { RouteParam } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { RouterHelpers } from '@pulse/common/helpers'
import { saveUserPermissions, getAdditionalOptionByActionCode, getIsFormValid, getPennylaneRoleLabelByCode } from './utils'
import { refreshPageWhenCurrentUserPermissionChange } from '@entities/composables/permission.composable'
import { TRACKING_LOCALISATION, PERMISSION_PENNYLANE_CUSTOMER } from '@entities/constants'
import type { PennylaneAvailableRole } from '@pulse/common/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      submit: 'Submit',
      modifyUserRights: 'Modify user rights',
      rightsModificationSucceeded: '{userFullName}\'s rights have indeed been modified',
      rightsModificationFailed: 'A technical error has occurred',
    },
    'fr-FR': {
      submit: 'Valider',
      modifyUserRights: 'Modifier les droits utilisateur',
      rightsModificationSucceeded: 'Les droits de {userFullName} ont bien été modifiés',
      rightsModificationFailed: 'Une erreur technique est survenue',
    },
  },
})

const props = defineProps<ManageRightsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const route = useRoute()
const isLoading = ref(false)
const authorizationsState = ref<Record<string, AuthorizationState>>({})
const pennylaneAvailableRoles = ref<PennylaneAvailableRole[]>([])

const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('submit'),
  pDisabled: isFormValid.value === false,
  pTestId: 'manage-rights-submit-button',
}))

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
  const roleLabel = getPennylaneRoleLabel()
  const isSuccess = await saveUserPermissions({
    contactId: props.selectedUser.contactId,
    entityId,
    authorizationsState: authorizationsState.value,
    additionalOptionByActionCode: additionalOptionByActionCode.value,
    additionalOptionByActionCodeOrigin: additionalOptionByActionCodeOrigin.value,
    localisation: TRACKING_LOCALISATION.MODIFY_RIGHTS,
    roleLabel,
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

function getPennylaneRoleLabel(): string | undefined {
  const roleCode = additionalOptionByActionCode.value?.[PERMISSION_PENNYLANE_CUSTOMER]
  return getPennylaneRoleLabelByCode(roleCode, pennylaneAvailableRoles.value)
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

