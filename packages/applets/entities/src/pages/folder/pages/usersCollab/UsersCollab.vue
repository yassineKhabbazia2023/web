<template>
  <div class="margin-top--6">
    <RemoveUserDialog
      v-if="userToRemove"
      v-model="isRemoveUserDialogOpened"
      :userToRemove="userToRemove"
      isCollab
      @user-removed="onUserRemoved"
    />
    <div class="flex margin-bottom--6">
      <FormSearch
        class="user-collabs__search-bar margin-right--4"
        @search-value-submitted="handleSearchValueSubmitted"
      />
      <PButton
        v-if="hasPermission(PERMISSION_CODES.MANAGE_ACCESS)"
        pType="primary"
        pSize="small"
        :loading="isLoadingOperations"
        :disabled="availableOperations.length === 0"
        pPlain
        data-testid="manage-access-button"
        @click="handleOpenAccessDrawer"
      >
        <span>{{ t('manageAccess') }}</span>
      </PButton>
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
          >
            <template #default="scope">
              <div class="flex flex--align-items-center">
                <div class="margin-right--2">
                  <PAvatar
                    pColor="bordered-persian"
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
            pProp="date"
          >
            <template #default="scope">
              {{ scope.row.firstDateAccess }}
            </template>
          </PTableColumn>
          <PTableColumn
            :pLabel="t('action')"
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
                  pType="generic"
                  pSize="small"
                  class="margin-left--1"
                  data-testid="folder-users-collab-action"
                  @click="handleToolboxClick(scope.row)"
                >
                  <PIcon pName="threeDots" :color="AppColors.GRAY_300" />
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
          :pPageSizeSelectorGroupLabel="t('numberOfUserPerPage')"
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
    v-if="selectedRow"
    v-model="isManageRightsDrawerOpened"
    :selectedUser="selectedRow"
  />
  <ManageAccessDrawer
    v-model="isManageAccessDrawerOpened"
    @update-operation-table="handleOperationTableUpdate"
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
  PIPatchCheck,
  PIPower,
  PLoader,
  PAvatar,
  PIPerson,
  PPagination,
  PICheck,
  PIExclamationTriangle,
} from '@pulse/styleguide/components'
// TODO should move this component to a common folder
import RemoveUserDialog from '../usersClient/components/RemoveUserDialog'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { AppColors, PNotification } from '@pulse/styleguide'
import { amplitudeService, commonStore, getInitials, userPermissions } from '@pulse/common'
import {
  PAGE_SIZES,
  PERMISSION_CODES,
  DATE_TIME_FORMATS as datetimeFormats,
} from '@entities/constants'
import { getFullName } from '@entities/common/utils'
import { fetchAccountCustomers } from '@entities/services/wallet'
import { getPaginationLabel, removeFalsyValues } from '@entities/helper'
import { updateSignatoryStatus, getAccountSignatories } from '@entities/services/account'
import type { AccountSignatories } from '@entities/services/account/accountTypes'
import type { StateUser, User } from './types'
import type { UserStatus } from '@entities/common/types'
import { userActions } from './types'
import ManageRightsDrawer from '@entities/common/components/ManageRightsDrawer'
import ManageAccessDrawer from './components/ManageAccessDrawer'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import { useOperation } from './composables/useOperation'
import { fetchAccountOperations } from '@entities/services/contact'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const route = useRoute()
const selectedRow = ref(undefined)
const isManageRightsDrawerOpened = ref(false)
const { user } = storeToRefs(commonStore())

// #region manage access
const { hasPermission } = userPermissions()
const isManageAccessDrawerOpened = ref(false)
const isLoadingOperations = ref(true)
const { operations, availableOperations } = useOperation()

const handleOpenAccessDrawer = () => {
  isManageAccessDrawerOpened.value = true
  amplitudeService.track('Registry Validation Initiated')
}

const handleOperationTableUpdate = async () => {
  operations.value = await fetchAccountOperations(currentEntity.value?.accountId as number)
}
// #endregion

const state: StateUser = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: undefined,
  totalItems: undefined,
  isLoading: true,
  search: undefined,
  sort: undefined,
  order: undefined,
})

const toolboxItems = ref<PToolboxItemProps[]>([])
function handleToolboxClick(userRow: any) {
  toolboxItems.value.length = 0
  const items: PToolboxItemProps[] = [
    {
      pIconName: 'PIPencilSquare',
      pValue: t('modifyRights'),
      pActionName: userActions.MODIFY_RIGHTS,
      pState: 'default',
    },
  ]
  if (hasPermission(PERMISSION_CODES.COLLAB_REMOVE_USER)) {
    items.push({
      pIconName: 'PIPersonRemove',
      pValue: t('removeUser'),
      pActionName: userActions.REMOVE_USER,
      pState: 'default',
    })
  }

  if (!isContactSignatory(userRow.contactId)) {
    items.unshift(
      {
        pIconName: 'PIPatchCheck',
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
        pIconName: 'PIPatchCheck',
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

  state.isLoading = true

  try {
    const {
      currentPage,
      items,
      totalItems,
      totalPage,
    } = await fetchAccountCustomers(+route.params.id, queryParamsWithoutUndefined)

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
  state.sort = prop
  state.order = order
}

const handleUserAction = (action: string, row: any) => {
  selectedRow.value = row
  if (action === userActions.MODIFY_RIGHTS) {
    isManageRightsDrawerOpened.value = true
  }
  if (action === userActions.ASSIGN_SIGNATORY) {
    handleAddSignatory(row.contactId, row.fullName)
  }
  if (action === userActions.UNASSIGN_SIGNATORY) {
    handleRemoveSignatory(row.contactId, row.fullName)
  }
  if (action === userActions.REMOVE_USER) {
    handleRemoveUser(row)
  }
}

// Signatory addition scope
const currentEntity = computed(() => user.value?.entities.default)

async function handleAddSignatory(contactId: User['contactId'], contactFullName: string) {
  if (!currentEntity.value) {
    return
  }

  try {
    await updateSignatoryStatus(currentEntity.value.accountId, contactId)
    showAddSignatorySuccess(contactFullName)
    setAccountSignatories()
  } catch (error) {
    showTechnicalError()
  }
}

async function handleRemoveSignatory(contactId: User['contactId'], contactFullName: string) {
  if (!currentEntity.value) {
    return
  }
  try {
    await updateSignatoryStatus(currentEntity.value.accountId, contactId, false)
    showSuccessNotification('signatoryRemoved', contactFullName)
    setAccountSignatories()
  } catch (error) {
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

function showAddSignatorySuccess(userFullName: string) {
  PNotification({
    message: t('signatoryAdded', { userFullName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

function showSuccessNotification(messageKey: string, userFullName: string) {
  PNotification({
    message: t(messageKey, { userFullName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

function showTechnicalError() {
  PNotification({
    message: t('technicalError'),
    icon: PIExclamationTriangle,
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const getQueryParams = () => ({
  pageNumber: state.currentPage,
  pageSize: state.limit,
  search: state.search,
  'sorting.field': state.sort,
  'sorting.descending': state.order === 'descending',
})

watch(() => [
  state.currentPage,
  state.limit,
  state.search,
  state.sort,
  state.order,
], async () => {
  await formatAndFillUsersCollabTable()
})

onMounted(async () => {
  operations.value = []
  await formatAndFillUsersCollabTable()
  await setAccountSignatories()
  if (currentEntity.value?.accountId) {
    try {
      operations.value = await fetchAccountOperations(currentEntity.value.accountId)
    } catch (error) {
      logger.error('Unable to fetch operations: ', error)
    } finally {
      isLoadingOperations.value = false
    }
  } else {
    isLoadingOperations.value = false
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
  action: 'Action'
  email: 'Email'
  manageAccess: 'Manage access'
  dateAccess: 'First date access'
  assignSignatory: 'Designate as signatory'
  removeSignatory: 'Revoke signatory status'
  modifyRights: 'Change the rights'
  removeUser: 'Remove user'
  statusConnect: 'Connected'
  statusInvite: 'Invited'
  statusDeclared: 'Declared'
  numberOfUserPerPage: 'number of user per page'
  on: 'on'
  signatoryAdded: "User {userFullName} has been successfuly designated as a signatory of the entity"
  signatoryRemoved: "The user {userFullName} is no longer a signatory on the account."
  deleteSignatoryTooltip: 'A folder should have at least one signatory'
  technicalError: 'The operation failed due to a technical error. Please try again later.'
fr-FR:
  user: 'Utilisateur'
  status: 'Statut'
  action: 'Action'
  email: 'E-mail'
  manageAccess: 'Gérer les accès'
  dateAccess: "Date d'ajout"
  assignSignatory: 'Désigner en tant que signataire'
  removeSignatory: 'Retirer le statut de signataire'
  modifyRights: 'Modifier les droits'
  removeUser: 'Retirer l’utilisateur'
  statusConnect: 'Connecté'
  statusInvite: 'Invité'
  statusDeclared: 'Declaré'
  numberOfUserPerPage: "nombre de d'utilisateur par page"
  signatoryAdded: "L'utilisateur {userFullName} a été désigné en tant que signataire de l'entité avec succès"
  signatoryRemoved: "L’utilisateur {userFullName} n’est plus signataire du dossier."
  deleteSignatoryTooltip: 'Un dossier doit avoir au moins un signataire'
  technicalError: 'L’opération a échoué suite à une erreur technique. Veuillez réessayer plus tard.'
  on: 'sur'
</i18n>
