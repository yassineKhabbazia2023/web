<template>
  <div
    v-if="isLoading"
    class="loader flex flex--justify-content-center flex--align-items-center"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else>
    <SubscriptionsFilter
      v-model:offerTypeSelection="offerTypeSelection"
      @apply-offer-filter="handleOfferFiltered"
    />
    <PTable
      pStripe
      :pData="filteredSubscriptions"
      data-testid="subscriptions-table"
    >
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
      <PTableColumn :pLabel="t('customerCode')">
        <template #default="scope">
          <PText
            :pContent="scope.row.account?.accountNumber"
            pType="primary"
            :disabled="false"
            :selected="false"
          />
        </template>
      </PTableColumn>
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
      <PTableColumn :pLabel="t('user')">
        <template #default="scope">
          <PDoubleText
            :pTitle="title(scope.row.clients)"
            :pContent="content(scope.row.clients)"
            pType="primary"
            :pDisabled="false"
            :pSelected="false"
            :pProfile="profile(scope.row.clients)"
            :pAvatarRole="AvatarRoles.CLIENT"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('status')">
        <template #default="scope">
          <PTag
            :pColor="getStatusDetails(scope.row.status).color"
            :pIconLeftName="getStatusDetails(scope.row.status).iconName"
            :pContent="getStatusDetails(scope.row.status).text"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('actions')" :pWidth="80">
        <template #default="scope">
          <PToolbox
            trigger="click"
            :pElements="requestMenu"
            data-testid="subscription-actions-toolbox"
            @p-toolbox-item-clicked="($event: string) => onClickToolboxItem($event, scope.row)"
          >
            <PButton
              pSize="small"
              :pLoading="scope.row.subscriptionId === clickedRow && isActionInProgress"
              class="el-button--icon"
            >
              <PIcon pName="threeDots" />
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
} from '@pulse/styleguide/components'
import { AvatarRoles, displayNotification } from '@pulse/styleguide'
import type { PToolboxItemProps, IconName, PTagProps } from '@pulse/styleguide/types'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useUserStore } from '@pulse/common/stores'
import { type SubscriptionRequest, SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import { fetchSubscriptionRequests, validateSubscriptionRequest } from '@entities/services/subscription'
import { getInitials } from '@entities/helpers'
import SubscriptionsFilter from './components/SubscriptionsFilter'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import type { Contact } from '@entities/services/contact/contactTypes'
import { logger } from '@pulse/toolbox'
import { OfferPlanManager } from '@entities/components/OfferSubscription/components/OfferPlanSubscription/offer-plan.manager'
import { FeatureFlagManager } from '@pulse/common/managers'

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
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const offerTypeSelection = ref<string[]>([])
const subscriptions = ref<SubscriptionRequest[]>([])
const filteredSubscriptions = ref<SubscriptionRequest[]>([])
const requestMenu: PToolboxItemProps[] = [
  {
    pIconName: 'eye',
    pValue: t('consult'),
    pActionName: 'consult',
    pState: 'default',
  },
  {
    pIconName: 'check',
    pValue: t('validate'),
    pActionName: 'validate',
    pState: 'default',
  },
]

const fetchSubscriptions = async () => {
  subscriptions.value = await fetchSubscriptionRequests()
  filteredSubscriptions.value = subscriptions.value
}

interface StatusDetails {
  text: string
  color: PTagProps['pColor']
  iconName: IconName
}

const getStatusDetails = (status: string): StatusDetails => {
  switch (status) {
    case SubscriptionStatusCode.VALIDATED:
      return { text: t('validated'), color: 'success', iconName: 'checkCircle' }
    case SubscriptionStatusCode.PENDING:
      if (FeatureFlagManager.isModscreenV2Activated() === true) {
        return { text: t('toCreate'), color: 'info', iconName: 'infoCircle' }
      }
      return { text: t('pending'), color: 'info', iconName: 'infoCircle' }
    case SubscriptionStatusCode.PENNYLANE_CREATED:
      return { text: t('pennylaneCreated'), color: 'light-green', iconName: 'checkCircle' }
    case SubscriptionStatusCode.PENNYLANE_NOT_CREATED:
      return { text: t('pennylaneNotCreated'), color: 'orange', iconName: 'exclamationTriangle' }
    case SubscriptionStatusCode.PENNYLANE_TO_VERIFY:
      return { text: t('pennylaneToVerify'), color: 'blue', iconName: 'search' }
    default:
      return { text: status, color: 'info', iconName: 'infoCircle' }
  }
}

const validateSubscription = async (subscriptionId: number, offer: SubscriptionRequest['offer'], statusText: string) => {
  const selectedPlan = OfferPlanManager.getSelectedPlan(offer.plans)

  isActionInProgress.value = true
  clickedRow.value = subscriptionId
  try {
    await validateSubscriptionRequest(subscriptionId, user?.value?.email)
    AmplitudeService.track('Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'succeeded',
      subscription_complete_plan: selectedPlan?.planName,
      subscription_complete_statut: statusText,
    })
    AmplitudeService.track('Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'succeeded',
    })
    displayNotification('success', t('offerActivated'))
    await fetchSubscriptions()
    handleOfferFiltered()
  } catch {
    AmplitudeService.track('Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'failed',
      subscription_complete_plan: selectedPlan?.planName,
      subscription_complete_statut: statusText,
    })
    AmplitudeService.track('Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'failed',
    })
    displayNotification('error', t('offerNotActivated'))
  }
  isActionInProgress.value = false
}

const onClickToolboxItem = async (action: string, row: any) => {
  const { subscriptionId, offer, status } = row

  if (action === 'consult') {
    emit('consult', subscriptionId)
  } else if (action === 'validate') {
    await validateSubscription(subscriptionId, offer, getStatusDetails(status).text)
  }
}

const profile = (clients: Contact[]) =>
  getInitials(clients[0]?.firstName, clients[0]?.lastName)

const title = (clients: Contact[]) =>
  `${clients[0]?.firstName} ${clients[0]?.lastName}`

const content = (clients: Contact[]) => clients[0]?.email

const handleOfferFiltered = () => {
  filteredSubscriptions.value = subscriptions.value.filter((subscription) =>
    offerTypeSelection.value.includes(subscription.offer.offerCode),
  )
}

onMounted(async () => {
  try {
    await fetchSubscriptions()
  } catch (e) {
    logger.error(e)
  } finally {
    isLoading.value = false
  }
})

defineExpose({
  onClickToolboxItem,
  handleOfferFiltered,
  offerTypeSelection,
})
</script>

<i18n lang="yaml">
en-US:
  customerCode: 'Customer code'
  legalName: 'Legal name'
  user: 'User'
  requester: 'Requester'
  offer: 'Offer'
  status: 'Status'
  actions: 'Actions'
  dateRequest: 'Date'
  validate: 'Validate request'
  consult: 'Consult'
  validated: 'Activated'
  pending: 'To validate'
  toCreate: 'To create'
  pennylaneCreated: 'Update plan'
  pennylaneNotCreated: 'To create'
  pennylaneToVerify: 'To verify'
  offerActivated: 'The offer has been activated'
  offerNotActivated: 'The offer could not be activated'
fr-FR:
  customerCode: 'Code client'
  legalName: 'Raison sociale'
  user: 'Utilisateur'
  requester: 'Demandeur'
  offer: 'Offre'
  status: 'Statut'
  actions: 'Actions'
  dateRequest: 'Date'
  validate: 'Valider la demande'
  consult: 'Consulter'
  validated: 'Activée'
  pending: 'A valider'
  toCreate: 'À créer'
  pennylaneCreated: 'Modifier le plan'
  pennylaneNotCreated: 'A créer'
  pennylaneToVerify: 'À vérifier'
  offerActivated: "L'offre a été activée"
  offerNotActivated: "L'offre n'a pas pu être activée"
</i18n>
