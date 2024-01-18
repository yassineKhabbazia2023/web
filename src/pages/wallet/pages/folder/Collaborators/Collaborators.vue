<template>
  <PBlockHeader
    :pTitle="t('headerTitle')"
    :pDescription="t('headerSubTitle')"
    pColor="gray"
    pSize="default"
    :pImage="pImageProps"
    pHasButton
  >
  <PButton
    pType="primary"
    pSize="default"
    @click="handleAddCollaborator"
    data-testid="add-collaborator-button"
  >
    <PIcon class="el-button__icon--left">
      <PIAdd/>
    </PIcon>
    {{ t('addCollborator') }}
  </PButton>
</PBlockHeader>
  <PTable
    @current-change="handleChange"
    ref="selectedRow"
    :pData="collabs"
    showOverflowTooltip
    pStripe
    tableLayout="fixed"
    class="collab-table"
  >
    <PTableColumn
      :pLabel="t('collaboratorName')"
      pSortable
    >
      <template #default="scope">
        <div class="flex flex--align-items-center">
        <PAvatar
          class="margin-right--2"
          pColor="persian-gradient"
          pType="small"
        >
          {{ getInitials(scope.row.firstName,scope.row.lastName) }}
        </PAvatar>
        <div>
          <p class="line-height--120">
            <span class="text-capitalize">{{ scope.row.firstName }} &nbsp;</span>
            <span class="text-uppercase"> {{ scope.row.lastName }}</span>
          </p>
        </div>
      </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('collaboratorEmail')"
      pProp="email"
      pSortable
    />
    <PTableColumn
      :pLabel="t('collaboratorFunction')"
      pProp="roleFunction"
      pSortable
    >
      <template #default="scope">
        <p class="text-capitalize">
          {{ scope.row.roleFunction }}
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('collaboratorOffice')"
      pProp="office"
      pSortable
    >
      <template #default="scope">
        <p>
          <span class="text-capitalize"> {{t('collaboratorOffice')}} &nbsp;</span>
          <span class="text-uppercase"> {{ scope.row.office }} </span>
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('collaboratorAccess')"
      pProp="hasAccess"
      pSortable
    >
      <template #default="scope">
        <PSwitch
          v-model="scope.row.hasAccess"
          data-testid="switch"/>
      </template>
    </PTableColumn>
  </PTable>
  </template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PTable,
  PTableColumn,
  PSwitch,
  PBlockHeader,
  PButton,
  PIAdd,
  PIcon
} from '@kpmg/styleguide'
import {
  onMounted,
  ref,
  toRaw
} from 'vue'
import { ElTable } from 'element-plus'
import { commonStore } from '@kpmg/common'
import type { Collab } from './types'
import { type PImageProps } from '@kpmg/styleguide'
import { getCollaboratorsByIdEntity } from '@/services/wallet'
import { storeToRefs } from 'pinia'
import { getInitials } from '@/helper/helper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const userStore = commonStore()
const { user } = storeToRefs(userStore)

const pImageProps = {
  pFit: 'fill',
  pType: 'paupulse',
  pName: 'add-user'
} as PImageProps

const collabs = ref<Collab[]>([])

const currentEntityId = user.value?.entities?.default?.idAccount as string
const selectedRow = ref<InstanceType<typeof ElTable>>()

const emit = defineEmits<{
  'collaboratorAdded': []
  'accessSwitched': [Collab]
}>()

const handleChange = (row: any) => {
  const collab = toRaw(row) as Collab
  if (collab) {
    emit('accessSwitched', collab)
  }
}
const fetchCollaborators = async () => {
  collabs.value = await getCollaboratorsByIdEntity(currentEntityId)
}
onMounted(async () => {
  await fetchCollaborators()
})

const handleAddCollaborator = () => {
  emit('collaboratorAdded')
}
</script>

  <style lang="scss">
  .collab-table {
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
    p{
      color: var(--el-color-neutral-gray-900);
    }
  }
  </style>

  <style lang="scss" scoped>
  .color-gray--900 {
    color: var(--el-color-neutral-gray-900);
  }

  .line-height--120 {
    line-height: 120%;
  }
  </style>

  <i18n lang="yaml">
  en-US:
    headerTitle: 'KPMG Collaborator'
    headerSubTitle: 'List of KPMG collaborators in charge of your file.'
    collaboratorName: 'Collaborator'
    collaboratorEmail: 'E-mail'
    collaboratorFunction: 'Function'
    collaboratorOffice: 'Office'
    collaboratorAccess: 'Folder access'
    addCollborator: 'Add collaborator'
  fr-FR:
    headerTitle: 'Les collaborateurs KPMG'
    headerSubTitle: 'Liste des collaborateurs KPMG en charge de votre dossier.'
    collaboratorName: 'Collaborateur'
    collaboratorEmail: 'E-mail'
    collaboratorFunction: 'Fonction'
    collaboratorOffice: 'Bureau'
    collaboratorAccess: 'Accès dossier'
    addCollborator: 'Ajouter un collaborateur'
  </i18n>
