<template>
  <div class="shadow--3 radius--2 overflow-hidden margin-top--6">
    <PBlockHeader
      :pTitle="t('headerTitle')"
      :pDescription="t('headerSubtitle')"
      pColor="gray"
      pSize="default"
      :pImage="{
        pFit: 'fill',
        pType: 'portrait',
        pName: 'activation'
      }"
      pHasButton
    >
      <PButton
        pType="primary"
        pSize="small"
        @click="$emit('activate-offers')"
        data-testid="activate-offers"
      >
        {{ t('activateOffers') }}
        <PIcon class="el-button__icon--right">
          <PIArrowRight />
        </PIcon>
      </PButton>
    </PBlockHeader>
    <PTable
      :pData="activeOffers"
      tableLayout="fixed"
      class="offers-table"
      showOverflowTooltip
      pStripe
    >
      <PTableColumn
        :pLabel="t('offer')"
        pWidth="480px"
        pSortable
      >
        <template #default="scope">
          <div class="flex">
            <PImage
              pType="logos"
              :pName="scope.row.logo"
              class="offers-table__offer-logo margin-right--2"
            />
            <p class="text-capitalize">
              <span class="font-semibold">{{ scope.row.name }}</span
              >&nbsp;
              <span class="font-small">{{ scope.row.provider }}</span>
            </p>
          </div>
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('status')" pSortable>
        <template #default="scope">
          <PTag
            pColor="success"
            pEffect="light"
            pIconLeft="PICheckCircle"
            :pContent="scope.row.status"
          />
        </template>
      </PTableColumn>
      <PTableColumn :pLabel="t('action')" pWidth="80px">
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
import {
  PBlockHeader,
  PButton,
  PIcon,
  PIThreeDots,
  PIArrowRight,
  PTag,
  PTable,
  PTableColumn,
  PImage
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import { getActiveOffersMocked } from './OffersMocks'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

defineEmits<{
  'activate-offers': []
}>()

const activeOffers = getActiveOffersMocked()
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
  headerTitle: 'Offer activation'
  headerSubtitle: 'Manage the offers enabled and activatable for this folder.'
  activateOffers: 'Activate offers'
  offer: 'Offer'
  status: 'Status'
  action: 'Action'
fr-FR:
  headerTitle: "Activation d'offres"
  headerSubtitle: 'Gérez les offres activées et activables pour ce dossier'
  activateOffers: 'Activer les offres'
  offer: 'Offre'
  status: 'Statut'
  action: 'Action'
</i18n>
