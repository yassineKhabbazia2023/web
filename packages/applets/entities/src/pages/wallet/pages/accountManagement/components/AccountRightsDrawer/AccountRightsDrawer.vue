<template>
  <PDrawer
    v-model="isAccountRightsDrawerVisible"
    :pTitle="t('modifyAccountRights')"
    pSize="50%"
    destroyOnClose
    @close-drawer-button="handleCloseDrawer"
  >
    <PUserCard
      :pTitle="selectedAccount.name"
      :pSubtitle="selectedAccount.accountNumber"
      pColor="gray"
      pImageName="company"
      class="margin-bottom--6"
      data-testid="account-rights-company-card"
    >
      <PTag
        pSize="default"
        pEffect="light"
        pColor="gray-900"
        pIconLeftName="building"
        :pContent="t('clientCompany')"
      />
    </PUserCard>
    <PTabs v-model="activeTab" :pStretch="false">
      <PTabPane
        v-for="tab in permissionTypesTabs"
        :key="tab.name"
        :pLabel="tab.label"
        :pName="tab.name"
        class="margin-bottom--6"
      />
      <div
        v-if="isLoading"
        class="flex flex--justify-content-center margin-y--4"
        data-testid="account-rights-loader"
      >
        <PLoader pType="primary" pSize="50" />
      </div>
      <template v-else>
        <RightsList
          v-if="activeTab === 'clientPermissions'"
          v-model="authorizationsState"
          :accountId="selectedAccount.accountId"
          :contactType="ContactType.Customer"
          isAccountRights
        />
        <RightsList
          v-if="activeTab === 'collabPermissions'"
          v-model="authorizationsState"
          :accountId="selectedAccount.accountId"
          :contactType="ContactType.Collaborator"
          isAccountRights
        />
      </template>
    </PTabs>
    <template #footer>
      <div class="margin-left--auto">
        <PButton
          pType="primary"
          data-testid="account-rights-submit-button"
          @click="handleUpdateAccountPermissions"
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
import {
  PDrawer,
  PUserCard,
  PTag,
  PButton,
  PTabPane,
  PTabs,
  PLoader,
} from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import type {
  AuthorizationState,
} from '@entities/common/components/ManageRightsDrawer/ManageRightsTypes'
import type { AccountRightsDrawerProps, PermissionTypeTab } from './AccountRightsDrawerTypes'
import { ContactType } from '@entities/services/contact/contactTypes'
import { updateAccountPermissions } from '@entities/services/authorization'
import { getPermissionCodes } from '@entities/common/components/ManageRightsDrawer/utils'
import RightsList from '@entities/common/components/ManageRightsDrawer/components/RightsList'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<AccountRightsDrawerProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const isLoading = ref(false)
const activeTab = ref<string>('clientPermissions')
const authorizationsState = ref<Record<string, AuthorizationState>>({})
const permissionTypesTabs: PermissionTypeTab[] = [
  {
    index: 0,
    name: 'clientPermissions',
    label: t('clientPermissions'),
  },
  {
    index: 1,
    name: 'collabPermissions',
    label: t('collabPermissions'),
  },
]

const contactAccountType = computed(() =>
  activeTab.value === 'collabPermissions' ? ContactType.Collaborator : ContactType.Customer,
)
const isAccountRightsDrawerVisible = computed({
  get() {
    return props.modelValue
  },
  set(isOpened: boolean) {
    emit('update:modelValue', isOpened)
  },
})

const handleCloseDrawer = () => {
  isAccountRightsDrawerVisible.value = false
}
const handleUpdateAccountPermissions = async () => {
  isLoading.value = true
  try {
    /**
     * To obtain an array of strings containing all permission codes.
     * Because that's what the backend is waiting for to update permissions.
     * exp: ['CODE1', 'CODE2', 'CODE3']
     */
    const permissionsCodes = getPermissionCodes(authorizationsState.value)
    await updateAccountPermissions(
      props.selectedAccount.accountId,
      contactAccountType.value,
      permissionsCodes,
    )
    PNotification({
      message: t('rightsModificationSucceeded', {
        accountName: props.selectedAccount.name,
        contactType: contactAccountType.value === ContactType.Collaborator ? t('collaborators') : t('clients'),
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
  clients: 'clients'
  collaborators: 'collaborators'
  clientCompany: 'Client Company'
  clientPermissions: 'Client permissions'
  modifyAccountRights: 'Modify account rights'
  collabPermissions: 'Collaborator permissions'
  rightsModificationSucceeded: "The rights associated with dossier {accountName} for {contactType} have been modified."
fr-FR:
  submit: 'Valider'
  clients: 'clients'
  collaborators: 'collaborateurs'
  clientCompany: 'Société cliente'
  clientPermissions: 'Permissions client'
  collabPermissions: 'Permissions collaborateur'
  modifyAccountRights: 'Modifier les droits du dossier'
  rightsModificationSucceeded: 'Les droits relatifs au dossier {accountName} pour les {contactType} ont été modifiés.'
</i18n>
