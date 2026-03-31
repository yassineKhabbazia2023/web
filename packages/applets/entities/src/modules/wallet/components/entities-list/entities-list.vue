<template>
  <PResponsiveTable
    ref="selectedRow"
    :pData="props.data"
    :pDisableResponsive="isCollab"
    pRowKey="accountId"
    :highlightCurrentRow="isAccountManagement === false"
    showOverflowTooltip
    :rowClassName="isAccountManagement === false ? 'cursor-pointer' : ''"
    pStripe
    tableLayout="fixed"
    class="wallet-table"
    :pCardClickable="isAccountManagement === false"
    :pIsRowSelected="isRowSelected"
    @sort-change="handleSort"
    @row-click="onRowClick"
  >
    <PTableColumn
      v-if="isAccountManagement === false"
      pProp="isFavorite"
      :pWidth="54"
      :pShowOverflowTooltip="false"
      data
    >
      <template #default="scope">
        <PButton
          pSize="small"
          pIconOnly
          :data-testid="scope.row.isFavorite ? 'wallet-add-favorite' : 'wallet-remove-favorite'"
          @click.stop="callHandleAddFavorite(scope.row.accountId, !scope.row.isFavorite)"
        >
          <PIcon
            :pName="scope.row.isFavorite ? 'starFill' : 'star'"
          />
        </PButton>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('companyName')"
      pProp="companyName"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
      pMinWidth="120px"
    >
      <template #default="scope">
        <div class="flex flex--align-items-center overflow-hidden">
          <PAvatar
            :pColor="scope.row.owner.avatarColor"
            pType="xsmall"
          >
            <PIcon pName="pulse" />
          </PAvatar>
          <a
            class="
              font-semibold
              margin-left--2
              link
              text-color--base-blue-pulse
              overflow-hidden
              text-overflow--ellipsis
            "
            data-testid="account-access-link"
            @click="onDirectFolderAccess(scope.row.accountId)"
          >
            {{ scope.row.name }}
          </a>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('customerCode')"
      pProp="customerCode"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <p class="overflow-hidden text-overflow--ellipsis">
          {{ scope.row.accountNumber }}
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('leader')"
      pProp="leader"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <div class="flex flex--align-items-center overflow-hidden">
          <PAvatar
            v-if="scope.row.owner.initials"
            class="margin-right--2"
            :pRole="AvatarRoles.CLIENT"
            pType="xsmall"
          >
            {{ scope.row.owner.initials }}
          </PAvatar>
          <div class="overflow-hidden text-overflow--ellipsis">
            <p class="text-capitalize overflow-hidden text-overflow--ellipsis">
              {{ scope.row.owner.firstName }}
              <span class="text-uppercase"> {{ scope.row.owner.lastName }}</span>
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
    >
      <template #default="scope">
        <p class="overflow-hidden text-overflow--ellipsis">
          {{ scope.row.owner.email }}
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('city')"
      pProp="city"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <p class="text-capitalize overflow-hidden text-overflow--ellipsis">
          {{ scope.row.city }}
        </p>
      </template>
    </PTableColumn>
    <template v-if="isCollab === true">
      <PTableColumn
        :pLabel="t('status')"
        pProp="status"
      >
        <template #default="scope">
          <PTag
            :pContent="scope.row.deploymentStatus.text"
            :pColor="scope.row.deploymentStatus.color"
            :pIconLeftName="scope.row.deploymentStatus.iconName"
          />
        </template>
      </PTableColumn>
      <PTableColumn
        :pLabel="t('option')"
        :pWidth="80"
        pAlign="center"
      >
        <template #default="scope">
          <PToolbox
            trigger="click"
            :disabled="isToolboxDisabled"
            :pElements="menuElementsCollaborator(scope.row.deploymentStatus.text)"
            data-testid="wallet-actions-toolbox"
            @visible-change="onToolboxVisibleChange"
            @p-toolbox-item-clicked="($event: string) => onToolboxItemClicked($event, scope.row)"
          >
            <PButton
              pSize="small"
              pIconOnly
            >
              <PIcon pName="threeDots" />
            </PButton>
          </PToolbox>
        </template>
      </PTableColumn>
      <PTableColumn
        v-if="isAccountManagement === false"
        pWidth="46"
        :pShowOverflowTooltip="false"
      >
        <template #default="scope">
          <PCheckbox
            :disabled="false"
            @change="onSelectedFolder(scope.row)"
          />
        </template>
      </PTableColumn>
    </template>

    <!-- Mobile card -->
    <template #mobile-title="{ row }">
      <div class="flex flex--align-items-center overflow-hidden">
        <PAvatar
          :pColor="row.owner.avatarColor"
          class="margin-right--4"
        >
          <PIcon pName="pulse" />
        </PAvatar>
        <div class="overflow-hidden">
          <p
            class="
              font-semibold
              overflow-hidden
              text-overflow--ellipsis
            "
          >
            {{ row.name }}
          </p>
          <p class="text-color--gray-500 font-small overflow-hidden text-overflow--ellipsis">
            {{ row.accountNumber }}
          </p>
        </div>
      </div>
    </template>

    <!-- Mobile card actions slot -->
    <template
      v-if="isAccountManagement === false"
      #mobile-actions="{ row }"
    >
      <PButton
        pSize="small"
        pIconOnly
        :data-testid="row.isFavorite ? 'wallet-add-favorite' : 'wallet-remove-favorite'"
        @click.stop="callHandleAddFavorite(row.accountId, !row.isFavorite)"
      >
        <PIcon :pName="row.isFavorite ? 'starFill' : 'star'" />
      </PButton>
    </template>
  </PResponsiveTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PTag,
  PTableColumn,
  PToolbox,
  PCheckbox,
  PResponsiveTable,
} from '@pulse/styleguide/components'
import {
  onMounted,
  ref,
  watch,
  computed,
} from 'vue'
import type { ElTable } from 'element-plus'
import { storeToRefs } from 'pinia'
import type { EntitiesListProps } from './types'
import { AvatarRoles, useResponsive } from '@pulse/styleguide'
import type { AccessibleMenuItem, AccountRow } from '@entities/types'
import type { SortChangeEventData, SortingCriteria } from '@pulse/common/types'
import { filterAccessibleMenuItems } from '@entities/utils'
import type { SelectedFolder } from '../../pages/folders/components/DelegationDrawer/DelegationDrawerTypes'
import { ACTION_PERMISSIONS, GLOBAL_PERMISSIONS, SORT_ORDERS } from '@pulse/common/constants'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { SortDirection, AmplitudeFeatureLocalisation } from '@pulse/common/enums'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import { WalletMenuActionValue } from '@entities/managers/wallet-tracking/wallet-tracking.enum'
import { TrackingCenter } from '@pulse/common/services/amplitude'
import { SORT_COLUMN_TRACKING_MAP, MENU_ACTION_TRACKING_MAP } from './entities-list.const'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { containsIgnoreCase } from '@pulse/toolbox/utils/string'


const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      companyName: 'Company name',
      customerCode: 'Customer code',
      leader: 'Leader',
      city: 'City',
      email: 'Email',
      status: 'Status',
      option: 'Options',
      deployThisFolder: 'Deploy this folder',
      accessThisFolder: 'Access this folder',
      resendActivationEmail: 'Resend activation email',
      toDeploy: 'To Deploy',
      manageAccountRights: 'Manage folder permissions',
      declareCustomerRelation: 'Declare customer relationship',
    },
    'fr-FR': {
      companyName: 'Raison sociale',
      customerCode: 'Code client',
      leader: 'Dirigeant',
      city: 'Ville',
      email: 'E-mail',
      status: 'Statut',
      option: 'Actions',
      deployThisFolder: 'Déployer ce dossier',
      accessThisFolder: 'Accéder au dossier',
      resendActivationEmail: 'Relancer le mail d\'activation',
      toDeploy: 'A déployer',
      manageAccountRights: 'Gérer les droits du dossier',
      declareCustomerRelation: 'Se déclarer en relation client',
    },
  },
})

const { isMobile } = useResponsive()

const props = withDefaults(defineProps<EntitiesListProps>(), {
  data: [],
  isAccountManagement: false,
  searchValue: '',
})

const callHandleAddFavorite = (accountId: number, isFavorite: boolean) => {
  if (props.handleAddFavorite) {
    WalletTrackingManager.trackFavoriteRequest(isFavorite)
    props.handleAddFavorite(accountId, isFavorite)
  }
}

const defaultMenuElements : AccessibleMenuItem[] = [
  {
    pIconName: 'folder',
    pValue: t('accessThisFolder'),
    pActionName: 'access',
    pState: 'default',
    display: true,
  },
  {
    pIconName: 'send',
    pValue: t('resendActivationEmail'),
    pActionName: 'retryMassActivationEmail',
    pState: 'default',
    display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ACTIVATE_OFFER),
  },
  {
    pIconName: 'personCheck',
    pValue: t('declareCustomerRelation'),
    pActionName: 'declareCustomerRelation',
    pState: 'default',
    display: true,
  },
]

const menuToDeployElements : AccessibleMenuItem[] = [
  {
    pIconName: 'arrowUpCircle',
    pValue: t('deployThisFolder'),
    pActionName: 'deploy',
    pState: 'default',
    display: true,
  },
  ...defaultMenuElements,
]

const accountManagementMenu : AccessibleMenuItem[] = [
  {
    pIconName: 'grid',
    pValue: t('manageAccountRights'),
    pActionName: 'manageAccountRights',
    pState: 'default',
    display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MODIFY_ACCOUNT_RIGHTS),
  },
  {
    pIconName: 'send',
    pValue: t('resendActivationEmail'),
    pActionName: 'retryMassActivationEmail',
    pState: 'default',
    display: CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.ACCOUNT_MANAGEMENT),
  },
]

const menuElementsCollaborator = (status: string) => {
  if (props.isAccountManagement) {
    return filterAccessibleMenuItems(accountManagementMenu)
  }
  return status === t('toDeploy')
    ? filterAccessibleMenuItems(menuToDeployElements)
    : filterAccessibleMenuItems(defaultMenuElements)
}

const currentEntityStore = useCurrentEntityStore()
const { currentEntity } = storeToRefs(currentEntityStore)

const isRowSelected = (row: Record<string, any>) => {
  return row.accountId === currentEntity.value?.accountId
}

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const emit = defineEmits<{
  'click-deploy': [number, string, string]
  access: [string]
  selectedFolder: [SelectedFolder]
  displayAccountRightsDrawer: [AccountRow]
  displayResendActivationEmailDrawer: [AccountRow]
  displayDeclareCustomerRelationDrawer: [AccountRow]
  'sort-account': [SortingCriteria]
}>()

const handleSort = (data: SortChangeEventData) => {
  const trackingColumn = SORT_COLUMN_TRACKING_MAP[data.prop]
  if (trackingColumn !== undefined) {
    WalletTrackingManager.trackColumnSortRequested(trackingColumn)
  }

  emit('sort-account', {
    field: data.prop,
    descending: data.order === SortDirection.DESCENDING,
  })
}

const isToolboxDisabled = computed(() => {
  return props.isAccountManagement && accountManagementMenu.length === 0
})

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
})

watch(() => props.data, () => {
  const rowToSelect = props.data
    .find(({ accountId }: AccountRow) => accountId === currentEntity.value?.accountId)
  selectRowWhenTableFullyLoaded(rowToSelect)
})

const onToolboxVisibleChange = (isVisible: boolean) => {
  if (isVisible) {
    WalletTrackingManager.trackFolderMenuAction(WalletMenuActionValue.MENU_OPENED)
  }
}

const onDirectFolderAccess = (accountId: string) => {
  TrackingCenter.trackHomepageConsulted(AmplitudeFeatureLocalisation.PORTEFEUILLE)
  emit('access', accountId)
}

const onToolboxItemClicked = (action: string, row: any) => {
  const { accountId, name, accountNumber, isCustomerRelation } = row

  const trackingAction = MENU_ACTION_TRACKING_MAP[action]
  if (trackingAction !== undefined) {
    WalletTrackingManager.trackFolderMenuAction(trackingAction)
  }

  if (action === 'deploy') {
    emit('click-deploy', accountId, accountNumber, name)
  } else if (action === 'access') {
    emit('access', accountId)
  } else if (action === 'manageAccountRights') {
    emit('displayAccountRightsDrawer', { accountId, name, accountNumber })
  } else if (action === 'retryMassActivationEmail') {
    emit('displayResendActivationEmailDrawer', { accountId, name, accountNumber })
  } else if (action === 'declareCustomerRelation') {
    emit('displayDeclareCustomerRelationDrawer', { accountId, name, accountNumber, isCustomerRelation })
  }
}

const onSelectedFolder = (row: any) => {
  emit('selectedFolder', {
    accountNumber: row.accountNumber,
    id: row.accountId,
    name: row.name,
    avatarColor: row.owner?.avatarColor,
  })
}

const onRowClick = (row: any) => {
  if (props.isAccountManagement === false && isMobile.value) {
    emit('access', row.accountId)
  }

  trackWalletSearch(row)
}

const trackWalletSearch = (row: any) => {
  if (isNotNullNorEmpty(props.searchValue)) {
    const search = props.searchValue.trim()
    const matches: string[] = []

    const fieldsToCheck = [
      { value: row.name, label: 'raison sociale' },
      { value: row.accountNumber, label: 'code client' },
      { value: row.owner?.lastName, label: 'nom' },
      { value: row.owner?.firstName, label: 'prenom' },
      { value: row.owner?.email, label: 'email' },
    ]

    fieldsToCheck.forEach(({ value, label }) => {
      if (containsIgnoreCase(value, search)) {
        matches.push(label)
      }
    })

    WalletTrackingManager.trackWalletSearched(props.searchValue, matches)
  }
}
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.wallet-table {
  .current-row > td:first-child {
    border-color: var(--p-jungle-400) !important;
  }
}
</style>

