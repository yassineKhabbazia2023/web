<template>
  <div>
    <PTable
      :pData="props.data"
      highlightCurrentRow
      pStripe
      tableLayout="fixed"
      @sort-change="handleSortChange"
    >
      <PTableColumn
        :pLabel="t('nameOfCollaborator')"
        pProp="lastName"
        pSortable="custom"
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
              <p class="font-semibold text-capitalize">
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
        pSortable="custom"
      />

      <PTableColumn
        :pLabel="t('phoneNumber')"
        pProp="landPhone"
        pSortable="custom"
      />

      <PTableColumn
        :pLabel="t('ibsStatus')"
        pProp="ibsStatus"
        pSortable="custom"
      />

      <PTableColumn
        :pLabel="t('role')"
        pProp="role"
        pSortable="custom"
      />

      <PTableColumn
        :pLabel="t('office')"
        pProp="office"
        pSortable="custom"
      />

      <PTableColumn
        :pLabel="t('options')"
        :pWidth="100"
        pProp="options"
      >
        <template #default="scope">
          <PToolbox
            trigger="click"
            :pElements="menuElements"
            @p-toolbox-item-clicked="$event => handleToolboxItemClick($event, scope.row)"
          >
            <PButton pType="generic">
              <PIcon pName="threeDots" />
            </PButton>
          </PToolbox>
        </template>
      </PTableColumn>
    </PTable>

    <div v-if="state.rowData">
      <CollabDetailsDrawer
        v-if="state.hasDrawerOpened.collabDetails"
        v-model="state.hasDrawerOpened.collabDetails"
        :collabDetails="state.rowData"
        :hasDrawerOpened="state.hasDrawerOpened.collabDetails"
        @update-collaborator-details="handleUpdateCollaborateurDetails"
      />

      <CollabRightsDrawer
        v-if="state.hasDrawerOpened.collabRole"
        v-model="state.hasDrawerOpened.collabRole"
        :rowData="state.rowData"
        :hasDrawerOpened="state.hasDrawerOpened.collabRole"
        @update-collaborator-role="handleUpdateCollaborateurRole"
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
  PTable,
  PTableColumn,
  PToolbox,
} from '@pulse/styleguide/components'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { reactive, computed } from 'vue'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import CollabDetailsDrawer from '@entities/common/components/CollabDetailsDrawer'
import CollabRightsDrawer from './../CollabRightsDrawer'
import type { Contact } from '@entities/services/contact/contactTypes'
import { returnSortQueryField } from '@entities/helper'
import { userPermissions } from '@pulse/common'
import { PERMISSION_CODES } from '@entities/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update-collaborator-details': [Contact]
  'update-collaborator-role': [Contact]
  'on-sort-change': [string]
}>()
const props = defineProps<Props>()
const { hasPermission } = userPermissions()

const { collaboratorInformation, manageAccessRights } = MENU_ACTIONS_NAME
const menuElements = computed<PToolboxItemProps[]>(() =>
  [
    {
      pIconName: 'PIPerson',
      pValue: t('collaboratorInformation'),
      pActionName: collaboratorInformation,
      pState: 'default',
      display: true,
    },
    {
      pIconName: 'PIClipboardData',
      pValue: t('detailsOfDelegations'),
      pActionName: 'detailsOfDelegations',
      pState: 'default',
      display: false,
    },
    {
      pIconName: 'PIGrid',
      pValue: t('manageAccessRights'),
      pActionName: manageAccessRights,
      pState: 'default',
      display: hasPermission(PERMISSION_CODES.MODIFY_RIGHTS_COLLAB),
    },
  ]
    .filter(({ display }) => display)
    .map(({ pIconName, pValue, pActionName, pState }) => ({
      pIconName,
      pValue,
      pActionName,
      pState,
    })) as PToolboxItemProps[],
)

const state = reactive({
  hasDrawerOpened: {
    collabDetails: false,
    collabRole: false,
  },
  rowData: undefined,
})

const handleUpdateCollaborateurDetails = (contact: Contact) => {
  emit('update-collaborator-details', contact)
}
const handleUpdateCollaborateurRole = (contact: Contact) => {
  emit('update-collaborator-role', contact)
}
const handleToolboxItemClick = (action: string, row: any) => {
  state.rowData = row
  if (action === collaboratorInformation) {
    state.hasDrawerOpened.collabDetails = true
  }
  if (action === manageAccessRights) {
    state.hasDrawerOpened.collabRole = true
  }
}

const handleSortChange = (data: any) => {
  const columnLabel = data.prop
  const order = data.order
  const sortQueryField = returnSortQueryField(columnLabel, order)
  emit('on-sort-change', sortQueryField)
}
</script>

<i18n lang="yaml">
en-US:
  nameOfCollaborator: 'Name of collaborator'
  email: 'Email'
  phoneNumber: 'Phone number'
  ibsStatus: 'IBS Status'
  role: 'Role'
  office: 'Office'
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
  options: 'Options'
  collaboratorInformation: 'Informations du collaborateur'
  detailsOfDelegations: 'Détails des délégations'
  manageAccessRights: "Gérer les droits d’accès"
</i18n>
