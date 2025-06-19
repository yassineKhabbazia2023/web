<template>
  <div class="overflow-hidden margin-top--6">
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
        {{ t('activateOffers') }}
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
    <PTable
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
        pWidth="480px"
        pSortable
      >
        <template #default="{ row: { offer: offerActivation } }">
          <div class="flex">
            <PImage
              pType="logos"
              :pName="offerActivation.logoName"
              class="offers-table__offer-logo margin-right--2"
            />
            <p class="text-capitalize">
              <span class="font-semibold">{{ offerActivation.offerName }}</span>
            </p>
          </div>
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('status')" pSortable>
        <template #default="{ row: { status: offerActivationStatus } }">
          <OfferActivationStatus
            v-if="user"
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
    </PTable>
  </div>
  <OffersDrawer
    v-if="isOffersDrawerOpened && selectedEntity && user"
    v-model="isOffersDrawerOpened"
    :selectedCompanyName="selectedEntity.legalName"
    :accountNumber="selectedEntity.accountNumber"
    :accountId="selectedEntity.accountId"
    :currentUser="user"
    data-testid="offers-drawer"
  />
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { CurrentUserManager } from '@pulse/common/managers'
import {
  PBlockHeader,
  PButton,
  PIcon,
  PLoader,
  PTable,
  PTableColumn,
  PImage,
  PTooltip,
} from '@pulse/styleguide/components'
import OfferActivationStatus from './components/OfferActivationStatus'
import type { SubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'
import { fetchAccountSubscriptions } from '@entities/services/subscription'
import OffersDrawer from '@entities/pages/entities/components/OffersDrawer'
import { PERMISSION_CODES } from '@entities/constants'
import { useSelectedEntityStore, useUserStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'
import { OfferActivationStatus as OfferActivationStatusEnum } from './components/OfferActivationStatus/OfferActivationStatusTypes'
import { RouterHelpers } from '@pulse/common/helpers'

const route = useRoute()
const userStore = useUserStore()
const selectedEntityStore = useSelectedEntityStore()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineEmits<{
  'activate-offers': []
}>()

const isLoading = ref(true)
const isOffersDrawerOpened = ref(false)
const activeOffers = ref<SubscriptionRequest[]>([])

const { isCollab, user } = storeToRefs(userStore)
const { selectedEntity } = storeToRefs(selectedEntityStore)

const headerTitle = computed(() =>
  isCollab.value ? t('collabHeaderTitle') : t('clientHeaderTitle'),
)
const headerSubtitle = computed(() =>
  isCollab.value ? t('collabHeaderSubtitle') : t('clientHeaderSubtitle'),
)
const isActivateOffersButtonVisible = computed(
  () => isCollab.value && CurrentUserManager.hasPermission(PERMISSION_CODES.ACTIVATE_OFFER),
)

const handleActivateOffersClick = () => {
  isOffersDrawerOpened.value = true
}

onMounted(async () => {
  try {
    const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)
    // entityId can't be null here, so we use non-null assertion
    activeOffers.value = await fetchAccountSubscriptions(entityId!)
  } catch (error) {
    logger.error('fetching account subscriptions', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.offers-table {
  &__offer-logo {
    width: 24px;
    height: 24px;
  }
}
</style>
<i18n lang="yaml">
en-US:
  collabHeaderTitle: 'Offer activation'
  clientHeaderTitle: 'Activated offers'
  collabHeaderSubtitle: 'Manage the offers enabled and activatable for this folder.'
  clientHeaderSubtitle: 'Digital offers activated for this entity.'
  activateOffers: 'Activate offers'
  offer: 'Offer'
  status: 'Status'
  failedMigrationAdditionalInfos: |
    ● Nos équipes travaillent activement à résoudre la situation. Vous serez informé(e) par email dès que la migration
      sera terminée avec succès.
    ● En attendant la réussite de la migration, vous pouvez redéposer des documents dans l’espace documentaire
      de la plateforme RYDGE Conseil.
fr-FR:
  collabHeaderTitle: "Activation d'offres"
  clientHeaderTitle: 'Offres activées'
  collabHeaderSubtitle: 'Gérez les offres activées et activables pour ce dossier'
  clientHeaderSubtitle: 'Les offres digitales activées pour cette entité'
  activateOffers: 'Activer les offres'
  offer: 'Offre'
  status: 'Statut'
  failedMigrationAdditionalInfos: |
    ● Nos équipes travaillent activement à résoudre la situation. Vous serez informé(e) par email dès que la migration
      sera terminée avec succès.
    ● En attendant la réussite de la migration, vous pouvez redéposer des documents dans l’espace documentaire
      de la plateforme RYDGE Conseil.
</i18n>
