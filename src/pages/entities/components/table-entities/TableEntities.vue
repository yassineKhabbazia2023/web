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
              :content="scope.row.name"
              :icon="PIBuilding"
              type="primary"
              :selected="false"
              :bold="scope.row.accountNumber === ibsSelected"
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
              :content="scope.row.accountNumber"
              :icon="PIPeople"
              :bold="scope.row.accountNumber === ibsSelected"
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
            <span v-if="scope.row.accountNumber === ibsSelected">
              <PIcon
                color="#5546FF"
                size="20px">
                <PICheck data-test= "icon-check"/>
              </PIcon>
            </span>
            <span
              class="pTable-select-entity"
              @click="selectEntity(scope.row.accountNumber)"
              v-else>
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
import { useEntityStore } from '@/stores/entity-store'
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

function setDefaultEntity() {
  const defaultEntity = localStorage.getItem('defaultEntity')
  if (defaultEntity !== null) {
    ibsSelected.value = (JSON.parse(defaultEntity))[0].idAccount
  }
}

onMounted(async () => {
  await getEntities()
  setDefaultEntity()
})
</script>

