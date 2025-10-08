<template>
  <div class="flex flex--direction-column user-clients">
    <div class="flex--grow-1 padding--2">
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
        @refresh-customers-list="fetchUsers"
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
          class="user-clients__search-bar margin-right--4 max-width-500"
          :placeholder="t('searchUsers')"
          @search-value-submitted="handleSearchValueSubmitted"
        />
        <PButton
          v-if="isAddUserButtonVisible"
          pType="primary"
          pSize="small"
          data-testid="add-customer-button"
          @click="isAddCustomerDrawerOpened = true"
        >
          <PIcon pName="personAdd" />
          <span class="padding-left--2">{{ t('addCustomer') }}</span>
        </PButton>
      </div>

      <div
        v-if="state.isLoading"
        class="loader flex flex--justify-content-center flex--align-items-center"
      >
        <PLoader pType="primary" pSize="50" />
      </div>

      <div v-show="state.isLoading === false">
        <TableData
          v-if="state.data.length"
          :data="state.data"
          :isInAnEntityPage="!!entityId"
          @click-view-information="handleClickViewInformation"
          @display-manage-rights="handleDisplayManageRights"
          @remove-user="handleRemoveUser"
          @sort-user="handleSortUser"
        />

        <NoResult v-if="state.data.length === 0" />
      </div>
    </div>

    <PPagination
      v-if="shouldShowPagination && state.totalItems"
      v-model:p-current-page="state.currentPage"
      v-model:p-page-size="state.limit"
      :pTotal="state.totalItems"
      :pPageSizes="PAGE_SIZES"
      pPageSizeSelectorSuffix=""
      pShowTotalPageCounter
      class="flex--grow-0 flex--shrink-0 margin-negative-x--2"
      @on-page-range-changed="handlePageRangeChanged"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>

    <RemoveUserDialog
      v-if="state.isRemoveUserDialogOpened && state.userToRemove"
      v-model="state.isRemoveUserDialogOpened"
      :userToRemove="state.userToRemove"
      @user-removed="fetchUsers"
    />

    <DrawerUserDetails
      v-if="state.isDrawerViewDetailsOpened"
      v-model="state.isDrawerViewDetailsOpened"
      :userId="state.selectedUserId"
      :hasDrawerOpened="state.isDrawerViewDetailsOpened"
      :editMode="canEdit"
      data-testid="viewinfo-drawer"
      @contact-patched="handlePatch"
    />

    <ManageRightsDrawer
      v-if="state.isManageRightsDrawerOpened && selectedEntity !== undefined"
      v-model="state.isManageRightsDrawerOpened"
      :selectedUser="getUserInfo"
      :selectedEntity="selectedEntity"
    />
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PLoader, PPagination, PButton, PIcon } from '@pulse/styleguide/components'
import { CurrentUserManager } from '@pulse/common/managers'
import { removeFalsyValues } from '@pulse/toolbox/utils/object'
import { PAGE_SIZES, ACTION_PERMISSIONS } from '@pulse/common/constants'
import NoResult from '@entities/common/components/NoResult'
import FormSearch from '@entities/common/components/FormSearch'
import ManageRightsDrawer from '@entities/common/components/ManageRightsDrawer'
import TableData from './components/TableData'
import DrawerUserDetails from './components/DrawerUserDetails'
import RemoveUserDialog from './components/RemoveUserDialog'
import AddCustomerDrawer from './components/add-customer-drawer'
import type { User } from '../usersCollab/types'
import { formatItemsFromApi } from './UsersClientHelper'
import type { UsersClientProps, State } from './UsersClientTypes'
import { getPrincipalContacts } from '@entities/services/offer'
import type { ClientContact } from '@entities/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import { fetchAccountContacts, fetchCustomers } from '@entities/services/wallet'
import { storeToRefs } from 'pinia'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'
import { ContactType } from '@pulse/common/enums'
import type { SortingCriteria } from '@pulse/common/types'
import { useSort } from '@pulse/common/composables/sort'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const userStore = useUserStore()

const state: State = reactive({
  data: [],
  currentPage: 1,
  limit: 15,
  totalPages: undefined,
  totalItems: undefined,
  search: undefined,
  sorting: {
    descending: false,
    field: undefined,
  },
  isLoading: true,
  isDrawerViewDetailsOpened: false,
  isManageRightsDrawerOpened: false,
  isRemoveUserDialogOpened: false,
  selectedUserId: 0,
  userToRemove: undefined,
})

const isMounted = ref(false)

const canAddUser = computed(() => CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ADD_USERS))

const handleSearchValueSubmitted = (newSearchValue: string) => {
  state.currentPage = 1
  state.search = newSearchValue
}

const handlePageRangeChanged = (newItemsPerPage: number) => {
  state.currentPage = 1
  state.limit = newItemsPerPage
}

const paginationLabel = computed(
  () =>
    `${1 + (state.currentPage - 1) * state.limit}
    - ${(state.currentPage - 1) * state.limit + state.data.length}
    ${t('on')} ${state.totalItems}`,
)

const shouldShowPagination = computed(
  () => !state.isLoading && state.totalItems,
)

const canEdit = computed(() => CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MODIFY_RIGHTS_USER))

const getUserInfo = computed(() => {
  const userInfo = state.data.find(
    (user) => user.contactId === state.selectedUserId,
  )

  return {
    ...userInfo,
    role: userInfo?.personaName,
  } as User
})

function getQueryParams(type: string | undefined) {
  return {
    pageNumber: state.currentPage,
    pageSize: state.limit,
    search: state.search,
    'sorting.field': state.sorting.field,
    'sorting.descending': state.sorting.descending,
    Type: type,
  }
}

const props = defineProps<UsersClientProps>()

async function fetchUsers() {
  state.isLoading = true

  try {
    const type = props.entityId ? ContactType.CUSTOMER : undefined
    const queryParams = getQueryParams(type)
    const queryParamsWithoutUndefined = removeFalsyValues(queryParams)
    const searchParams = new URLSearchParams(queryParamsWithoutUndefined)
    const data = props.entityId
      ? await fetchAccountContacts(props.entityId, searchParams)
      : await fetchCustomers(searchParams)

    const { items, currentPage, totalPages, totalItems } = data

    state.data = formatItemsFromApi(items, userStore.user?.id, principalContacts.value)
    state.currentPage = currentPage
    state.totalPages = totalPages
    state.totalItems = totalItems
  } catch (err) {
    logger.error(err)
  } finally {
    state.isLoading = false
  }
}

const handlePatch = async () => {
  await fetchUsers()
}
const handleClickViewInformation = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isDrawerViewDetailsOpened = true
}

const handleDisplayManageRights = (selectedUserId: number) => {
  state.selectedUserId = selectedUserId
  state.isManageRightsDrawerOpened = true
}

const handleRemoveUser = (row: any) => {
  state.userToRemove = row
  state.isRemoveUserDialogOpened = true
}

const handleSortUser = async (param: SortingCriteria) => {
  const { handleSortCriteria } = useSort()
  handleSortCriteria(param, state)
}

const selectedEntityStore = useSelectedEntityStore()
const { selectedEntity } = storeToRefs(selectedEntityStore)

const currentEntityId = computed(() => selectedEntity.value?.accountId)
const currentEntityName = computed(() => selectedEntity.value?.legalName)
const currentEntityNumber = computed(() => selectedEntity.value?.accountNumber)

const isAddCustomerDrawerOpened = ref(false)
const principalContacts = ref<ClientContact[]>([])

const isAddUserButtonVisible = computed(() =>
  currentEntityId.value &&
  isMounted.value &&
  canAddUser.value &&
  route.name === 'users',
)

onMounted(async () => {
  isMounted.value = true
  await loadPrincipalContacts()
  await fetchUsers()
})

watch(
  () => [
    state.currentPage,
    state.limit,
    state.search,
    state.sorting.field,
    state.sorting.descending,
  ],
  async () => {
    await fetchUsers()
  },
)

watch(currentEntityId, async () => await loadPrincipalContacts())

async function loadPrincipalContacts() {
  if (currentEntityId.value) {
    principalContacts.value = await getPrincipalContacts(currentEntityId.value) ?? []
  }
}
</script>

<style lang="scss" scoped>
.user-clients {
  &__search-bar {
    width: 100%;
  }
  // due to the bottom bar on small screens
  @media (min-width: 993px) {
    min-height: 100%;
  }
}
</style>

<i18n lang="yaml">
en-US:
  addCustomer: "Add a customer"
  searchUsers: 'Search by name, first name, email'
  on: 'on'
fr-FR:
  addCustomer: "Ajouter un utilisateur"
  searchUsers: 'Rechercher par nom, prénom, e-mail'
  on: 'sur'
</i18n>
