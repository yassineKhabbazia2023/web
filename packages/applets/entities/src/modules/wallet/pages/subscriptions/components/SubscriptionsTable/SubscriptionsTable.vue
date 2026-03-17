<template>
  <SubscriptionsFilter
    v-model:offerTypeSelection="offerTypeSelection"
    @apply-offer-filter="handleOfferFiltered"
  />
  <div
    v-if="isLoading"
    class="loader flex flex--justify-content-center flex--align-items-center"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div v-else>
    <PTable
      pStripe
      :pData="searchResult.items"
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
            :pElements="requestMenu(scope.row.status)"
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
    <PPagination
      v-model:p-page-size="searchCriteria.limit"
      class="margin-top--6"
      data-testid="subscriptions-table-pagination"
      :pCurrentPage="searchResult.currentPage"
      :pTotal="searchResult.totalItems"
      :pPageSizes="PAGE_SIZES"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      @on-page-range-changed="handlePageRangeChange"
      @update:p-current-page="handlePageChange"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  PButton,
  PDoubleText,
  PTable,
  PTableColumn,
  PToolbox,
  PIcon,
  PPagination,
  PTag,
  PText,
  PLoader,
} from '@pulse/styleguide/components'
import { AvatarRoles, displayNotification } from '@pulse/styleguide'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { StatusDetails, SubscriptionSearchCriteria } from './subscriptions-table.types'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useUserStore } from '@pulse/common/stores'
import { type SubscriptionRequest, SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import { fetchSubscriptionRequests, validateSubscriptionRequest } from '@entities/services/subscription'
import { getInitials } from '@entities/helpers'
import SubscriptionsFilter from './components/SubscriptionsFilter'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { PaginationResponse } from '@pulse/common/types'
import { PAGE_SIZES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import { OfferPlanManager } from '@entities/components/OfferSubscription/components/OfferPlanSubscription/offer-plan.manager'
import { FeatureFlagManager } from '@pulse/common/managers'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
  messages: {
    'en-US': {
      customerCode: 'Customer code',
      legalName: 'Legal name',
      user: 'User',
      requester: 'Requester',
      offer: 'Offer',
      status: 'Status',
      actions: 'Actions',
      dateRequest: 'Date',
      validate: 'Validate request',
      consult: 'Consult',
      validated: 'Validated',
      pending: 'To validate',
      toCreate: 'To create',
      pennylaneCreated: 'Update plan',
      pennylaneNotCreated: 'To create',
      pennylaneToVerify: 'To verify',
      offerActivated: 'The offer has been activated',
      offerNotActivated: 'The offer could not be activated',
      on: 'on',
    },
    'fr-FR': {
      customerCode: 'Code client',
      legalName: 'Raison sociale',
      user: 'Utilisateur',
      requester: 'Demandeur',
      offer: 'Offre',
      status: 'Statut',
      actions: 'Actions',
      dateRequest: 'Date',
      validate: 'Valider la demande',
      consult: 'Consulter',
      validated: 'Validée',
      pending: 'A valider',
      toCreate: 'À créer',
      pennylaneCreated: 'Modifier le plan',
      pennylaneNotCreated: 'À créer',
      pennylaneToVerify: 'À vérifier',
      offerActivated: 'L\'offre a été activée',
      offerNotActivated: 'L\'offre n\'a pas pu être activée',
      on: 'sur',
    },
  },
})

const props = defineProps<{
  activeStatusCodes: SubscriptionStatusCode[]
}>()

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

const searchCriteria = ref<SubscriptionSearchCriteria>({
  currentPage: 1,
  limit: PAGE_SIZES[0],
  statusCodes: props.activeStatusCodes,
  offerCodes: [],
  sorting: {
    field: 'creationDate',
    descending: true,
  },
})

const searchResult = ref<PaginationResponse<SubscriptionRequest>>({
  items: [],
  currentPage: 1,
  totalItems: 0,
  totalPages: 0,
})

const paginationLabel = computed(() => getPaginationLabel(t('on'), {
  currentPage: searchCriteria.value.currentPage,
  limit: searchCriteria.value.limit,
  data: searchResult.value.items,
  totalItems: searchResult.value.totalItems,
}))

const requestMenu = (offerState: SubscriptionStatusCode): PToolboxItemProps[] => {
  const menuItems: PToolboxItemProps[] = [
    {
      pIconName: 'eye',
      pValue: t('consult'),
      pActionName: 'consult',
      pState: 'default',
    }]

  if (offerState !== SubscriptionStatusCode.VALIDATED) {
    menuItems.push({
      pIconName: 'check',
      pValue: t('validate'),
      pActionName: 'validate',
      pState: 'default',

    })
  }

  return menuItems
}

const fetchSubscriptions = async () => {
  const { currentPage, limit, statusCodes, offerCodes, sorting } = searchCriteria.value
  searchResult.value = await fetchSubscriptionRequests({
    statusCodes,
    offerCodes,
    page: currentPage,
    pageSize: limit,
    sortField: sorting.field,
    sortDescending: sorting.descending,
  })
}

const loadSubscriptions = async () => {
  if (searchCriteria.value.statusCodes.length === 0) {
    searchResult.value = { items: [], currentPage: 1, totalItems: 0, totalPages: 0 }
    return
  }
  isLoading.value = true
  try {
    await fetchSubscriptions()
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = async (page: number) => {
  searchCriteria.value.currentPage = page
  await loadSubscriptions()
}

const handlePageRangeChange = async (pageSize: number) => {
  searchCriteria.value.limit = pageSize
  searchCriteria.value.currentPage = 1
  await loadSubscriptions()
}

const handleStatusCodesChange = async (newStatusCodes: SubscriptionStatusCode[]) => {
  searchCriteria.value.statusCodes = newStatusCodes
  searchCriteria.value.currentPage = 1
  await loadSubscriptions()
}

watch(() => props.activeStatusCodes, handleStatusCodesChange, { deep: true })

const getStatusDetails = (status: string): StatusDetails => {
  switch (status) {
    case SubscriptionStatusCode.VALIDATED:
      return { text: t('validated'), color: 'success', iconName: 'checkCircle' }
    case SubscriptionStatusCode.PENDING:
      if (FeatureFlagManager.isModscreenV2Activated() === true) {
        return { text: t('toCreate'), color: 'orange', iconName: 'arrowUpCircle' }
      }
      return { text: t('pending'), color: 'info', iconName: 'infoCircle' }
    case SubscriptionStatusCode.PENNYLANE_CREATED:
      return { text: t('pennylaneCreated'), color: 'purple', iconName: 'arrowRepeat' }
    case SubscriptionStatusCode.PENNYLANE_NOT_CREATED:
      return { text: t('pennylaneNotCreated'), color: 'orange', iconName: 'arrowUpCircle' }
    case SubscriptionStatusCode.PENNYLANE_TO_VERIFY:
      return { text: t('pennylaneToVerify'), color: 'light-blue', iconName: 'search' }
    default:
      return { text: status, color: 'info', iconName: 'infoCircle' }
  }
}

const validateSubscription = async (subscriptionId: number, offer: SubscriptionRequest['offer'], statusText: string) => {
  const selectedPlan = OfferPlanManager.getSelectedPlan(offer.plans)
  const selectedPricing = OfferPlanManager.getSelectedPricing(offer.plans)

  isActionInProgress.value = true
  clickedRow.value = subscriptionId
  try {
    await validateSubscriptionRequest(subscriptionId, user?.value?.email)
    AmplitudeService.track('Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'succeeded',
      subscription_complete_plan: selectedPlan?.planName,
      subscription_complete_forfait: selectedPricing?.label,
      subscription_complete_statut: statusText,
    })
    AmplitudeService.track('Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'succeeded',
    })
    displayNotification('success', t('offerActivated'))
    await fetchSubscriptions()
  } catch {
    AmplitudeService.track('Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'failed',
      subscription_complete_plan: selectedPlan?.planName,
      subscription_complete_forfait: selectedPricing?.label,
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

const onClickToolboxItem = async (action: string, row: Pick<SubscriptionRequest, 'subscriptionId' | 'offer' | 'status'>) => {
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

const handleOfferFiltered = async () => {
  searchCriteria.value.offerCodes = offerTypeSelection.value
  searchCriteria.value.currentPage = 1
  await loadSubscriptions()
}

defineExpose({
  onClickToolboxItem,
  handleOfferFiltered,
  offerTypeSelection,
  searchCriteria,
  searchResult,
})
</script>

