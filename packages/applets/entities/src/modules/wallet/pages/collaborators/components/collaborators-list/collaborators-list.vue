<template>
  <div>
    <PTable
      :pData="props.data"
      highlightCurrentRow
      pStripe
      tableLayout="fixed"
      data-testid="collaborators-table"
      @sort-change="handleSortChange"
    >
      <PTableColumn
        :pLabel="t('collaborators')"
        pProp="lastName"
        pSortable="custom"
        :pSortOrders="SORT_ORDERS"
      >
        <template #default="scope">
          <div class="flex flex--align-items-center">
            <PAvatar
              class="margin-right--2"
              :pRole="AvatarRoles.COLLAB"
              pType="xsmall"
            >
              {{ scope.row.initials }}
            </PAvatar>
            <div>
              <p class="text-capitalize">
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
        :pSortOrders="SORT_ORDERS"
      />

      <PTableColumn
        :pLabel="t('phoneNumber')"
        pProp="landPhone"
      />

      <PTableColumn
        :pLabel="t('crmRole')"
        pProp="ibsStatus"
      />

      <PTableColumn
        :pLabel="t('role')"
        pProp="role"
        pSortable="custom"
        :pSortOrders="SORT_ORDERS"
      />

      <PTableColumn
        :pLabel="t('office')"
        pProp="office"
        pSortable="custom"
        :pSortOrders="SORT_ORDERS"
      />

      <PTableColumn
        :pLabel="t('actions')"
        :pWidth="100"
        pProp="options"
      >
        <template #default="scope">
          <PToolbox
            trigger="click"
            :pElements="menuElements"
            @p-toolbox-item-clicked="($event: string) => handleToolboxItemClick($event, scope.row)"
          >
            <PButton>
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
import { AvatarRoles } from '@pulse/styleguide'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { reactive, computed } from 'vue'
import type { Props } from './types'
import { MENU_ACTIONS_NAME } from './constants'
import CollabDetailsDrawer from '@entities/components/CollabDetailsDrawer'
import CollabRightsDrawer from './../CollabRightsDrawer'
import type { Contact } from '@entities/services/contact/contactTypes'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACTION_PERMISSIONS, SORT_ORDERS } from '@pulse/common/constants'
import { SortingCriteria } from '@pulse/common/types'
import { SortDirection } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      collaborators: 'Collaborators',
      email: 'E-mail',
      phoneNumber: 'Phone number',
      crmRole: 'CRM Role',
      role: 'Role',
      office: 'Office',
      actions: 'Actions',
      collaboratorInformation: 'Collaborator information',
      detailsOfDelegations: 'Details of delegations',
      manageAccessRights: 'Manage access rights',
    },
    'fr-FR': {
      collaborators: 'Collaborateurs',
      email: 'E-mail',
      phoneNumber: 'Téléphone',
      crmRole: 'Fonction CRM',
      role: 'Rôle',
      office: 'Bureau',
      actions: 'Actions',
      collaboratorInformation: 'Informations du collaborateur',
      detailsOfDelegations: 'Détails des délégations',
      manageAccessRights: 'Gérer les droits d’accès',
    },
  },
})

const emit = defineEmits<{
  'update-collaborator-details': [Contact]
  'update-collaborator-role': [Contact]
  'on-sort-change': [SortingCriteria]
}>()
const props = defineProps<Props>()

const { collaboratorInformation, manageAccessRights } = MENU_ACTIONS_NAME
const menuElements = computed<PToolboxItemProps[]>(() =>
  [
    {
      pIconName: 'person',
      pValue: t('collaboratorInformation'),
      pActionName: collaboratorInformation,
      pState: 'default',
      display: true,
    },
    {
      pIconName: 'clipboardData',
      pValue: t('detailsOfDelegations'),
      pActionName: 'detailsOfDelegations',
      pState: 'default',
      display: false,
    },
    {
      pIconName: 'grid',
      pValue: t('manageAccessRights'),
      pActionName: manageAccessRights,
      pState: 'default',
      display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MODIFY_RIGHTS_COLLAB),
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
  const sortCriteria: SortingCriteria = {
    field: data.prop,
    descending: data.order === SortDirection.DESCENDING,
  }
  emit('on-sort-change', sortCriteria)
}
</script>

