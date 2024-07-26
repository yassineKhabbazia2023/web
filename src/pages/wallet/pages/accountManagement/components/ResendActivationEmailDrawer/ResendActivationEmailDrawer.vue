<template>
  <PDrawer
    v-model="isResendActivationEmailDrawerVisible"
    :pTitle="t('resendTheActivationEmail')"
    pSize="50%"
    destroyOnClose
    @close-drawer-button="handleCloseDrawer"
  >
    <PUserCard
      :pTitle="selectedAccount.name"
      :pSubtitle="selectedAccount.accountNumber"
      pColor="gray"
      pAssetLeft="Image"
      pAssetContent="company"
      class="margin-bottom--6"
      data-testid="account-rights-company-card"
    >
      <PTag
        pSize="default"
        pEffect="light"
        pColor="gray-900"
        pIconLeft="PIBuilding"
        :pContent="t('clientCompany')"
      />
    </PUserCard>
    <div class="margin-y--4">
      <p class="font-large">
        {{ t('selectClientUsers') }}
      </p>
      <p class="text-color--neutral-gray-500 margin-top--2">
        {{ t('pleaseSelectUsers') }}
      </p>
    </div>
    <div class="margin-y--4">
      <div
        v-if="isLoading"
        class="flex flex--justify-content-center flex--align-items-center"
      >
        <PLoader pType="primary" pSize="50" />
      </div>
      <div v-else>
        <TableData
          v-if="usersClientAccount.length > 0"
          :data="usersClientAccount"
          isAccountManagement
          @select-user="handleSelectUser"
        />
        <NoResult v-if="usersClientAccount.length === 0" />
      </div>
    </div>
    <template #footer>
      <div class="margin-left--auto">
        <PButton
          pType="primary"
          data-testid="account-rights-submit-button"
          @click="handleRetryMassActivationEmail"
        >
          {{ t('submit') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import {
  PDrawer,
  PUserCard,
  PButton,
  PTag,
  PLoader,
  PIPatchCheck,
  PIPower,
  PIPerson,
} from '@kpmg/styleguide'
import type { ResendActivationEmailDrawerProps } from './ResendActivationEmailDrawerTypes'
import { fetchAccountContacts } from '@/services/wallet'
import { formatItemsFromApi } from '@/pages/folder/pages/usersClient/UsersClientHelper'
import TableData from '@/pages/folder/pages/usersClient/components/TableData'
import NoResult from '@/common/components/NoResult'
import type { ExtendedUser } from '@/pages/folder/pages/usersClient/UsersClientTypes'
import type { UserStatus } from '@/common/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ResendActivationEmailDrawerProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const isLoading = ref(true)
const usersClientAccount = ref<ExtendedUser[]>([])
const selectedUsersIds = ref<number[]>([])

const isResendActivationEmailDrawerVisible = computed({
  get() {
    return props.modelValue
  },
  set(isOpened: boolean) {
    emit('update:modelValue', isOpened)
  },
})

const handleCloseDrawer = () => {
  isResendActivationEmailDrawerVisible.value = false
}
const handleSelectUser = (userClientIds: number[]) => {
  selectedUsersIds.value = userClientIds
}
const handleRetryMassActivationEmail = () => {
  console.warn("Don't worry; it's not a mistake—there's another PR coming up after this one 😎")
}
const getStatus = (status: string): UserStatus => {
  switch (status) {
    case 'Declared':
      return {
        text: t('statusDeclared'),
        icon: PIPatchCheck,
        color: 'gray-900',
      }
    case 'Connected':
      return {
        text: t('statusConnect'),
        icon: PIPower,
        color: 'success',
      }
    default:
      return {
        text: t('statusInvite'),
        icon: PIPerson,
        color: 'persian',
      }
  }
}

onMounted(async () => {
  try {
    const searchParams = new URLSearchParams({
      pageSize: '100',
      Type: 'Customer',
    })
    const { items } = await fetchAccountContacts(props.selectedAccount.accountId, searchParams)
    usersClientAccount.value = formatItemsFromApi(items).map(
      (item) => ({ ...item, statusTag: getStatus(item.status) }))
  } catch (error) {
    console.error('Error fetching users client account :', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<i18n lang="yaml">
  en-US:
    submit: 'Submit'
    statusInvite: 'Invited'
    statusConnect: 'Connected'
    statusDeclared: 'Declared'
    clientCompany: 'Client Company'
    selectClientUsers: 'Select client users'
    resendTheActivationEmail: 'Resend the activation email'
    pleaseSelectUsers: 'Please select the users for whom you wish to send a Pulse account activation email.'
  fr-FR:
    submit: 'Valider'
    statusInvite: 'Invité'
    statusConnect: 'Connecté'
    statusDeclared: 'Declaré'
    clientCompany: 'Société cliente'
    selectClientUsers: 'Sélectionnez des utilisateurs clients'
    resendTheActivationEmail: "Relancer le mail d'activation"
    pleaseSelectUsers: >-
      Veuillez sélectionner les utilisateurs pour lesquels vous souhaitez envoyer un e-mail
      d'activation du compte Pulse.
  </i18n>
