<template>
  <PResponsiveTable
    :pData="props.data"
    pDisableResponsive
    pRowKey="accountId"
    showOverflowTooltip
    pStripe
    tableLayout="fixed"
    @sort-change="handleSort"
  >
    <PTableColumn
      :pLabel="t(`${I18N_LIST_KEY}.companyName`)"
      pProp="companyName"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
      pMinWidth="120px"
    >
      <template #default="scope">
        <div
          class="
            flex
            flex--align-items-center
            overflow-hidden
          "
        >
          <PEntityAvatar
            :pAccountType="AccountType.REGULAR"
            :pColor="scope.row.owner.avatarColor"
            pType="xsmall"
          />
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
      :pLabel="t(`${I18N_LIST_KEY}.customerCode`)"
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
      :pLabel="t(`${I18N_LIST_KEY}.leader`)"
      pProp="leader"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <div
          class="
            flex
            flex--align-items-center
            overflow-hidden
          "
        >
          <PAvatar
            v-if="scope.row.owner.initials"
            class="margin-right--2"
            :pRole="AvatarRoles.CLIENT"
            pType="xsmall"
          >
            {{ scope.row.owner.initials }}
          </PAvatar>
          <div class="overflow-hidden text-overflow--ellipsis">
            <p
              class="
                text-capitalize
                overflow-hidden
                text-overflow--ellipsis
              "
            >
              {{ scope.row.owner.firstName }}
              <span class="text-uppercase"> {{ scope.row.owner.lastName }}</span>
            </p>
          </div>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t(`${I18N_LIST_KEY}.email`)"
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
      :pLabel="t(`${I18N_REGULAR_KEY}.city`)"
      pProp="city"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <p
          class="
            text-capitalize
            overflow-hidden
            text-overflow--ellipsis
          "
        >
          {{ scope.row.city }}
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t(`${I18N_REGULAR_KEY}.status`)"
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
      :pLabel="t(`${I18N_REGULAR_KEY}.option`)"
      :pWidth="80"
      pAlign="center"
    >
      <template #default="scope">
        <PToolbox
          trigger="click"
          :disabled="isToolboxDisabled"
          :pElements="menuElements"
          data-testid="wallet-actions-toolbox"
          @p-toolbox-item-clicked="($event: EntitiesManagementAction) => onToolboxItemClicked($event, scope.row)"
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

    <!-- Mobile card -->
    <template #mobile-title="{ row }">
      <div
        class="
          flex
          flex--align-items-center
          overflow-hidden
        "
      >
        <PEntityAvatar
          :pAccountType="AccountType.REGULAR"
          :pColor="row.owner.avatarColor"
          class="margin-right--4"
        />
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
          <p
            class="
              text-color--gray-500
              font-small
              overflow-hidden
              text-overflow--ellipsis
            "
          >
            {{ row.accountNumber }}
          </p>
        </div>
      </div>
    </template>
  </PResponsiveTable>
</template>

<script setup lang="ts">
import {
  PAvatar,
  PButton,
  PEntityAvatar,
  PIcon,
  PTag,
  PTableColumn,
  PToolbox,
  PResponsiveTable,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { SORT_ORDERS } from '@pulse/common/constants'
import { AccountType } from '@pulse/common/enums'
import { useI18n } from 'vue-i18n'
import type { EntitiesManagementListProps, EntitiesManagementListEmit } from './entities-management.list.types'
import { useEntitiesManagementList } from './entities-management.list.composable'
import { EntitiesManagementAction } from './entities-management.list.enums'

const { t } = useI18n()
const I18N_LIST_KEY = 'entities.wallet.entitiesList'
const I18N_REGULAR_KEY = 'entities.wallet.entitiesListRegular'

const props = withDefaults(defineProps<EntitiesManagementListProps>(), {
  data: () => [],
})

const emit = defineEmits<EntitiesManagementListEmit>()

const {
  menuElements,
  isToolboxDisabled,
  handleSort,
  onDirectFolderAccess,
  onToolboxItemClicked,
} = useEntitiesManagementList(emit)
</script>
