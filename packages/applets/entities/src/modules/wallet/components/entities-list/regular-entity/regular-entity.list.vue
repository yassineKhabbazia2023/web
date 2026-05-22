<template>
  <PResponsiveTable
    :pData="props.data"
    :pDisableResponsive="isCollab"
    pRowKey="accountId"
    highlightCurrentRow
    showOverflowTooltip
    rowClassName="cursor-pointer"
    pStripe
    tableLayout="fixed"
    class="wallet-table"
    pCardClickable
    @sort-change="handleSort"
    @row-click="onRowClick"
  >
    <PTableColumn
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
          @click.stop="callHandleAddFavorite(scope.row.accountId, scope.row.isFavorite === false)"
        >
          <PIcon
            :pName="scope.row.isFavorite ? 'starFill' : 'star'"
          />
        </PButton>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t(`${LIST_KEY}.companyName`)"
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
            pAccountType="REGULAR"
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
      :pLabel="t(`${LIST_KEY}.customerCode`)"
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
      :pLabel="t(`${LIST_KEY}.leader`)"
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
      :pLabel="t(`${LIST_KEY}.email`)"
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
      :pLabel="t(`${REGULAR_KEY}.city`)"
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
    <template v-if="isCollab === true">
      <PTableColumn
        :pLabel="t(`${REGULAR_KEY}.status`)"
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
        :pLabel="t(`${REGULAR_KEY}.option`)"
        :pWidth="80"
        pAlign="center"
      >
        <template #default="scope">
          <PToolbox
            trigger="click"
            :pElements="menuElementsCollaborator(scope.row.deploymentStatus.text)"
            data-testid="wallet-actions-toolbox"
            @visible-change="onToolboxVisibleChange"
            @p-toolbox-item-clicked="($event: RegularEntityAction) => onToolboxItemClicked($event, scope.row)"
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
        pWidth="46"
        :pShowOverflowTooltip="false"
      >
        <template #default="scope">
          <PCheckbox
            :model-value="isFolderSelected(scope.row.accountId)"
            :disabled="false"
            @update:model-value="toggleSelectedFolder(scope.row.accountId)"
          />
        </template>
      </PTableColumn>
    </template>

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
          pAccountType="REGULAR"
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

    <!-- Mobile card actions slot -->
    <template #mobile-actions="{ row }">
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
import {
  PAvatar,
  PButton,
  PEntityAvatar,
  PIcon,
  PTag,
  PTableColumn,
  PToolbox,
  PCheckbox,
  PResponsiveTable,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { SORT_ORDERS } from '@pulse/common/constants'
import { useI18n } from 'vue-i18n'
import type { EntitiesListRegularProps, EntitiesListRegularEmit } from './regular-entity.list.types'
import { useRegularEntitiesList } from './regular-entity.list.composable'
import { RegularEntityAction } from './regular-entity.list.enums'

const { t } = useI18n()
const LIST_KEY = 'entities.wallet.entitiesList'
const REGULAR_KEY = 'entities.wallet.entitiesListRegular'

const props = withDefaults(defineProps<EntitiesListRegularProps>(), {
  data: () => [],
})

const emit = defineEmits<EntitiesListRegularEmit>()
const selectedFolderIds = defineModel<number[]>('selectedFolderIds', {
  default: () => [],
})

const {
  isCollab,
  callHandleAddFavorite,
  menuElementsCollaborator,
  handleSort,
  onDirectFolderAccess,
  onToolboxVisibleChange,
  onToolboxItemClicked,
  toggleSelectedFolder,
  isFolderSelected,
  onRowClick,
} = useRegularEntitiesList(props, emit, selectedFolderIds)

</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.wallet-table {
  .current-row > td:first-child {
    border-color: var(--p-jungle-400) !important;
  }
}
</style>
