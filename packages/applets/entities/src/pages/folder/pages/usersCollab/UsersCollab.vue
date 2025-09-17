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
                <p :class="{ 'font-semibold': isContactSignatory(scope.row.contactId)}">
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
                pEffect="light"
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
            :pLabel="t('actions')"
            :pWidth="100"
          >
            <template #default="scope">
              <PToolbox
                trigger="click"
                popperClass="toolbox-container"
                :pElements="toolboxItems"
                @p-toolbox-item-clicked="$event => handleUserAction($event, scope.row)"
              >
                <PButton
                  pSize="small"
                  class="margin-left--1"
                  data-testid="folder-users-collab-action"
                  @click="handleToolboxClick(scope.row)"
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
    v-if="selectedRow && selectedEntity !== undefined"
    v-model="isManageRightsDrawerOpened"
    :selectedUser="selectedRow"
    :selectedEntity="selectedEntity"
  />
  <ManageAccessDrawerUnitary
    v-model="isManageAccessDrawerOpened"
    :accountOperationsList="accountOperationsList"
    :trackingLocalisation="TrackingLocalisation.FOLDER"
    :currentEntity="selectedEntity"
    @update-operation-table="loadOperations"
  />
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
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
// TODO should move this component to a common folder
import RemoveUserDialog from '../usersClient/components/RemoveUserDialog'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { AvatarRoles, PNotification } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { getInitials } from '@pulse/common'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { PAGE_SIZES, ACTION_PERMISSIONS, SORT_ORDERS } from '@pulse/common/constants'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import { getFullName } from '@entities/common/utils'
import { fetchAccountCustomers } from '@entities/services/wallet'
import { getPaginationLabel } from '@entities/helper'
import { removeFalsyValues } from '@pulse/core/utils/object'
import { updateSignatoryStatus, getAccountSignatories } from '@entities/services/account'
import type { AccountSignatories } from '@entities/services/account/accountTypes'
import type { StateUser, User } from './types'
import type { UserStatus } from '@entities/common/types'
import { userActions } from './types'
import ManageRightsDrawer from '@entities/common/components/ManageRightsDrawer'
import ManageAccessDrawerUnitary from '@entities/common/components/ManageAccessDrawer/ManageAccessDrawerUnitary'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import { fetchOperationsForAccount } from '@entities/services/contact'
import type { AccountOperations } from '@entities/services/contact/contactTypes'
import { getPendingOperations } from '@entities/pages/folder/utils/operation.utils'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import { getOperationsWithLegalName, getAccountOperationsList } from './UsersCollab.utils'
import { RouteName, RouteParam, SortDirection } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import AddCustomerDrawer from '../usersClient/components/add-customer-drawer'
import { handleSort } from '@entities/composables/handleSortTable.composable'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const userStore = useUserStore()
const selectedEntityStore = useSelectedEntityStore()

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
    const operations = await fetchOperationsForAccount(selectedEntity.value?.accountId ?? 0)
    const pendingOperations = getPendingOperations(operations)
    const defaultLegalName = selectedEntity.value?.legalName ?? ''
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

const currentEntityId = computed(() => selectedEntity.value?.accountId)
const currentEntityName = computed(() => selectedEntity.value?.legalName)
const currentEntityNumber = computed(() => selectedEntity.value?.accountNumber)

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
function handleToolboxClick(userRow: any) {
  toolboxItems.value.length = 0
  const items: PToolboxItemProps[] = [
    {
      pIconName: 'pencilSquare',
      pValue: t('modifyRights'),
      pActionName: userActions.MODIFY_RIGHTS,
      pState: 'default',
    },
  ]
  if (CurrentUserManager.hasPermission(ACTION_PERMISSIONS.COLLAB_REMOVE_USER)) {
    items.push({
      pIconName: 'personRemove',
      pValue: t('removeUser'),
      pActionName: userActions.REMOVE_USER,
      pState: 'default',
    })
  }

  if (!isContactSignatory(userRow.contactId)) {
    items.unshift(
      {
        pIconName: 'patchCheck',
        pValue: t('assignSignatory'),
        pActionName: userActions.ASSIGN_SIGNATORY,
        pState: 'default',
      },
    )
  }

  if (isContactSignatory(userRow.contactId)) {
    const tooltipContent = !hasMultipleSignatories() ? t('deleteSignatoryTooltip') : undefined
    items.unshift(
      {
        pIconName: 'patchCheck',
        pValue: t('removeSignatory'),
        pActionName: userActions.UNASSIGN_SIGNATORY,
        pState: 'default',
        disabled: !hasMultipleSignatories(),
        pContentTooltip: tooltipContent,
      },
    )
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

    /**
     * 🛠️ TODO: Need to create a function format inside utils folder
     */
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

/**
 * 🛠️ TODO: Need to add a global function for retrieving status instead of creating it each time
 */
const getStatus = (status: string): UserStatus => {
  switch (status) {
    case 'Declared':
      return {
        text: t('statusDeclared'),
        iconName: 'patchCheck',
        color: 'gray-900',
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
        color: 'persian',
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
  handleSort(sortCriteria, state)
}

const handleUserAction = (action: string, row: any) => {
  const { contactId, fullName, email } = row
  selectedRow.value = row

  if (action === userActions.MODIFY_RIGHTS) {
    isManageRightsDrawerOpened.value = true
  }
  if (action === userActions.ASSIGN_SIGNATORY) {
    handleAddSignatory(contactId, fullName, email)
  }
  if (action === userActions.UNASSIGN_SIGNATORY) {
    handleRemoveSignatory(contactId, fullName, email)
  }
  if (action === userActions.REMOVE_USER) {
    handleRemoveUser(row)
  }
}

// Signatory addition scope
const { selectedEntity } = storeToRefs(selectedEntityStore)

async function handleAddSignatory(contactId: User['contactId'], contactFullName: string, email: string) {
  if (!selectedEntity.value) {
    return
  }

  try {
    await updateSignatoryStatus(selectedEntity.value.accountId, contactId)
    showAddSignatorySuccess(contactFullName)
    setAccountSignatories()
    AmplitudeService.track('Signatory Updated', {
      signatory_status_after_update: 'On',
      signatory_target_mail: email,
    })
  } catch (error) {
    logger.error(error)
    showTechnicalError()
  }
}

async function handleRemoveSignatory(contactId: User['contactId'], contactFullName: string, email: string) {
  if (!selectedEntity.value) {
    return
  }
  try {
    await updateSignatoryStatus(selectedEntity.value.accountId, contactId, false)
    showSuccessNotification('signatoryRemoved', contactFullName)
    setAccountSignatories()
    AmplitudeService.track('Signatory Updated', {
      signatory_status_after_update: 'Off',
      signatory_target_mail: email,
    })
  } catch (error) {
    logger.error(error)
    showTechnicalError()
  }
}

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

function hasMultipleSignatories() {
  return accountSignatories.value.length > 1
}

async function setAccountSignatories() {
  if (!selectedEntity.value) {
    return
  }
  state.isLoading = true
  try {
    const signatories = await getAccountSignatories(selectedEntity.value.accountId)
    accountSignatories.value.length = 0
    accountSignatories.value.push(...signatories)
  } catch (error) {
    logger.error(error)
  }

  state.isLoading = false
}

function showAddSignatorySuccess(userFullName: string) {
  PNotification({
    message: t('signatoryAdded', { userFullName }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

function showSuccessNotification(messageKey: string, userFullName: string) {
  PNotification({
    message: t(messageKey, { userFullName }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

function showTechnicalError() {
  PNotification({
    message: t('technicalError'),
    iconName: 'exclamationTriangle',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
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
  if (selectedEntity.value?.accountId) {
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

<i18n lang="yaml">
en-US:
  user: 'User'
  status: 'Status'
  actions: 'Actions'
  email: 'Email'
  manageAccess: 'Manage access'
  addCustomer: 'Add a customer'
  dateAccess: 'First date access'
  assignSignatory: 'Designate as signatory'
  removeSignatory: 'Revoke signatory status'
  modifyRights: 'Change the rights'
  removeUser: 'Remove user'
  searchUsers: 'Search by name, first name, email, status'
  statusConnect: 'Connected'
  statusInvite: 'Invited'
  statusDeclared: 'Declared'
  on: 'on'
  signatoryAdded: "User {userFullName} has been successfully designated as a signatory of the entity"
  signatoryRemoved: "The user {userFullName} is no longer a signatory on the account."
  deleteSignatoryTooltip: 'A folder should have at least one signatory'
  technicalError: 'The operation failed due to a technical error. Please try again later.'
fr-FR:
  user: 'Utilisateur'
  status: 'Statut'
  actions: 'Actions'
  email: 'E-mail'
  manageAccess: 'Gérer les accès'
  addCustomer: 'Ajouter un utilisateur'
  dateAccess: "Date d'ajout"
  assignSignatory: 'Désigner en tant que signataire'
  removeSignatory: 'Retirer le statut de signataire'
  modifyRights: 'Modifier les droits'
  removeUser: 'Retirer l’utilisateur'
  searchUsers: 'Rechercher par nom, prénom, e-mail, statut'
  statusConnect: 'Connecté'
  statusInvite: 'Invité'
  statusDeclared: 'Déclaré'
  signatoryAdded: "L'utilisateur {userFullName} a été désigné en tant que signataire de l'entité avec succès"
  signatoryRemoved: "L’utilisateur {userFullName} n’est plus signataire du dossier."
  deleteSignatoryTooltip: 'Un dossier doit avoir au moins un signataire'
  technicalError: 'L’opération a échoué suite à une erreur technique. Veuillez réessayer plus tard.'
  on: 'sur'
</i18n>
