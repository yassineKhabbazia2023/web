<template>
  <div class="margin-top--6">
    <div
      v-if="state.isLoading"
      class="flex flex--justify-content-center margin-y--4"
      data-testid="folder-users-collab-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>

    <div class="margin-bottom--6">
      <FormSearch @search-value-submitted="handleSearchValueSubmitted" />
    </div>

    <div v-if="!state.isLoading">
      <div v-if="state.totalItems">
        <PTable
          @sort-change="handleSortChange"
          :pData="state.data"
          tableLayout="fixed"
          data-testid="folder-users-table"
          showOverflowTooltip
          pStripe
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
                :pIconLeft="scope.row.status.icon"
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
                  <PIcon>
                    <PIThreeDots color="#A4A4A4" />
                  </PIcon>
                </PButton>
              </PToolbox>
            </template>
          </PTableColumn>
        </PTable>

        <PPagination
          class="margin-top--6"
          @on-page-range-changed="handlePageRangeChanged"
          v-model:p-current-page="state.currentPage"
          v-model:p-page-size="state.limit"
          :pTotal="state.totalItems"
          :pPageSizes="PAGE_SIZES"
          :pPageSizeSelectorGroupLabel="t('numberOfUserPerPage')"
          pPageSizeSelectorSuffix=""
          pShowTotalPageCounter
          pBackground
        >
          <p>{{ paginationLabel }}</p>
        </PPagination>
      </div>

      <NoResult v-if="!state.totalItems" />
    </div>
  </div>
  <ManageRightsDrawer
    v-if="selectedRow"
    v-model="isManageRightsDrawerOpened"
    :selectedUser="selectedRow"
  />
</template>

<script setup lang="ts">
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
  PIThreeDots,
  PIPatchCheck,
  PIPower,
  PLoader,
  PAvatar,
  PIPerson,
  PPagination,
  PNotification,
  type PToolboxItemProps,
  PICheck,
  PIExclamationTriangle,
} from '@kpmg/styleguide'
import { commonStore, getInitials } from '@kpmg/common'
import {
  PAGE_SIZES,
  DATE_TIME_FORMATS as datetimeFormats,
} from '@/constants'
import { getFullName } from '@/common/utils'
import { fetchAccountCustomers } from '@/services/wallet'
import { getPaginationLabel, removeFalsyValues } from '@/helper'
import { updateSignatoryStatus, getAccountSignatories } from '@/services/account'
import type { AccountSignatories } from '@/services/account/accountTypes'
import type { IStateUser, IUserStatus, IUser } from './types'
import { userActions } from './types'
import ManageRightsDrawer from '@/common/components/ManageRightsDrawer'
import NoResult from '@/common/components/NoResult'
import FormSearch from '@/common/components/FormSearch'

const { d, t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const route = useRoute()
const selectedRow = ref(undefined)
const isManageRightsDrawerOpened = ref(false)
const { user } = storeToRefs(commonStore())

const state: IStateUser = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPage: undefined,
  totalItems: undefined,
  isLoading: false,
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

const paginationLabel = computed(() => getPaginationLabel<IUser>(t('on'), state))

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
    const formattedData: IUser[] = items.map((userFromApi) => {
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

    /**
     * 🛠️ TODO: Need to get pagination data from API
     */
    state.data = formattedData
    state.totalItems = totalItems
    state.currentPage = currentPage
    state.totalPage = totalPage
  } catch (err) {
    console.error(err)
  } finally {
    state.isLoading = false
  }
}

/**
 * 🛠️ TODO: Need to add a global function for retrieving status instead of creating it each time
 */
const getStatus = (status: string): IUserStatus => {
  switch (status) {
    case 'Declared':
      return {
        text: t('statusDeclared'),
        icon: PIPatchCheck,
        color: 'gray-900',
      }
    case 'Connected':
      return {
        text: t('statusConnect'),
        icon: PIPower,
        color: 'success',
      }
    default:
      return {
        text: t('statusInvite'),
        icon: PIPerson,
        color: 'persian',
      }
  }
}

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.search = newSearchValue
}

const handlePageRangeChanged = (newValue: number) => {
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
}

// Signatory addition scope
const currentEntity = computed(() => user.value?.entities.default)

async function handleAddSignatory(contactId: IUser['contactId'], contactFullName: string) {
  if (!currentEntity.value) return

  try {
    await updateSignatoryStatus(currentEntity.value.accountId, contactId)
    showAddSignatorySuccess(contactFullName)
    setAccountSignatories()
  } catch (error) {
    showTechnicalError()
  }
}

async function handleRemoveSignatory(contactId: IUser['contactId'], contactFullName: string) {
  if (!currentEntity.value) return
  try {
    await updateSignatoryStatus(currentEntity.value.accountId, contactId, false)
    showRemoveSignatorySuccess(contactFullName)
    setAccountSignatories()
  } catch (error) {
    showTechnicalError()
  }
}

const accountSignatories = ref<AccountSignatories[]>([])
function isContactSignatory(contactId: IUser['contactId']) {
  return !!accountSignatories.value.find((signatory) => signatory.contactId === contactId)
}

function hasMultipleSignatories() {
  return accountSignatories.value.length > 1
}

async function setAccountSignatories() {
  if (!currentEntity.value) return
  state.isLoading = true
  try {
    const signatories = await getAccountSignatories(currentEntity.value.accountId)
    accountSignatories.value.length = 0
    accountSignatories.value.push(...signatories)
    // eslint-disable-next-line no-console
    console.log('EFUBREUFEB', accountSignatories.value)
  } catch (error) {
    console.error(error)
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

function showRemoveSignatorySuccess(userFullName: string) {
  PNotification({
    message: t('signatoryRemoved', { userFullName }),
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
  await formatAndFillUsersCollabTable()
  await setAccountSignatories()
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
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
  dateAccess: 'First date access'
  assignSignatory: 'Designate as signatory'
  removeSignatory: 'Revoke signatory status'
  modifyRights: 'Change the rights'
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
  dateAccess: "Date d'ajout"
  assignSignatory: 'Désigner en tant que signataire'
  removeSignatory: 'Retirer le statut de signataire'
  modifyRights: 'Modifier les droits'
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
