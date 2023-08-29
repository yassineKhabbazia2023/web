<template>
  <div>
    <h1>{{ titleString }}</h1>
      <PTable
        :data="entities"
        :stripe="tableInputs.striped">
        <PTableColumn
          type="selection"
          v-if="tableInputs.selectable"/>
        <PTableColumn
          :label="labelString"
          width="280"
          :sortable="tableInputs.sortable"
          >
          <template #default="scope">
            <PEntity
              :content="scope.row.AccountName"
              :icon="PIBuilding"
              type="primary"
              :selected="false"
              :bold="scope.row.AccountNumber === ibsSelected"
            >
            </PEntity>
          </template>
        </PTableColumn>
        <PTableColumn
          :label="accountString"
          width="200"
          :sortable="tableInputs.sortable"
          >
          <template #default="scope">
            <PText
              :content="scope.row.AccountNumber"
              :icon="PIPeople"
              :bold="scope.row.AccountNumber === ibsSelected"
              type="primary"
              :disabled="false"
              :selected="false"
            >
           </PText>
          </template>
        </PTableColumn>
        <PTableColumn
          width="80"
          :sortable="false"
          >
          <template #default="scope">
            <span v-if="scope.row.AccountNumber === ibsSelected">
              <PIcon color="#5546FF" size="20px">
                <PICheck />
              </PIcon>
            </span>
            <span @click="ibsSelected = scope.row.AccountNumber" v-else>
              <PIcon color="#5546FF" size="20px">
                <PIArrowRepeat />
              </PIcon>
            </span>
          </template>
        </PTableColumn>
      </PTable>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'My accounts'
    label: 'Legal name'
    account: 'Account ID'
  fr-FR:
    title: 'Mes dossiers'
    label: 'Raison sociale'
    account: 'ID Dossier'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
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
import useTableEntitiesStore from '@/stores/table-entities-store'
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

// eslint-disable-next-line
const token = 'Put a fresh token here !'

const userStore = commonStore()

userStore.$patch({
  user: {
    lastName: 'Msaoubi',
    firstName: 'Kamel',
    token
  }
})

const ibsSelected = ref('')

const tableStore = useTableEntitiesStore()
const { getEntities } = tableStore
const { entities } = storeToRefs(tableStore)

onMounted(async () => {
  await getEntities()
})
</script>
