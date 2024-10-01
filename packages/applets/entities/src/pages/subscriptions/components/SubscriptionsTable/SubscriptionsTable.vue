<template>
  <div
    v-if="isLoading"
    class="loader flex flex--justify-content-center flex--align-items-center"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else>
    <SubscriptionsFilter @apply-offer-filter="handleOfferFiltered" />
    <PTable
      pStripe
      :pData="filteredSubscriptions"
      data-testid="subscriptions-table"
    >
      <PTableColumn :pLabel="t('dateRequest')">
        <template #default="scope">
          <PText
            :pContent="d(new Date(scope.row.creationDate), 'short')"
            pType="primary"
            :disabled="false"
            :selected="false"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('folderId')">
        <template #default="scope">
          <PText
            :pContent="scope.row.account?.accountNumber"
            pType="primary"
            :disabled="false"
            :selected="false"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('legalName')">
        <template #default="scope">
          <PText
            :pContent="scope.row.account?.accountLegalName"
            pType="primary"
            :disabled="false"
            :selected="false"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('principalContact')">
        <template #default="scope">
          <PDoubleText
            :pTitle="title(scope.row.clients)"
            :pContent="content(scope.row.clients)"
            pType="primary"
            :pDisabled="false"
            :pSelected="false"
            :pProfile="profile(scope.row.clients)"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('requester')">
        <template #default="scope">
          <PText
            :pContent="scope.row.applicant"
            pType="primary"
            :disabled="false"
            :selected="false"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('offer')">
        <template #default="scope">
          <PText
            :pContent="scope.row.offer?.offerLabel"
            pType="primary"
            :disabled="false"
            :selected="false"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('status')">
        <template #default="scope">
          <PTag
            :pColor="
              scope.row.status === SubscriptionStatusCode.VALIDATED
                ? 'success'
                : 'info'
            "
            pEffect="light"
            :pContent="formatStatus(scope.row.status)"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('options')" :pWidth="80">
        <template #default="scope">
          <PToolbox
            trigger="click"
            :pElements="requestMenu"
            data-testid="subscription-actions-toolbox"
            @p-toolbox-item-clicked="($event: string) => onClickToolboxItem($event, scope.row)"
          >
            <PButton
              pType="white"
              pSize="small"
              :pLoading="scope.row.subscriptionId === clickedRow && isActionInProgress"
              class="el-button--icon"
            >
              <PIcon>
                <PIThreeDots />
              </PIcon>
            </PButton>
          </PToolbox>
        </template>
      </PTableColumn>
    </PTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  PButton,
  PDoubleText,
  PTable,
  PTableColumn,
  PToolbox,
  PIcon,
  PTag,
  PText,
  PLoader,
  PIThreeDots,
  type PToolboxItemProps,
} from '@pulse/styleguide'
import { commonStore, amplitudeService } from '@pulse/common'
import {
  type SubscriptionRequest,
  fetchSubscriptionRequests,
  validateSubscriptionRequest,
  SubscriptionStatusCode,
} from '@entities/services/subscription'
import { getInitials } from '@entities/helper'
import { displayNotification } from '@entities/common/utils/helpers'
import SubscriptionsFilter from './components/SubscriptionsFilter'
import { DATE_TIME_FORMATS as datetimeFormats } from '@entities/constants'
import type { Contact } from '@entities/services/contact/contactTypes'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const emit = defineEmits<{
  consult: [number]
  validate: [string]
}>()

const isLoading = ref(true)
const isActionInProgress = ref(false)
const clickedRow = ref<number>()
const userStore = commonStore()
const { user } = storeToRefs(userStore)
const subscriptions = ref<SubscriptionRequest[]>([])
const filteredSubscriptions = ref<SubscriptionRequest[]>([])
const requestMenu: PToolboxItemProps[] = [
  {
    pIconName: 'PIEye',
    pValue: t('consult'),
    pActionName: 'consult',
    pState: 'default',
  },
  {
    pIconName: 'PICheck',
    pValue: t('validate'),
    pActionName: 'validate',
    pState: 'default',
  },
]

const fetchSubscriptions = async () => {
  subscriptions.value = await fetchSubscriptionRequests()
  filteredSubscriptions.value = subscriptions.value
}

const formatStatus = (status: string) => {
  return status === SubscriptionStatusCode.PENDING ? t('toValidate') : status
}

const validateSubscription = async (subscriptionId: number, offer: SubscriptionRequest['offer']) => {
  isActionInProgress.value = true
  clickedRow.value = subscriptionId
  try {
    await validateSubscriptionRequest(subscriptionId, user?.value?.email)
    amplitudeService.track('Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'succeeded',
    })
    amplitudeService.track('Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'succeeded',
    })
    displayNotification('success', t('offerActivated'))
    await fetchSubscriptions()
  } catch {
    amplitudeService.track('Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'failed',
    })
    amplitudeService.track('Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'failed',
    })
    displayNotification('error', t('offerNotActivated'))
  }
  isActionInProgress.value = false
}

const onClickToolboxItem = async (action: string, row: any) => {
  const { subscriptionId, offer } = row

  if (action === 'consult') {
    emit('consult', subscriptionId)
  } else if (action === 'validate') {
    await validateSubscription(subscriptionId, offer)
  }
}

const profile = (clients: Contact[]) =>
  getInitials(clients[0]?.firstName, clients[0]?.lastName)

const title = (clients: Contact[]) =>
  `${clients[0]?.firstName} ${clients[0]?.lastName}`

const content = (clients: Contact[]) => clients[0]?.email

const handleOfferFiltered = (offerTypes: string[]) => {
  filteredSubscriptions.value = subscriptions.value.filter((subscription) =>
    offerTypes.includes(subscription.offer.offerCode),
  )
}

onMounted(async () => {
  try {
    await fetchSubscriptions()
  } catch {} finally {
    isLoading.value = false
  }
})

defineExpose({
  onClickToolboxItem,
  handleOfferFiltered,
})
</script>

<i18n lang="yaml">
en-US:
  folderId: 'Folder ID'
  legalName: 'Legal name'
  principalContact: 'Principal Contact'
  requester: 'Requester'
  offer: 'Offer'
  status: 'Status'
  options: 'Options'
  dateRequest: 'Request date'
  validate: 'Validate request'
  consult: 'Consult'
  toValidate: 'To validate'
  offerActivated: 'The offer has been activated'
  offerNotActivated: 'The offer could not be activated'
fr-FR:
  folderId: 'ID Dossier'
  legalName: 'Raison sociale'
  principalContact: 'Contact principal'
  requester: 'Demandeur'
  offer: 'Offre'
  status: 'Statut'
  options: 'Options'
  dateRequest: 'Date de la demande'
  validate: 'Valider la demande'
  consult: 'Consulter'
  toValidate: 'A valider'
  offerActivated: "L'offre a été activée"
  offerNotActivated: "L'offre n'a pas pu être activée"
</i18n>
