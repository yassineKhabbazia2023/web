<template>
  <PTable
    ref="selectedRow"
    :pData="props.data"
    :highlightCurrentRow="!isAccountManagement"
    showOverflowTooltip
    :rowClassName="!isAccountManagement ? 'cursor-pointer' : ''"
    pStripe
    tableLayout="fixed"
    class="wallet-table"
  >
    <PTableColumn
      v-if="!isAccountManagement"
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
      pProp="name"
      pSortable
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
            @click="onToolboxItemClicked('access', scope.row)"
          >
            {{ scope.row.name }}
          </a>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('customerCode')"
      pProp="accountNumber"
      pSortable
    />
    <PTableColumn
      :pLabel="t('leader')"
      pProp="owner.lastName"
      pSortable
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
      pProp="owner.email"
      pSortable
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
      pSortable
    >
      <template #default="scope">
        <p class="text-capitalize overflow-hidden text-overflow--ellipsis">
          {{ scope.row.city }}
        </p>
      </template>
    </PTableColumn>
    <template v-if="isCollab">
      <PTableColumn
        :pLabel="t('status')"
        pProp="deploymentStatus.text"
        pSortable
      >
        <template #default="scope">
          <PTag
            :pContent="scope.row.deploymentStatus.text"
            :pColor="scope.row.deploymentStatus.color"
            :pIconLeftName="scope.row.deploymentStatus.iconName"
            pEffect="light"
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
            @p-toolbox-item-clicked="$event => onToolboxItemClicked($event, scope.row)"
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
        v-if="!isAccountManagement"
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
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PAvatar,
  PButton,
  PIcon,
  PTag,
  PTable,
  PTableColumn,
  PToolbox,
  PCheckbox,
} from '@pulse/styleguide/components'
import {
  onMounted,
  ref,
  toRaw,
  watch,
  computed,
} from 'vue'
import type { ElTable } from 'element-plus'
import { storeToRefs } from 'pinia'
import type { Entity } from '@pulse/common/types'
import type { TableDataProps } from './types'
import { AvatarRoles } from '@pulse/styleguide'
import type { AccessibleMenuItem, AccountRow } from '@entities/common/types'
import { filterAccessibleMenuItems } from '@entities/common/utils'
import type { SelectedFolder } from '../../pages/folders/components/DelegationDrawer/DelegationDrawerTypes'
import { PERMISSION_CODES } from '@entities/constants'
import { useSelectedEntityStore, useUserStore } from '@pulse/common/stores'
import { SelectedEntityManager, CurrentUserManager } from '@pulse/common/managers'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = withDefaults(defineProps<TableDataProps>(), {
  data: [],
  isAccountManagement: false,
})

const callHandleAddFavorite = (accountId: number, isFavorite: boolean) => {
  if (props.handleAddFavorite) {
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
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.ACTIVATE_OFFER),
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
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.MODIFY_ACCOUNT_RIGHTS),
  },
  {
    pIconName: 'send',
    pValue: t('resendActivationEmail'),
    pActionName: 'retryMassActivationEmail',
    pState: 'default',
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.ACCOUNT_MANAGEMENT),
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

const selectedEntityStore = useSelectedEntityStore()
const { selectedEntity } = storeToRefs(selectedEntityStore)

const userStore = useUserStore()
const { isCollab } = storeToRefs(userStore)

const selectedRow = ref<InstanceType<typeof ElTable>>()

const emit = defineEmits<{
  'click-deploy': [number, string, string]
  access: [string]
  selectedFolder: [SelectedFolder]
  displayAccountRightsDrawer: [AccountRow]
  displayResendActivationEmailDrawer: [AccountRow]
}>()

const isToolboxDisabled = computed(() => {
  return props.isAccountManagement && accountManagementMenu.length === 0
})

const handleRowSelectedChange = (row: any) => {
  const rowValues = toRaw(row)
  if (rowValues) {
    const { name, accountId, accountNumber }: AccountRow = rowValues

    const selectedEntity: Entity = {
      legalName: name,
      accountId,
      color: 'persian', // color is temporarily hard-coded
      accountNumber,
    }

    SelectedEntityManager.defineSelectedEntity(selectedEntity)
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
})

watch(() => props.data, () => {
  const rowToSelect = props.data
    .find(({ accountId }: AccountRow) => accountId === selectedEntity.value?.accountId)
  selectRowWhenTableFullyLoaded(rowToSelect)
})

const onToolboxItemClicked = (action: string, row: any) => {
  const { accountId, name, accountNumber } = row

  if (action === 'deploy') {
    emit('click-deploy', accountId ?? 5, accountNumber, name)
  } else if (action === 'access') {
    handleRowSelectedChange(row)
    emit('access', accountId)
  } else if (action === 'manageAccountRights') {
    emit('displayAccountRightsDrawer', { accountId, name, accountNumber })
  } else if (action === 'retryMassActivationEmail') {
    emit('displayResendActivationEmailDrawer', { accountId, name, accountNumber })
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
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.wallet-table {
  .current-row > td:first-child {
    border-color: var(--el-color-base-persian) !important;
  }
}
</style>

<i18n lang="yaml">
en-US:
  companyName: 'Company name'
  customerCode: 'Customer code'
  leader: 'Leader'
  city: 'City'
  email: 'Email'
  status: 'Status'
  option: 'Options'
  deployThisFolder: 'Deploy this folder'
  accessThisFolder: 'Access this folder'
  resendActivationEmail: 'Resend activation email'
  toDeploy: 'To Deploy'
  manageAccountRights: 'Manage folder permissions'
fr-FR:
  companyName: 'Raison sociale'
  customerCode: 'Code client'
  leader: 'Dirigeant'
  city: 'Ville'
  email: 'E-mail'
  status: 'Statut'
  option: 'Actions'
  deployThisFolder: 'Déployer ce dossier'
  accessThisFolder: 'Accéder au dossier'
  resendActivationEmail: "Relancer le mail d'activation"
  toDeploy: 'A déployer'
  manageAccountRights: 'Gérer les droits du dossier'
</i18n>
