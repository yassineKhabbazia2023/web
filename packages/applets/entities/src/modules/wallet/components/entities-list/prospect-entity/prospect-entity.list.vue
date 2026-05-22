<template>
  <PResponsiveTable
    :pData="props.data"
    pRowKey="accountId"
    showOverflowTooltip
    pStripe
    tableLayout="fixed"
    :pDisableResponsive="prospectListType === ProspectListType.PROSPECT_COLLAB"
    @sort-change="handleSort"
  >
    <PTableColumn
      v-if="isColumnVisible(ProspectColumn.COMPANY_NAME)"
      :pLabel="t(`${I18N_LIST_KEY}.companyName`)"
      pProp="legalName"
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
            pAccountType="PROSPECT"
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
      v-if="isColumnVisible(ProspectColumn.CUSTOMER_CODE)"
      :pLabel="t(`${I18N_LIST_KEY}.customerCode`)"
      pProp="accountNumber"
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
      v-if="isColumnVisible(ProspectColumn.LEADER)"
      :pLabel="t(`${I18N_LIST_KEY}.leader`)"
      pProp="signatory"
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
      v-if="isColumnVisible(ProspectColumn.EMAIL)"
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
      v-if="isColumnVisible(ProspectColumn.ONBOARDING_STEP)"
      :pLabel="t(`${I18N_PROSPECT_KEY}.step`)"
      pProp="stepCode"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <PTag
          :pContent="t(ProspectEntityListManager.getStepConfig(scope.row.onboardingStep).label)"
          :pColor="ProspectEntityListManager.getStepConfig(scope.row.onboardingStep).color"
        />
      </template>
    </PTableColumn>
    <PTableColumn
      v-if="isColumnVisible(ProspectColumn.CAC_FOLDER)"
      :pLabel="t(`${I18N_PROSPECT_KEY}.cacFolder`)"
      pProp="dossierCAC"
      pSortable="custom"
      :pSortOrders="SORT_ORDERS"
    >
      <template #default="scope">
        <PTag
          :pContent="scope.row.cacFolder ? t(`${I18N_LIST_KEY}.yes`) : t(`${I18N_LIST_KEY}.no`)"
          :pColor="scope.row.cacFolder ? 'success' : 'gray'"
          :pIconLeftName="scope.row.cacFolder ? 'checkCircle' : 'xCircle'"
        />
      </template>
    </PTableColumn>
    <PTableColumn
      v-if="isColumnVisible(ProspectColumn.OPTIONS)"
      :pLabel="t(`${I18N_PROSPECT_KEY}.option`)"
      :pWidth="80"
      pAlign="center"
    >
      <template #default="scope">
        <PToolbox
          trigger="click"
          :pElements="menuElements"
          data-testid="wallet-actions-toolbox"
          @p-toolbox-item-clicked="($event: ProspectAction) => onToolboxItemClicked($event, scope.row)"
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
          pAccountType="PROSPECT"
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

  <ProspectArchiveDialog
    v-if="selectedProspect !== null"
    v-model="isArchiveDialogVisible"
    :prospect="selectedProspect"
    @archived="onProspectArchived"
  />
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
import { useI18n } from 'vue-i18n'
import type { EntitiesListProspectsProps, EntitiesListProspectsEmit } from './prospect-entity.list.types'
import { SORT_ORDERS } from '@pulse/common/constants'
import { ProspectListType } from '@entities/modules/wallet/enums'
import { useProspectsEntitiesList } from './prospect-entity.list.composable'
import { ProspectEntityListManager } from './prospect-entity.list.manager'
import { ProspectAction, ProspectColumn } from './prospect-entity.list.enums'
import ProspectArchiveDialog from '../../prospect-archive/prospect-archive.dialog.vue'

const { t } = useI18n()
const I18N_LIST_KEY = 'entities.wallet.entitiesList'
const I18N_PROSPECT_KEY = 'entities.wallet.entitiesListProspects'

const props = withDefaults(defineProps<EntitiesListProspectsProps>(), {
  data: () => [],
})

const emit = defineEmits<EntitiesListProspectsEmit>()

const {
  isColumnVisible,
  menuElements,
  isArchiveDialogVisible,
  selectedProspect,
  handleSort,
  onDirectFolderAccess,
  onToolboxItemClicked,
  onProspectArchived,
} = useProspectsEntitiesList(props, emit)
</script>
