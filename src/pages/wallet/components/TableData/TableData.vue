<template>
<PTable
  @current-change="handleRowSelectedChange"
  ref="selectedRow"
  :pData="props.data"
  highlightCurrentRow
  showOverflowTooltip
  pStripe
  tableLayout="fixed"
  class="wallet-table"
>
  <PTableColumn
    :label="t('companyName')"
    prop="name"
    sortable
  >
    <template #default="scope">
      <div class="flex valign-center">
        <PAvatar pColor="persian">
          <PIcon>
            <PIPulse />
          </PIcon>
        </PAvatar>
        <p class="font-semibold margin-left--2">
          {{ scope.row.name }}
        </p>
      </div>
    </template>
  </PTableColumn>
  <PTableColumn
    :label="t('folderID')"
    prop="accountNumber"
    sortable
  />
  <PTableColumn
    :label="t('leader')"
    prop="owner.lastName"
    sortable
  >
    <template #default="scope">
      <div class="flex valign-center">
        <PAvatar
          v-if="scope.row.owner.initials"
          class="margin-right--2"
          pColor="white"
          pType="small"
        >
          {{ scope.row.owner.initials }}
        </PAvatar>
        <div>
          <p class="capitalize line-height--120">
            {{ scope.row.owner.firstName }}
            <span class="uppercase"> {{ scope.row.owner.lastName }}</span>
          </p>
          <p
            v-if="scope.row.owner.email"
            class="
              font-small
              color-gray--500
              line-height--120
              margin-top--2
            "
          >
            {{ scope.row.owner.email }}
          </p>
        </div>
      </div>
    </template>
  </PTableColumn>
  <PTableColumn
    :label="t('city')"
    prop="city"
    sortable
  >
    <template #default="scope">
      <p class="capitalize">
        {{ scope.row.city }}
      </p>
    </template>
  </PTableColumn>
  <PTableColumn
    :label="t('status')"
    prop="deploymentStatus.text"
    sortable
  >
    <template #default="scope">
      <PTag
        :pContent="scope.row.deploymentStatus.text"
        :pColor="scope.row.deploymentStatus.color"
        :pIconLeft="scope.row.deploymentStatus.icon"
        pEffect="light"
      />
    </template>
  </PTableColumn>
  <PTableColumn
    :label="t('action')"
    :width="100"
    prop="isFavorite"
    sortable
  >
    <template #default="scope">
      <PButton
        v-if="scope.row.isFavorite"
        @click.stop="handleAddFavorite(scope.row.id, !scope.row.isFavorite)"
        pType="white"
        pSize="small"
      >
        <PIcon>
          <PIStarFill />
        </PIcon>
      </PButton>
      <PButton
        v-if="!scope.row.isFavorite"
        @click.stop="handleAddFavorite(scope.row.id, !scope.row.isFavorite)"
        pType="white"
        pSize="small"
      >
        <PIcon>
          <PIStar />
        </PIcon>
      </PButton>
      <PToolbox
        trigger="click"
        :pElements="[{
          pIconName: 'PIArrowUpCircle',
          pValue: t('deployThisFolder'),
          pActionName: 'deploy',
          pState: 'default'
        }]"
      >
        <PButton
          pType="white"
          pSize="small"
          class="margin-left--1"
        >
          <PIcon>
            <PIThreeDots color="#A4A4A4" />
          </PIcon>
        </PButton>
      </PToolbox>
    </template>
  </PTableColumn>
</PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PIPulse,
  PIStar,
  PIStarFill,
  PIThreeDots,
  PTag,
  PTable,
  PTableColumn,
  PToolbox
} from '@kpmg/styleguide'
import {
  onMounted,
  ref,
  toRaw,
  watch
} from 'vue'
import { ElTable } from 'element-plus'
import { storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import type { Props, Row } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = withDefaults(defineProps<Props>(), {
  data: [],
  handleAddFavorite: () => {}
})

const userStore = commonStore()
const { user } = storeToRefs(userStore)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const handleRowSelectedChange = (row: any) => {
  const rowValues = toRaw(row)
  if (rowValues) {
    const { name, id }: Row = rowValues
    const defaultEntity = {
      name,
      idAccount: id
    }

    userStore.$patch({
      user: {
        entities: {
          default: defaultEntity
        }
      }
    })
  }
}

const selectRowWhenTableFullyLoaded = (row: any) => {
  setTimeout(() => {
    const tableInstance =
      selectedRow.value?.$refs.table as InstanceType<typeof ElTable>
    tableInstance?.setCurrentRow(row)
  }, 250)
}

onMounted(() => {
  const firstRow = props.data[0]
  selectRowWhenTableFullyLoaded(firstRow)
  handleRowSelectedChange(firstRow)
})

watch(() => props.data, () => {
  const rowToSelect = props.data
    .find(({ id }: Row) => id === user.value?.entities.default?.idAccount)
  selectRowWhenTableFullyLoaded(rowToSelect)
})
</script>

<style lang="scss">
.wallet-table {
  .cell {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
  }

  .el-table__body {
    .el-table__cell {
      height: 65px;

      &:nth-of-type(-n+5) {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .current-row > td:first-child {
    border-left: 4px solid var(--el-color-base-persian);

    .cell {
      padding-left: 0.8rem;
    }
  }
}
</style>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.valign-center {
  align-items: center;
}

.capitalize {
  &::first-letter {
    text-transform: capitalize;
  }
}

.uppercase {
  text-transform: uppercase;
}

.color-gray--500 {
  color: var(--el-color-neutral-gray-500);
}

.line-height--120 {
  line-height: 120%;
}
</style>

<i18n lang="yaml">
en-US:
  companyName: 'Company name'
  folderID: 'Folder ID'
  leader: 'Leader'
  city: 'City'
  status: 'Status'
  action: 'Action'
  deployThisFolder: 'Deploy this folder'
fr-FR:
  companyName: 'Nom de la société'
  folderID: 'ID Dossier'
  leader: 'Dirigeant'
  city: 'Ville'
  status: 'Statut'
  action: 'Action'
  deployThisFolder: 'Déployer ce dossier'
</i18n>
