<template>
  <div>
    <h1 class="margin-bottom--4">
      {{ titleString }}
    </h1>
    <PTable
      :data="entities"
      :stripe="tableInputs.striped"
      highlightCurrentRow
      :rowClassName="tableRowClassName"
    >
      <PTableColumn
        v-if="tableInputs.selectable"
        type="selection"
      />
      <PTableColumn
        :label="labelString"
      >
        <template #default="scope">
          <PEntity
            :content="scope.row.name"
            :icon="PIBuilding"
            type="primary"
            :selected="false"
          >
          </PEntity>
        </template>
      </PTableColumn>
      <PTableColumn
        :label="accountString"
      >
        <template #default="scope">
          <PText
            :content="scope.row.accountNumber"
            :icon="PIPeople"
            type="primary"
            :disabled="false"
            :selected="false"
          >
          </PText>
        </template>
      </PTableColumn>
      <PTableColumn
        width="300"
      >
        <template #default="scope">
          <span v-if="scope.row.accountNumber === ibsSelected" class="ptable-select-entity__check">
            <PIcon
              color="#5546FF"
              size="16"
            >
              <PICheck data-test="icon-check" />
            </PIcon>
          </span>
          <PButton
            v-else
            type="primary"
            plain="true"
            size="small"
            class="ptable-select-entity__button el-button--icon margin-right--2"
            @click="selectEntity(scope.row.accountNumber)"
          >
            <PIcon>
              <PIArrowRepeat />
            </PIcon>
          </PButton>
          <PButton
            data-ut="deploy-button"
            type="primary"
            size="small"
            :plain="false"
            :round="false"
            :disabled="false"
            :loading="false"
            @click="drawerHandler"
          >
            <PIcon class="el-button__icon--left">
              <PIAdd />
            </PIcon>
            {{ t('deployBtn') }}
          </PButton>
        </template>
      </PTableColumn>
    </PTable>
    <OffersDrawer
      data-ut="offers-drawer"
      v-if="openOffersDrawer"
      v-model="openOffersDrawer"
      :subscriptionOffers="subscriptionOffers"
    />
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'My accounts'
    label: 'Legal name'
    account: 'Account ID'
    deployBtn: 'Deploy this folder'
  fr-FR:
    title: 'Mes dossiers'
    label: 'Raison sociale'
    account: 'ID Dossier'
    deployBtn: 'Deployer ce dossier'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PIAdd,
  PButton,
  PEntity,
  PIcon,
  PIArrowRepeat,
  PIBuilding,
  PICheck,
  PIPeople,
  PTable,
  PTableColumn,
  PText
} from '@kpmg/styleguide'
import { computed, onMounted, ref } from 'vue'
import { useEntityStore } from '@/stores/entity-store'
import OffersDrawer from '@/pages/entities/components/OffersDrawer'
import type {
  SubscriptionOffer
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import { getAllOffers } from '@/services/offer'
import { commonStore } from '@kpmg/common'
import { storeToRefs } from 'pinia'

const tableInputs = ref({
  striped: true,
  sortable: true,
  selectable: false
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const titleString = computed(() => {
  return t('title')
})

const labelString = computed(() => {
  return t('label')
})

const accountString = computed(() => {
  return t('account')
})

const userStore = commonStore()

const ibsSelected = ref('')

const entityStore = useEntityStore()
const { getEntities } = entityStore
const { entities } = storeToRefs(entityStore)

function selectEntity(accountNumber:string) {
  ibsSelected.value = accountNumber
  const entity = entities.value.find((el:any) => el.accountNumber === accountNumber)
  const newActiveEntity = [{
    name: entity.name,
    idAccount: entity.accountNumber,
    icon: 'PICupHot',
    color: 'orange'
  }]

  userStore.$patch({
    user: {
      activeEntity: newActiveEntity
    }
  })

  localStorage.setItem('defaultEntity', JSON.stringify(newActiveEntity))
}

const tableRowClassName = ({ row }: any) => {
  const defaultEntity = localStorage.getItem('defaultEntity')

  if (defaultEntity) {
    ibsSelected.value = (JSON.parse(defaultEntity))[0].idAccount

    if (row && row.accountNumber === ibsSelected.value) {
      return 'current-row'
    }
  }
  return ''
}

const openOffersDrawer = ref(false)
const subscriptionOffers = ref<SubscriptionOffer[]>([])

async function drawerHandler() {
  subscriptionOffers.value = await getAllOffers()
  openOffersDrawer.value = true
}

onMounted(async () => {
  await getEntities()
})
</script>

<style lang="scss" scoped>
.ptable-select-entity__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}
</style>
