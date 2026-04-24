<template>
  <div class="margin-top--6">
    <AddCustomerDrawer
      v-if="currentEntityId &&
        currentEntityName &&
        currentEntityNumber &&
        isAddCustomerDrawerOpened
      "
      v-model="isAddCustomerDrawerOpened"
      :targetEntityId="currentEntityId"
      :targetEntityName="currentEntityName"
      :targetEntityNumber="currentEntityNumber"
      @refresh-customers-list="formatAndFillUsersCollabTable"
    />
    <RemoveUserDialog
      v-if="userToRemove"
      v-model="isRemoveUserDialogOpened"
      :userToRemove="userToRemove"
      isCollab
      @user-removed="onUserRemoved"
    />
    <div
      class="
        flex
        flex--align-items-center
        flex--justify-content-space-between
        margin-bottom--6
      "
    >
      <FormSearch
        class="user-collabs__search-bar margin-right--4 max-width-500"
        :placeholder="t('searchUsers')"
        @search-value-submitted="handleSearchValueSubmitted"
      />
      <div>
        <PButton
          v-if="isAddUserButtonVisible"
          pType="primary"
          pSize="small"
          class="margin-right--2"
          data-testid="add-customer-button"
          @click="isAddCustomerDrawerOpened = true"
        >
          <PIcon pName="personAdd" />
          <span class="padding-left--2">{{ t('addCustomer') }}</span>
        </PButton>
        <PButton
          v-if="CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MANAGE_ACCESS)"
          pType="primary"
          pSize="small"
          :loading="isLoadingOperations"
          :disabled="isAccessButtonDisabled"
          pPlain
          data-testid="manage-access-button"
          @click="handleOpenAccessDrawer"
        >
          <span>{{ t('manageAccess') }}</span>
        </PButton>
      </div>
    </div>

    <div
      v-if="state.isLoading"
      class="loader flex flex--justify-content-center flex--align-items-center"
    >
      <PLoader pType="primary" pSize="50" />
    </div>

    <!--
      The v-show is used just below (instead of a v-if) due to the sorting on the table
      that is done on the back end side. In this case, the table should not be destroyed
      & re render else there is a bug with the caret.
    -->
    <div v-show="!state.isLoading">
      <div v-if="state.totalItems">
        <PTable
          :pData="state.data"
          tableLayout="fixed"
          data-testid="folder-users-table"
          showOverflowTooltip
          pStripe
          @sort-change="handleSortChange"
        >
          <PTableColumn
            :pLabel="t('user')"
            pProp="name"
            pSortable="custom"
            :pSortOrders="SORT_ORDERS"
          >
            <template #default="scope">
              <div class="flex flex--align-items-center">
                <div class="margin-right--2">
                  <PAvatar
                    :pRole="AvatarRoles.CLIENT"
                    pType="small"
                  >
                    {{ scope.row.initials }}
                  </PAvatar>
                </div>
                <p>
                  {{ scope.row.fullName }}
                </p>
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
              <p>
                {{ scope.row.email }}
              </p>
            </template>
          </PTableColumn>
          <PTableColumn
            :pLabel="t('status')"
            pSortable="custom"
            pProp="status"
            :pSortOrders="SORT_ORDERS"
          >
            <template #default="scope">
              <PTag
                :pContent="scope.row.status.text"
                :pColor="scope.row.status.color"
                :pIconLeftName="scope.row.status.iconName"
              />
            </template>
          </PTableColumn>
          <PTableColumn
            :pLabel="t('dateAccess')"
            pSortable="custom"
            pProp="creationDate"
            :pSortOrders="SORT_ORDERS"
          >
            <template #default="scope">
              {{ scope.row.firstDateAccess }}
            </template>
          </PTableColumn>
          <PTableColumn
            :p-label="t('roles')"
            pWidth="340"
          >
            <template #default="scope">
              <PTag
                v-if="isContactSignatory(scope.row.contactId)"
                :pContent="t('signatoryRoleName')"
                pColor="light-blue"
                class="margin-right--2"
              />
              <PTag
                v-if="scope.row.contactFlagPortailFactures"
                :pContent="t('digitalVaultContactName')"
                pColor="warning"
              />
            </template>
          </PTableColumn>
          <PTableColumn
            :pLabel="t('actions')"
            :pWidth="100"
          >
            <template #default="scope">
              <PToolbox
                trigger="click"
                popperClass="toolbox-container"
                :pElements="toolboxItems"
                @p-toolbox-item-clicked="($event: string) => handleUserAction($event, scope.row)"
              >
                <PButton
                  pSize="small"
                  class="margin-left--1"
                  data-testid="folder-users-collab-action"
                  @click="handleToolboxClick"
                >
                  <PIcon pName="threeDots" />
                </PButton>
              </PToolbox>
            </template>
          </PTableColumn>
        </PTable>

        <PPagination
          v-model:p-current-page="state.currentPage"
          v-model:p-page-size="state.limit"
          class="margin-top--6"
          :pTotal="state.totalItems"
          :pPageSizes="PAGE_SIZES"
          pPageSizeSelectorSuffix=""
          pShowTotalPageCounter
          @on-page-range-changed="handlePageRangeChanged"
        >
          <p>{{ paginationLabel }}</p>
        </PPagination>
      </div>

      <NoResult v-if="state.data.length === 0" />
    </div>
  </div>
  <ManageRightsDrawer
    v-if="selectedRow && currentEntity !== undefined"
    v-model="isManageRightsDrawerOpened"
    :selectedUser="selectedRow"
    :currentEntity="currentEntity"
  />
  <ManageAccessDrawerUnitary
    v-model="isManageAccessDrawerOpened"
    :accountOperationsList="accountOperationsList"
    :trackingLocalisation="TrackingLocalisation.ENTITY"
    :currentEntity="currentEntity"
    @update-operation-table="loadOperations"
  />
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import {
  PTable,
  PTableColumn,
  PTag,
  PToolbox,
  PButton,
  PIcon,
  PLoader,
  PAvatar,
  PPagination,
} from '@pulse/styleguide/components'
import RemoveUserDialog from '../components/remove-user-dialog'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { AvatarRoles } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { getInitials, getFullName, getPaginationLabel } from '@pulse/common/utils'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { PAGE_SIZES, ACTION_PERMISSIONS, SORT_ORDERS } from '@pulse/common/constants'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import { fetchAccountCustomers } from '@entities/services/wallet'
import { removeFalsyValues } from '@pulse/toolbox/utils/object'
import { getAccountSignatories } from '@entities/services/account'
import type { AccountSignatories } from '@entities/services/account/account.type'
import type { StateUser } from '../types/users-collab.types'
import type { User, UserStatus } from '@entities/types'
import { UserActions, TrackingLocalisation } from '@entities/enums'
import ManageRightsDrawer from '@entities/components/ManageRightsDrawer'
import ManageAccessDrawerUnitary from '@entities/components/ManageAccessDrawer/ManageAccessDrawerUnitary'
import NoResult from '@entities/components/NoResult'
import FormSearch from '@entities/components/FormSearch'
import { fetchOperationsForAccount } from '@entities/services/registry'
import type { AccountOperations } from '@entities/services/registry'
import { getPendingOperations, getOperationsWithLegalName, getAccountOperationsList } from '../utils/operations.utils'
import { RouteName, RouteParam, SortDirection } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import AddCustomerDrawer from '../components/add-customer-drawer'
import { useSort } from '@pulse/common/composables/sort'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
  messages: {
    'en-US': {
      user: 'User',
      status: 'Status',
      actions: 'Actions',
      email: 'Email',
      manageAccess: 'Manage access',
      addCustomer: 'Add a customer',
      dateAccess: 'First date access',
      modifyRights: 'Change the rights',
      removeUser: 'Remove user',
      searchUsers: 'Search by name, first name, email, status',
      statusConnect: 'Connected',
      statusInvite: 'Invited',
      statusDeclared: 'Declared',
      on: 'on',
      roles: 'Role(s)',
      signatoryRoleName: 'Engagement letter signatory',
      digitalVaultContactName: 'Digital vault contact',
    },
    'fr-FR': {
      user: 'Utilisateur',
      status: 'Statut',
      actions: 'Actions',
      email: 'E-mail',
      manageAccess: 'Gérer les accès',
      addCustomer: 'Ajouter un utilisateur',
      dateAccess: 'Date d\'ajout',
      modifyRights: 'Modifier les droits',
      removeUser: 'Retirer l\'utilisateur',
      searchUsers: 'Rechercher par nom, prénom, e-mail, statut',
      statusConnect: 'Connecté',
      statusInvite: 'Invité',
      statusDeclared: 'Déclaré',
      on: 'sur',
      roles: 'Rôle(s)',
      signatoryRoleName: 'Signataire lettre de mission',
      digitalVaultContactName: 'Contact coffre fort',
    },
  },
})

const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()

const route = useRoute()
const selectedRow = ref(undefined)
const isManageRightsDrawerOpened = ref(false)
const { user } = storeToRefs(userStore)

// #region manage access
const isManageAccessDrawerOpened = ref(false)
const isLoadingOperations = ref(false)
const accountOperationsList = ref<AccountOperations[]>([])

const handleOpenAccessDrawer = () => {
  isManageAccessDrawerOpened.value = true
  AmplitudeService.track('Registry Validation Initiated')
}

async function loadOperations() {
  isLoadingOperations.value = true
  try {
    const operations = await fetchOperationsForAccount(currentEntity.value?.accountId ?? 0)
    const pendingOperations = getPendingOperations(operations)
    const defaultLegalName = currentEntity.value?.legalName ?? ''
    const pendingOperationsWithLegalName = getOperationsWithLegalName(pendingOperations, defaultLegalName)
    accountOperationsList.value = getAccountOperationsList(pendingOperationsWithLegalName)
  } catch (error) {
    logger.error('Unable to fetch operations: ', error)
  } finally {
    isLoadingOperations.value = false
  }
}
const isAccessButtonDisabled = computed(() => {
  const firstAccount = accountOperationsList.value?.at(0)
  const operationsLength = firstAccount?.operations?.length ?? 0

  return operationsLength === 0
})
// #endregion

// #region add customer user
const isAddCustomerDrawerOpened = ref(false)

const currentEntityId = computed(() => currentEntity.value?.accountId)
const currentEntityName = computed(() => currentEntity.value?.legalName)
const currentEntityNumber = computed(() => currentEntity.value?.accountNumber)

const canAddUser = computed(() => CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ADD_USERS))

const isAddUserButtonVisible = computed(() =>
  currentEntityId.value &&
  canAddUser.value &&
  route.name === RouteName.USERS,
)
// #endregion

const state: StateUser = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: undefined,
  totalItems: undefined,
  isLoading: true,
  search: undefined,
  sorting: {
    field: undefined,
    descending: false,
  },
})

const toolboxItems = ref<PToolboxItemProps[]>([])
function handleToolboxClick() {
  toolboxItems.value.length = 0
  const items: PToolboxItemProps[] = [
    {
      pIconName: 'pencilSquare',
      pValue: t('modifyRights'),
      pActionName: UserActions.MODIFY_RIGHTS,
      pState: 'default',
    },
  ]
  if (CurrentUserManager.hasPermission(ACTION_PERMISSIONS.COLLAB_REMOVE_USER)) {
    items.push({
      pIconName: 'personRemove',
      pValue: t('removeUser'),
      pActionName: UserActions.REMOVE_USER,
      pState: 'default',
    })
  }

  toolboxItems.value.push(...items)
}

const paginationLabel = computed(() => getPaginationLabel<User>(t('on'), state))

const formatAndFillUsersCollabTable = async () => {
  const queryParamsWithoutUndefined = removeFalsyValues(getQueryParams())
  const entityId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

  state.isLoading = true

  try {
    const {
      currentPage,
      items,
      totalItems,
      totalPage,
      // entityId can't be null here, so we use non-null assertion
    } = await fetchAccountCustomers(entityId!, queryParamsWithoutUndefined)

    const formattedData: User[] = items.map((userFromApi) => {
      return {
        contactId: userFromApi.contactId,
        initials: getInitials(userFromApi.firstName, userFromApi.lastName),
        status: getStatus(userFromApi.status),
        firstName: userFromApi.firstName?.toLowerCase() ?? '',
        lastName: userFromApi.lastName?.toUpperCase() ?? '',
        fullName: getFullName(userFromApi.firstName, userFromApi.lastName),
        email: userFromApi.email,
        firstDateAccess: d(new Date(userFromApi.creationDate), 'short'),
        isOwner: user.value?.id === userFromApi.contactId,
        contactFlagPortailFactures: userFromApi.contactFlagPortailFactures,
      }
    })

    state.data = formattedData
    state.totalItems = totalItems
    state.currentPage = currentPage
    state.totalPage = totalPage
  } catch (err) {
    logger.error(err)
  } finally {
    state.isLoading = false
  }
}

const getStatus = (status: string): UserStatus => {
  switch (status) {
    case 'Declared':
      return {
        text: t('statusDeclared'),
        iconName: 'patchCheck',
        color: 'gray',
      }
    case 'Connected':
      return {
        text: t('statusConnect'),
        iconName: 'power',
        color: 'success',
      }
    default:
      return {
        text: t('statusInvite'),
        iconName: 'person',
        color: 'default',
      }
  }
}

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.currentPage = 1
  state.search = newSearchValue
}

const handlePageRangeChanged = (newValue: number) => {
  state.currentPage = 1
  state.limit = newValue
}

const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  const sortCriteria = {
    field: prop,
    descending: order === SortDirection.DESCENDING,
  }
  const { handleSortCriteria } = useSort()
  handleSortCriteria(sortCriteria, state)
}

const handleUserAction = (action: string, row: any) => {
  selectedRow.value = row

  if (action === UserActions.MODIFY_RIGHTS) {
    isManageRightsDrawerOpened.value = true
  }

  if (action === UserActions.REMOVE_USER) {
    handleRemoveUser(row)
  }
}

const { currentEntity } = storeToRefs(currentEntityStore)

const isRemoveUserDialogOpened = ref(false)
const userToRemove = ref<User>()

async function onUserRemoved() {
  await formatAndFillUsersCollabTable()
  userToRemove.value = undefined
}

async function handleRemoveUser(user: User) {
  userToRemove.value = user
  isRemoveUserDialogOpened.value = true
}

const accountSignatories = ref<AccountSignatories[]>([])
function isContactSignatory(contactId: User['contactId']) {
  return !!accountSignatories.value.find((signatory) => signatory.contactId === contactId)
}

async function setAccountSignatories() {
  if (!currentEntity.value) {
    return
  }
  state.isLoading = true
  try {
    const signatories = await getAccountSignatories(currentEntity.value.accountId)
    accountSignatories.value.length = 0
    accountSignatories.value.push(...signatories)
  } catch (error) {
    logger.error(error)
  }

  state.isLoading = false
}

const getQueryParams = () => ({
  pageNumber: state.currentPage,
  pageSize: state.limit,
  search: state.search,
  'sorting.field': state.sorting.field,
  'sorting.descending': state.sorting.descending,
})

watch(() => [
  state.currentPage,
  state.limit,
  state.search,
  state.sorting.field,
  state.sorting.descending,
], async () => {
  await formatAndFillUsersCollabTable()
})

onMounted(async () => {
  await formatAndFillUsersCollabTable()
  await setAccountSignatories()
  if (currentEntity.value?.accountId) {
    await loadOperations()
  }
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.user-collabs {
  &__search-bar {
    width: 100%;
  }
}
.toolbox-container {
  .el-scrollbar {
    padding: 5px 0px;
  }
  .p-toolbox-item__text {
    width: 230px;
  }
}
</style>

