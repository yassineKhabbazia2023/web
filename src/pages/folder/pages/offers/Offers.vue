<template>
  <div class="shadow--3 radius--2 overflow-hidden margin-top--6">
    <PBlockHeader
      :pTitle="headerTitle"
      :pDescription="headerSubtitle"
      pColor="gray"
      pSize="default"
      :pImage="{
        pFit: 'fill',
        pType: 'portrait',
        pName: 'activation',
      }"
      pHasButton
    >
      <PButton
        v-if="isCollab"
        pType="primary"
        pSize="small"
        @click="$emit('activate-offers')"
        data-testid="folder-offer-activate-offers-button"
      >
        {{ t('activateOffers') }}
        <PIcon class="el-button__icon--right">
          <PIArrowRight />
        </PIcon>
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
          <OfferActivationStatus :status="offerActivationStatus" />
        </template>
      </PTableColumn>
      <PTableColumn
        v-if="isCollab"
        :pLabel="t('action')"
        pWidth="80px"
      >
        <template #default>
          <PButton
            pType="white"
            pSize="small"
            pIconOnly
          >
            <PIcon>
              <PIThreeDots />
            </PIcon>
          </PButton>
        </template>
      </PTableColumn>
    </PTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import {
  PBlockHeader,
  PButton,
  PIcon,
  PIThreeDots,
  PIArrowRight,
  PLoader,
  PTable,
  PTableColumn,
  PImage,
} from '@kpmg/styleguide'
import OfferActivationStatus from './components/OfferActivationStatus'
import {
  type SubscriptionRequest,
  fetchAccountSubscriptions,
} from '@/services/subscription'

const route = useRoute()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineEmits<{
  'activate-offers': []
}>()

const isLoading = ref<boolean>(true)
const { isCollab } = storeToRefs(commonStore())
const activeOffers = ref<SubscriptionRequest[]>([])

const headerTitle = computed(() => isCollab.value ? t('collabHeaderTitle') : t('clientHeaderTitle'))
const headerSubtitle = computed(() => isCollab.value ? t('collabHeaderSubtitle') : t('clientHeaderSubtitle'))

onMounted(async () => {
  try {
    activeOffers.value = await fetchAccountSubscriptions(+route.params.id)
  } catch (error) {
    console.error('fetching account subscriptions', error)
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
  action: 'Action'
fr-FR:
  collabHeaderTitle: "Activation d'offres"
  clientHeaderTitle: 'Offres activées'
  collabHeaderSubtitle: 'Gérez les offres activées et activables pour ce dossier'
  clientHeaderSubtitle: 'Les offres digitales activées pour cette entité'
  activateOffers: 'Activer les offres'
  offer: 'Offre'
  status: 'Statut'
  action: 'Action'
</i18n>
