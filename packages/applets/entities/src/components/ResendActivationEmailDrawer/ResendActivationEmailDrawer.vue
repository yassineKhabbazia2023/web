<template>
  <PDrawer
    v-model="isResendActivationEmailDrawerVisible"
    :pTitle="drawerTitle"
    pSize="50%"
    destroyOnClose
    @close-drawer-button="handleCloseDrawer"
  >
    <PUserCard
      :pTitle="selectedAccount.name"
      :pSubtitle="selectedAccount.accountNumber"
      pColor="gray"
      pImageName="folder-open-duotone"
      class="margin-bottom--6"
      data-testid="account-rights-company-card"
    >
      <PTag
        pSize="default"
        pColor="gray"
        pIconLeftName="building"
        :pContent="companyTagLabel"
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
        <UsersList
          v-if="usersClientAccount.length > 0"
          :data="usersClientAccount"
          isAccountManagement
          @select-user="handleSelectUser"
        />
        <NoResult v-if="usersClientAccount.length === 0" />
      </div>
    </div>
    <template #footer>
      <PDrawerActions
        :pPrimaryCTA="primaryCTA"
        @click-primary-cta="handleRetryMassActivationEmail"
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
  PDrawerActions,
  PUserCard,
  PTag,
  PLoader,
} from '@pulse/styleguide/components'
import type { PDrawerActionButton } from '@pulse/styleguide/types'
import type { ResendActivationEmailDrawerProps } from './ResendActivationEmailDrawerTypes'
import { fetchAccountContacts } from '@entities/services/wallet'
import { inviteCustomers } from '@entities/services/contact'
import { displayNotification } from '@pulse/styleguide'
import { formatItemsFromApi } from '@entities/helpers'
import UsersList from '@entities/components/users-list'
import NoResult from '@entities/components/NoResult'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { ExtendedUser, UserStatus } from '@entities/types'
import { ContactType, AccountType } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      submit: 'Submit',
      statusInvite: 'Invited',
      statusConnect: 'Connected',
      statusDeclared: 'Declared',
      clientCompany: 'Client Company',
      prospect: 'Prospect',
      selectClientUsers: 'Select client users',
      resendTheActivationEmail: 'Resend the activation email',
      customersInvitationFailed: 'There was an issue inviting all selected customers.',
      invitationEmailsSent: 'The user invitation email has been sent. | The user invitation emails have been sent.',
      pleaseSelectUsers: 'Please select the users for whom you wish to send a RYDGE Conseil account activation email.',
    },
    'fr-FR': {
      submit: 'Valider',
      statusInvite: 'Invité',
      statusConnect: 'Connecté',
      statusDeclared: 'Déclaré',
      clientCompany: 'Société cliente',
      prospect: 'Prospect',
      selectClientUsers: 'Sélectionnez des utilisateurs clients',
      resendTheActivationEmail: 'Relancer le mail d\'activation',
      customersInvitationFailed: 'Il y a eu un problème pour inviter tous les clients sélectionnés.',
      invitationEmailsSent: 'Le mail d\'invitation utilisateur a été envoyé | Les mails d\'invitation utilisateur ont été envoyés',
      pleaseSelectUsers: 'Veuillez sélectionner les utilisateurs pour lesquels vous souhaitez envoyer un e-mail d\'activation du compte RYDGE Conseil.',
    },
  },
})

const props = defineProps<ResendActivationEmailDrawerProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const isLoading = ref(true)
const usersClientAccount = ref<ExtendedUser[]>([])
const selectedUsersIds = ref<number[]>([])

const primaryCTA = computed<PDrawerActionButton>(() => ({
  pLabel: t('submit'),
  pDisabled: selectedUsersIds.value.length === 0,
  pTestId: 'resend-activation-email-submit-button',
}))

const companyTagLabel = computed(() =>
  props.accountType === AccountType.PROSPECT ? t('prospect') : t('clientCompany'),
)

const drawerTitle = computed(() =>
  props.accountType === AccountType.PROSPECT
    ? t('entities.wallet.entitiesListProspects.inviteProspectToTheirSpace')
    : t('resendTheActivationEmail'),
)

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
const handleRetryMassActivationEmail = async () => {
  isLoading.value = true
  try {
    const invitedCustomerIDs = await inviteCustomers(
      selectedUsersIds.value,
      props.selectedAccount.accountId,
      props.accountType,
    )
    if (invitedCustomerIDs && invitedCustomerIDs.length > 0) {
      await fetchAccountUsers()

      displayNotification('success', t('invitationEmailsSent', invitedCustomerIDs.length))
      AmplitudeService.track('Onboarding Relaunched', {
        onboarding_relaunch_result: 'succeeded',
      })
    }
  } catch {
    displayNotification('error', t('customersInvitationFailed'))
    AmplitudeService.track('Onboarding Relaunched', {
      onboarding_relaunch_result: 'failed',
    })
  } finally {
    selectedUsersIds.value = []
    isLoading.value = false
  }
}

const getStatus = (status: string): UserStatus => {
  switch (status) {
    case 'Declared':
      return {
        text: t('statusDeclared'),
        iconName: 'patchCheck',
        color: 'gray',
      }
    case 'Connected':
      return {
        text: t('statusConnect'),
        iconName: 'power',
        color: 'success',
      }
    default:
      return {
        text: t('statusInvite'),
        iconName: 'person',
        color: 'default',
      }
  }
}

const fetchAccountUsers = async () => {
  isLoading.value = true
  try {
    const searchParams = new URLSearchParams({
      pageSize: '100',
      Type: ContactType.CUSTOMER,
    })
    const { items } = await fetchAccountContacts(props.selectedAccount.accountId, searchParams)
    usersClientAccount.value = formatItemsFromApi(items).map(
      (item) => ({ ...item, statusTag: getStatus(item.status) }))
  } catch (error) {
    logger.error('Error fetching users client account :', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAccountUsers)
</script>

