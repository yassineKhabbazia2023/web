<template>
<div>
  <PTable
    :pData="props.data"
    highlightCurrentRow
    showOverflowTooltip
    pStripe
    tableLayout="fixed"
  >
    <PTableColumn
      :pLabel="t('nameOfCollaborator')"
      pProp="lastName"
      pSortable
    >
      <template #default="scope">
        <div class="flex flex--align-items-center">
          <PAvatar
            class="margin-right--2"
            pColor="persian-gradient"
            pType="xsmall"
          >
            {{ scope.row.initials }}
          </PAvatar>
          <div>
            <p class="line-height--120 font-semibold text-capitalize">
              {{ scope.row.firstName }}
              <span class="text-uppercase"> {{ scope.row.lastName }}</span>
            </p>
          </div>
        </div>
      </template>
    </PTableColumn>

    <PTableColumn
      :pLabel="t('email')"
      pProp="email"
      pSortable
    />

    <PTableColumn
      :pLabel="t('phoneNumber')"
      pProp="landPhone"
      pSortable
    />

    <PTableColumn
      :pLabel="t('ibsStatus')"
      pProp="ibsStatus"
      pSortable
    />

    <PTableColumn
      :pLabel="t('role')"
      pProp="role"
      pSortable
    />

    <PTableColumn
      :pLabel="t('office')"
      pProp="office"
      pSortable
    />

    <PTableColumn
      :pLabel="t('access')"
      pProp="access"
      pSortable
    >
      <template #default="scope">
        <PSwitch
          :modelValue="accessState[scope.row.id]"
          @update:model-value="(val) => accessState[scope.row.id] = val"
        />
      </template>
    </PTableColumn>

    <PTableColumn
      :pLabel="t('options')"
      :pWidth="100"
      pProp="options"
    >
      <template #default="scope">
        <PToolbox
          @p-toolbox-item-clicked="$event => handleToolboxItemClick($event, scope.row)"
          trigger="click"
          :pElements="menuElements"
        >
          <PButton
            pType="generic"
            pSize="small"
            class="margin-left--1"
          >
            <PIcon>
              <PIThreeDots />
            </PIcon>
          </PButton>
        </PToolbox>
      </template>
    </PTableColumn>
  </PTable>

  <div v-if="state.rowData">
    <DrawerCollabDetails
      v-if="state.hasDrawerOpened.collabDetails"
      v-model="state.hasDrawerOpened.collabDetails"
      :rowData="state.rowData"
      :hasDrawerOpened="state.hasDrawerOpened.collabDetails"
    />

    <DrawerCollabRole
      v-if="state.hasDrawerOpened.collabRole"
      v-model="state.hasDrawerOpened.collabRole"
      :rowData="state.rowData"
      :hasDrawerOpened="state.hasDrawerOpened.collabRole"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PIThreeDots,
  PSwitch,
  PTable,
  PTableColumn,
  PToolbox
} from '@kpmg/styleguide'
import type { PToolboxItemProps } from '@kpmg/styleguide'
import { reactive } from 'vue'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import DrawerCollabDetails from './../DrawerCollabDetails'
import DrawerCollabRole from './../DrawerCollabRole'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<Props>()

const access = props.data.map(({ id, hasAccess }: { id: string, hasAccess: boolean }) => ({
  [id]: hasAccess
}))
const accessState = reactive(Object.assign({}, ...access))

const { collaboratorInformation, manageAccessRights } = MENU_ACTIONS_NAME
const menuElements : PToolboxItemProps[] = [
  {
    pIconName: 'PIPerson',
    pValue: t('collaboratorInformation'),
    pActionName: collaboratorInformation,
    pState: 'default'
  },
  {
    pIconName: 'PIClipboardData',
    pValue: t('detailsOfDelegations'),
    pActionName: 'detailsOfDelegations',
    pState: 'default'
  },
  {
    pIconName: 'PIGrid',
    pValue: t('manageAccessRights'),
    pActionName: manageAccessRights,
    pState: 'default'
  }
]

const state = reactive({
  hasDrawerOpened: {
    collabDetails: false,
    collabRole: false
  },
  rowData: undefined
})

const handleToolboxItemClick = (action: string, row: any) => {
  state.rowData = row
  if (action === collaboratorInformation) {
    state.hasDrawerOpened.collabDetails = true
  }
  if (action === manageAccessRights) {
    state.hasDrawerOpened.collabRole = true
  }
}
</script>

<style lang="scss" scoped>
.line-height--120 {
  line-height: 120%;
}
</style>

<i18n lang="yaml">
en-US:
  nameOfCollaborator: 'Name of collaborator'
  email: 'Email'
  phoneNumber: 'Phone number'
  ibsStatus: 'IBS Status'
  role: 'Role'
  office: 'Office'
  access: 'Access'
  options: 'Options'
  collaboratorInformation: 'Collaborator information'
  detailsOfDelegations: 'Details of delegations'
  manageAccessRights: 'Manage access rights'
fr-FR:
  nameOfCollaborator: 'Nom du collaborateur'
  email: 'Mail'
  phoneNumber: 'Téléphone'
  ibsStatus: 'Status IBS'
  role: 'Rôle'
  office: 'Bureau'
  access: 'Accès'
  options: 'Options'
  collaboratorInformation: 'Informations du collaborateur'
  detailsOfDelegations: 'Détails des délégations'
  manageAccessRights: "Gérer les droits d’accès"
</i18n>
