<template>
  <div class="overflow-hidden margin-top--2">
    <PBlockHeader
      :pTitle="headerTitle"
      :pDescription="headerSubtitle"
      pColor="gray"
      pSize="default"
      pHasButton
    >
      <PButton
        v-if="isActivateOffersButtonVisible"
        pType="primary"
        pSize="small"
        data-testid="folder-offer-activate-offers-button"
        @click="handleActivateOffersClick"
      >
        {{ t('activateOffer') }}
        <PIcon class="el-button__icon--right" pName="arrowRight" />
      </PButton>
    </PBlockHeader>
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="folder-offer-activation-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PResponsiveTable
      v-else
      :pData="activeOffers"
      tableLayout="fixed"
      class="offers-table"
      data-testid="folder-offer-activation-table"
      showOverflowTooltip
      pStripe
    >
      <PTableColumn
        :pLabel="t('offer')"
        pWidth="540px"
      >
        <template #default="{ row: { offer: offerActivation } }">
          <div class="flex">
            <PImage
              pType="logos"
              :pName="offerActivation.logoName"
              class="offers-table__offer-logo margin-right--2"
            />
            <p class="text-capitalize">
              <span class="font-semibold">{{ getOfferNameWithPlan(offerActivation) }}</span>
            </p>
          </div>
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('status')">
        <template #default="{ row: { status: offerActivationStatus } }">
          <OfferActivationStatus
            v-if="user !== undefined"
            :currentUser="user"
            :status="offerActivationStatus"
          />
          <PTooltip
            v-if="offerActivationStatus == OfferActivationStatusEnum.FAILED_MIGRATION"
            :pContent="t('failedMigrationAdditionalInfos')"
            pPlacement="bottom"
          >
            <PIcon
              class="margin-left--3 cursor-pointer"
              pName="infoCircle"
            />
          </PTooltip>
        </template>
      </PTableColumn>

      <!-- Mobile card -->
      <template #mobile-title="{ row }">
        <div class="overflow-hidden">
          <div class="flex flex--align-items-center overflow-hidden">
            <PImage
              pType="logos"
              :pName="row.offer.logoName"
              class="offers-table__offer-logo--mobile margin-right--4"
            />
            <p class="font-semibold text-capitalize flex--grow-1 overflow-hidden">
              {{ getOfferNameWithPlan(row.offer) }}
            </p>
          </div>
          <div class="flex flex--justify-content-flex-end margin-top--1">
            <OfferActivationStatus
              v-if="user !== undefined"
              :currentUser="user"
              :status="row.status"
            />
          </div>
        </div>
      </template>
    </PResponsiveTable>
  </div>
  <OffersDrawer
    v-if="hasOffersDrawer === true && currentEntity !== undefined && user !== undefined"
    ref="offersDrawer"
    v-model="isOffersDrawerOpened"
    :selectedCompanyName="currentEntity.legalName"
    :accountNumber="currentEntity.accountNumber"
    :accountId="currentEntity.accountId"
    :currentUser="user"
    data-testid="offers-drawer"
    @offer-saved="onOfferSaved"
  />
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { onMounted, ref, computed, useTemplateRef, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { CurrentUserManager } from '@pulse/common/managers'
import {
  PBlockHeader,
  PButton,
  PIcon,
  PLoader,
  PResponsiveTable,
  PTableColumn,
  PImage,
  PTooltip,
} from '@pulse/styleguide/components'
import OfferActivationStatus from './components/OfferActivationStatus'
import type { SubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'
import { fetchAccountSubscriptions } from '@entities/services/subscription'
import OffersDrawer from '@entities/components/OffersDrawer'
import { OfferPlanManager } from '@entities/components/OfferSubscription/components/OfferPlanSubscription/offer-plan.manager'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { SubscriptionOfferCode, RouteParam } from '@pulse/common/enums'
import { OfferActivationStatus as OfferActivationStatusEnum } from './enums'
import { RouterHelpers } from '@pulse/common/helpers'

const route = useRoute()
const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      collabHeaderTitle: 'Offer activation',
      clientHeaderTitle: 'Activated offers',
      collabHeaderSubtitle: 'Manage the offers enabled and activatable for this folder.',
      clientHeaderSubtitle: 'Digital offers activated for this entity.',
      activateOffer: 'Activate an offer',
      offer: 'Offer',
      status: 'Status',
      failedMigrationAdditionalInfos: '● Nos équipes travaillent activement à résoudre la situation. Vous serez informé(e) par email dès que la migration\n  sera terminée avec succès.\n● En attendant la réussite de la migration, vous pouvez redéposer des documents dans l’espace documentaire\n  de la plateforme RYDGE Conseil.\n',
    },
    'fr-FR': {
      collabHeaderTitle: 'Activation d\'offres',
      clientHeaderTitle: 'Offres activées',
      collabHeaderSubtitle: 'Gérez les offres activées et activables pour ce dossier',
      clientHeaderSubtitle: 'Les offres digitales activées pour cette entité',
      activateOffer: 'Activer une offre',
      offer: 'Offre',
      status: 'Statut',
      failedMigrationAdditionalInfos: '● Nos équipes travaillent activement à résoudre la situation. Vous serez informé(e) par email dès que la migration\n  sera terminée avec succès.\n● En attendant la réussite de la migration, vous pouvez redéposer des documents dans l’espace documentaire\n  de la plateforme RYDGE Conseil.\n',
    },
  },
})

defineEmits<{
  'activate-offers': []
}>()

const isLoading = ref(true)
const isOffersDrawerOpened = ref(false)
const hasOffersDrawer = ref(false)
const activeOffers = ref<SubscriptionRequest[]>([])

const { isCollab, user } = storeToRefs(userStore)
const { currentEntity } = storeToRefs(currentEntityStore)

const headerTitle = computed(() =>
  isCollab.value ? t('collabHeaderTitle') : t('clientHeaderTitle'),
)
const headerSubtitle = computed(() =>
  isCollab.value ? t('collabHeaderSubtitle') : t('clientHeaderSubtitle'),
)
const isActivateOffersButtonVisible = computed(
  () => isCollab.value && CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ACTIVATE_OFFER),
)

const getOfferNameWithPlan = (offer: SubscriptionRequest['offer']): string => {
  const selectedPlan = OfferPlanManager.getSelectedPlan(offer.plans)
  if (selectedPlan !== undefined && offer.offerCode === SubscriptionOfferCode.PENNYLANE) {
    return `${offer.offerName} : Plan ${selectedPlan.planName}`
  }
  return offer.offerName
}

const offersDrawerRef = useTemplateRef<InstanceType<typeof OffersDrawer>>('offersDrawer')
const handleActivateOffersClick = async () => {
  hasOffersDrawer.value = true
  await nextTick() // needed otherwise offersDrawerRef.value is not defined yet
  offersDrawerRef.value?.initDrawerForCurrentAccount()
  isOffersDrawerOpened.value = true
}

async function loadOffers() {
  try {
    const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
    // entityId can't be null here, so we use non-null assertion
    activeOffers.value = await fetchAccountSubscriptions(entityId!)
    // sort offer by offer status by default
    activeOffers.value = activeOffers.value.sort((a, b) => a.status.localeCompare(b.status))
  } catch (error) {
    logger.error('fetching account subscriptions', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadOffers()
})

async function onOfferSaved() {
  await loadOffers()
  isOffersDrawerOpened.value = false
}
</script>

<style lang="scss" scoped>
.offers-table {
  &__offer-logo {
    width: 24px;
    height: 24px;

    &--mobile {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }
  }
}
</style>
